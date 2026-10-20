import { Link } from '@tanstack/react-router'
import {
  ArrowUpRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  EyeIcon,
  LayoutGridIcon,
  ListIcon,
  MoreHorizontalIcon,
  PencilIcon,
  SearchIcon,
  Trash2Icon,
  UploadIcon,
} from 'lucide-react'
import type { DragEvent, ReactNode } from 'react'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

import {
  ASSET_DRAG_TYPE,
  ASSETS_DIR,
  type AssetEntry,
  type AssetKindFilter,
  type AssetSort,
  type AssetUsageFilter,
  assetImportLine,
  filterAssets,
  formatBytes,
  normalizeAssetName,
  renamedCopy,
  validateAssetName,
} from './asset-files'
import {
  deleteAsset,
  errorMessage,
  getAssets,
  renameAsset,
  uploadAsset,
  useAssetLibrary,
  usagesOf,
} from './asset-client'
import { AssetThumb } from './asset-thumb'

type Variant = 'page' | 'panel'
type ViewMode = 'grid' | 'list'
type Status = { tone: 'info' | 'error'; text: string } | null
type ConflictChoice = 'replace' | 'keep' | 'cancel'

const VIEW_KEY = 'asset-library:view'
const SORT_KEY = 'asset-library:sort'

const KIND_LABELS: Record<AssetKindFilter, string> = {
  all: 'All types',
  image: 'Images',
  font: 'Fonts',
  video: 'Videos',
  other: 'Other',
}
const USAGE_LABELS: Record<AssetUsageFilter, string> = {
  all: 'Any usage',
  used: 'Used',
  unused: 'Unused',
}
const SORT_LABELS: Record<string, string> = {
  'name:asc': 'Name A–Z',
  'name:desc': 'Name Z–A',
  'modified:desc': 'Newest first',
  'modified:asc': 'Oldest first',
  'size:desc': 'Largest first',
  'size:asc': 'Smallest first',
}

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const value = window.localStorage.getItem(key)
    return allowed.includes(value as T) ? (value as T) : fallback
  } catch {
    return fallback
  }
}

function writeStored(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Blocked storage only forgets the preference.
  }
}

function dragHasFiles(event: DragEvent): boolean {
  return event.dataTransfer.types.includes('Files')
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function usageLabel(asset: AssetEntry): string {
  const files = asset.usages.length
  return files === 0 ? 'Unused' : `Used in ${files} ${files === 1 ? 'file' : 'files'}`
}

function useStatus(): [Status, (status: Status) => void] {
  const [status, setStatus] = useState<Status>(null)
  useEffect(() => {
    if (!status) return
    const id = setTimeout(() => setStatus(null), status.tone === 'error' ? 6000 : 2500)
    return () => clearTimeout(id)
  }, [status])
  return [status, setStatus]
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * The global asset library (`<root>/assets/`). `page` is the full `/assets`
 * route; `panel` is the narrow studio sidebar tab, whose image cards can be
 * dragged onto an image on the slide to swap it.
 */
export function AssetManager({ variant }: { variant: Variant }) {
  const library = useAssetLibrary()
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [kind, setKind] = useState<AssetKindFilter>('all')
  const [usage, setUsage] = useState<AssetUsageFilter>('all')
  const [sortValue, setSortValue] = useState('name:asc')
  const [view, setView] = useState<ViewMode>('grid')
  const [status, setStatus] = useStatus()
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragDepth = useRef(0)
  const fileInput = useRef<HTMLInputElement>(null)

  const [conflict, setConflict] = useState<{
    name: string
    resolve: (choice: ConflictChoice) => void
  } | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<AssetEntry | null>(null)
  const [previewing, setPreviewing] = useState<string | null>(null)

  useEffect(() => {
    if (variant !== 'page') return
    setView(readStored<ViewMode>(VIEW_KEY, ['grid', 'list'], 'grid'))
    setSortValue(readStored(SORT_KEY, Object.keys(SORT_LABELS), 'name:asc'))
  }, [variant])

  const sort = useMemo<AssetSort>(() => {
    const [key, direction] = sortValue.split(':') as [AssetSort['key'], AssetSort['direction']]
    return { key, direction }
  }, [sortValue])

  const visible = useMemo(
    () =>
      filterAssets(
        library.assets,
        variant === 'page' ? { query: deferredQuery, kind, usage } : { query: deferredQuery },
        variant === 'page' ? sort : undefined,
      ),
    [library.assets, deferredQuery, kind, usage, sort, variant],
  )
  const preview = previewing ? (library.assets.find((a) => a.name === previewing) ?? null) : null

  if (!library.available) {
    return <EmptyState>Asset management is only available in dev mode (`vp dev`).</EmptyState>
  }

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return
    setUploading(true)
    let uploaded = 0
    try {
      for (const file of files) {
        const name = normalizeAssetName(file.name)
        if (!validateAssetName(name)) {
          setStatus({
            tone: 'error',
            text: `Can't upload "${file.name}": use a plain file name with an extension.`,
          })
          continue
        }
        const taken = getAssets().map((a) => a.name)
        const clash = taken.find((t) => t.toLowerCase() === name.toLowerCase())
        let target = name
        let overwrite = false
        if (clash) {
          const choice = await new Promise<ConflictChoice>((resolve) =>
            setConflict({ name: clash, resolve }),
          )
          setConflict(null)
          if (choice === 'cancel') continue
          if (choice === 'replace') {
            target = clash
            overwrite = true
          } else {
            target = renamedCopy(name, taken)
          }
        }
        try {
          await uploadAsset(file, { name: target, overwrite })
          uploaded++
        } catch (cause) {
          setStatus({
            tone: 'error',
            text: `${file.name}: ${errorMessage(cause, 'upload failed')}`,
          })
        }
      }
    } finally {
      setUploading(false)
    }
    if (uploaded > 0) {
      setStatus({
        tone: 'info',
        text: uploaded === 1 ? 'Uploaded 1 file' : `Uploaded ${uploaded} files`,
      })
    }
  }

  async function commitRename(asset: AssetEntry, next: string) {
    setRenaming(null)
    const name = normalizeAssetName(next)
    if (name === asset.name) return
    if (!validateAssetName(name)) {
      setStatus({ tone: 'error', text: 'Use a plain file name with an extension.' })
      return
    }
    try {
      const result = await renameAsset(asset.name, name)
      const files = result.updatedFiles.length
      setStatus({
        tone: 'info',
        text:
          files === 0
            ? `Renamed to ${result.name}`
            : `Renamed to ${result.name} and updated ${files} ${files === 1 ? 'import' : 'imports'}`,
      })
    } catch (cause) {
      setStatus({ tone: 'error', text: errorMessage(cause, 'Rename failed') })
    }
  }

  async function copyImport(asset: AssetEntry) {
    const ok = await copyText(assetImportLine(asset.name))
    setStatus(
      ok
        ? { tone: 'info', text: 'Import copied' }
        : { tone: 'error', text: 'Clipboard unavailable' },
    )
  }

  function onDragEnter(event: DragEvent) {
    if (!dragHasFiles(event)) return
    event.preventDefault()
    dragDepth.current++
    setDragging(true)
  }

  function onDragLeave(event: DragEvent) {
    if (!dragHasFiles(event)) return
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setDragging(false)
  }

  function onDrop(event: DragEvent) {
    if (!dragHasFiles(event)) return
    event.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    void uploadFiles([...event.dataTransfer.files])
  }

  const actions = (asset: AssetEntry) => ({
    onPreview: () => setPreviewing(asset.name),
    onCopy: () => void copyImport(asset),
    onRename: () => setRenaming(asset.name),
    onDelete: () => setDeleting(asset),
  })

  const uploadButton = (
    <Button
      variant={variant === 'page' ? 'default' : 'outline'}
      size={variant === 'page' ? 'default' : 'icon'}
      disabled={uploading}
      aria-label="Upload files"
      title="Upload files"
      onClick={() => fileInput.current?.click()}
    >
      {uploading ? <Spinner data-icon="inline-start" /> : <UploadIcon data-icon="inline-start" />}
      {variant === 'page' ? 'Upload' : null}
    </Button>
  )

  const search = (
    <div className="relative min-w-0 flex-1">
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={query}
        placeholder="Search assets"
        aria-label="Search assets"
        className="pl-8"
        onChange={(event) => setQuery(event.target.value)}
      />
    </div>
  )

  const empty =
    library.assets.length === 0
      ? library.loaded
        ? 'No assets yet. Upload files or drop them here.'
        : null
      : visible.length === 0
        ? 'No assets match.'
        : null

  return (
    <section
      aria-label="Asset library"
      className="relative flex min-h-0 flex-1 flex-col"
      onDragEnter={onDragEnter}
      onDragOver={(event) => {
        if (dragHasFiles(event)) event.preventDefault()
      }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        ref={fileInput}
        type="file"
        multiple
        hidden
        onChange={(event) => {
          const files = [...(event.target.files ?? [])]
          event.target.value = ''
          void uploadFiles(files)
        }}
      />

      {variant === 'page' ? (
        <div className="flex flex-col gap-3 border-b px-4 py-3 md:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{ASSETS_DIR}/</code>
            <span className="text-sm text-muted-foreground">
              {library.assets.length} {library.assets.length === 1 ? 'file' : 'files'} · import with{' '}
              <code className="font-mono text-xs">@assets/…</code>
            </span>
            <div className="ml-auto">{uploadButton}</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex w-full sm:w-64">{search}</div>
            <ChoiceMenu
              label={KIND_LABELS[kind]}
              heading="Type"
              value={kind}
              options={KIND_LABELS}
              onChange={setKind}
            />
            <ChoiceMenu
              label={USAGE_LABELS[usage]}
              heading="Usage"
              value={usage}
              options={USAGE_LABELS}
              onChange={setUsage}
            />
            <ChoiceMenu
              label={SORT_LABELS[sortValue]}
              heading="Sort"
              value={sortValue}
              options={SORT_LABELS}
              onChange={(value) => {
                setSortValue(value)
                writeStored(SORT_KEY, value)
              }}
            />
            <div className="ml-auto flex gap-1">
              {(['grid', 'list'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={view === mode ? 'secondary' : 'ghost'}
                  size="icon"
                  aria-label={mode === 'grid' ? 'Grid view' : 'List view'}
                  aria-pressed={view === mode}
                  onClick={() => {
                    setView(mode)
                    writeStored(VIEW_KEY, mode)
                  }}
                >
                  {mode === 'grid' ? <LayoutGridIcon /> : <ListIcon />}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 pb-2">
          {search}
          {uploadButton}
        </div>
      )}

      {status ? (
        <p
          role="status"
          className={cn(
            'truncate px-4 pt-2 text-xs md:px-6',
            variant === 'panel' && 'px-3 md:px-3',
            status.tone === 'error' ? 'text-destructive' : 'text-muted-foreground',
          )}
          title={status.text}
        >
          {status.text}
        </p>
      ) : library.error ? (
        <p className="truncate px-4 pt-2 text-xs text-destructive" title={library.error}>
          {library.error}
        </p>
      ) : null}

      <div
        className={cn(
          'min-h-0 flex-1 overflow-y-auto overscroll-contain',
          variant === 'page' ? 'p-4 md:p-6' : 'p-3 pt-2',
        )}
      >
        {empty ? (
          <EmptyState>{empty}</EmptyState>
        ) : !library.loaded ? (
          <EmptyState>
            <Spinner />
          </EmptyState>
        ) : variant === 'page' && view === 'list' ? (
          <AssetList
            assets={visible}
            renaming={renaming}
            actions={actions}
            onRename={commitRename}
            onCancelRename={() => setRenaming(null)}
          />
        ) : (
          <ul
            className={cn(
              'grid gap-3',
              variant === 'page'
                ? 'grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4'
                : 'grid-cols-2 gap-2',
            )}
          >
            {visible.map((asset) => (
              <li key={asset.name}>
                <AssetCard
                  asset={asset}
                  compact={variant === 'panel'}
                  renaming={renaming === asset.name}
                  {...actions(asset)}
                  onCommitRename={(next) => void commitRename(asset, next)}
                  onCancelRename={() => setRenaming(null)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {variant === 'panel' ? (
        <div className="flex flex-col gap-1.5 border-t p-3 text-xs text-muted-foreground">
          <p>Drag an image onto a slide image to replace it.</p>
          <Link
            to="/assets"
            className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
          >
            Open asset library
            <ArrowUpRightIcon aria-hidden className="size-3.5" />
          </Link>
        </div>
      ) : null}

      {dragging ? (
        <div className="pointer-events-none absolute inset-2 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-primary/60 bg-background/80 text-sm font-medium backdrop-blur-sm">
          Drop files to add them to {ASSETS_DIR}/
        </div>
      ) : null}

      <ConflictDialog
        name={conflict?.name ?? null}
        onChoose={(choice) => conflict?.resolve(choice)}
      />
      <DeleteDialog
        asset={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={(name) => setStatus({ tone: 'info', text: `Deleted ${name}` })}
      />
      <PreviewDialog
        asset={preview}
        onClose={() => setPreviewing(null)}
        onCopy={(asset) => void copyImport(asset)}
      />
    </section>
  )
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-32 items-center justify-center px-4 py-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  )
}

function ChoiceMenu<T extends string>({
  label,
  heading,
  value,
  options,
  onChange,
}: {
  label: string
  heading: string
  value: T
  options: Record<T, string>
  onChange: (value: T) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {label}
        <ChevronDownIcon data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto min-w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{heading}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as T)}>
            {(Object.keys(options) as T[]).map((key) => (
              <DropdownMenuRadioItem key={key} value={key}>
                {options[key]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type AssetActions = {
  onPreview: () => void
  onCopy: () => void
  onRename: () => void
  onDelete: () => void
}

function AssetMenu({
  asset,
  onPreview,
  onCopy,
  onRename,
  onDelete,
}: { asset: AssetEntry } & AssetActions) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Actions for ${asset.name}`}
            className="shrink-0"
          />
        }
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onPreview}>
            <EyeIcon />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCopy}>
            <CopyIcon />
            Copy import
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRename}>
            <PencilIcon />
            Rename
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function startAssetDrag(event: DragEvent, asset: AssetEntry) {
  event.dataTransfer.setData(ASSET_DRAG_TYPE, asset.name)
  event.dataTransfer.setData('text/plain', asset.importPath)
  event.dataTransfer.effectAllowed = 'copy'
}

function AssetCard({
  asset,
  compact,
  renaming,
  onCommitRename,
  onCancelRename,
  ...actions
}: {
  asset: AssetEntry
  compact: boolean
  renaming: boolean
  onCommitRename: (name: string) => void
  onCancelRename: () => void
} & AssetActions) {
  const draggable = asset.kind === 'image'
  return (
    <div className="group flex flex-col gap-1.5">
      <button
        type="button"
        draggable={draggable}
        onDragStart={draggable ? (event) => startAssetDrag(event, asset) : undefined}
        onClick={actions.onPreview}
        title={draggable ? `${asset.name} — drag onto a slide image to use it` : asset.name}
        className={cn(
          'overflow-hidden rounded-lg ring-1 ring-border transition-shadow outline-none hover:ring-foreground/25 focus-visible:ring-3 focus-visible:ring-ring/50',
          draggable && 'cursor-grab active:cursor-grabbing',
        )}
      >
        <AssetThumb asset={asset} className="aspect-square w-full" />
      </button>
      <div className="flex min-w-0 items-start gap-1">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 px-0.5">
          {renaming ? (
            <RenameField name={asset.name} onCommit={onCommitRename} onCancel={onCancelRename} />
          ) : (
            <span className="truncate text-xs font-medium" title={asset.name}>
              {asset.name}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            {compact ? null : <span>{formatBytes(asset.size)}</span>}
            <UsageBadge asset={asset} compact={compact} />
          </span>
        </div>
        <AssetMenu asset={asset} {...actions} />
      </div>
    </div>
  )
}

function UsageBadge({ asset, compact = false }: { asset: AssetEntry; compact?: boolean }) {
  const used = asset.usages.length > 0
  return (
    <Badge
      variant={used ? 'secondary' : 'outline'}
      className="h-4 px-1.5 text-[10px]"
      title={
        used
          ? `${usageLabel(asset)}:\n${asset.usages.map((u) => u.file).join('\n')}`
          : 'Not imported anywhere in src/'
      }
    >
      {used && compact ? 'Used' : usageLabel(asset)}
    </Badge>
  )
}

function AssetList({
  assets,
  renaming,
  actions,
  onRename,
  onCancelRename,
}: {
  assets: AssetEntry[]
  renaming: string | null
  actions: (asset: AssetEntry) => AssetActions
  onRename: (asset: AssetEntry, next: string) => Promise<void>
  onCancelRename: () => void
}) {
  return (
    <ul className="flex flex-col divide-y rounded-lg ring-1 ring-border">
      {assets.map((asset) => (
        <li key={asset.name} className="flex items-center gap-3 px-3 py-2">
          <button
            type="button"
            draggable={asset.kind === 'image'}
            onDragStart={(event) => startAssetDrag(event, asset)}
            onClick={actions(asset).onPreview}
            aria-label={`Preview ${asset.name}`}
            className="shrink-0 overflow-hidden rounded-md ring-1 ring-border outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <AssetThumb asset={asset} className="size-10" />
          </button>
          <div className="flex min-w-0 flex-1 flex-col">
            {renaming === asset.name ? (
              <RenameField
                name={asset.name}
                onCommit={(next) => void onRename(asset, next)}
                onCancel={onCancelRename}
              />
            ) : (
              <span className="truncate text-sm font-medium" title={asset.name}>
                {asset.name}
              </span>
            )}
            <span className="truncate text-xs text-muted-foreground">{asset.mime}</span>
          </div>
          <span className="hidden w-28 text-right text-xs text-muted-foreground tabular-nums sm:block">
            {formatDate(asset.mtime)}
          </span>
          <span className="hidden w-16 text-right text-xs text-muted-foreground tabular-nums sm:block">
            {formatBytes(asset.size)}
          </span>
          <span className="w-28 text-right">
            <UsageBadge asset={asset} />
          </span>
          <AssetMenu asset={asset} {...actions(asset)} />
        </li>
      ))}
    </ul>
  )
}

function RenameField({
  name,
  onCommit,
  onCancel,
}: {
  name: string
  onCommit: (name: string) => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const done = useRef(false)

  useEffect(() => {
    const input = ref.current
    if (!input) return
    input.focus()
    const dot = name.lastIndexOf('.')
    input.setSelectionRange(0, dot > 0 ? dot : name.length)
  }, [name])

  function finish(commit: boolean) {
    if (done.current) return
    done.current = true
    if (commit && ref.current) onCommit(ref.current.value)
    else onCancel()
  }

  return (
    <Input
      ref={ref}
      defaultValue={name}
      aria-label={`Rename ${name}`}
      className="h-6 px-1.5 text-xs md:text-xs"
      onKeyDown={(event) => {
        event.stopPropagation()
        if (event.key === 'Enter') finish(true)
        if (event.key === 'Escape') finish(false)
      }}
      onBlur={() => finish(true)}
    />
  )
}

function ConflictDialog({
  name,
  onChoose,
}: {
  name: string | null
  onChoose: (choice: ConflictChoice) => void
}) {
  return (
    <Dialog open={name !== null} onOpenChange={(open) => !open && onChoose('cancel')}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{name} already exists</DialogTitle>
          <DialogDescription>
            Replace it everywhere it is imported, or keep both by saving a renamed copy.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onChoose('cancel')}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => onChoose('keep')}>
            Keep both
          </Button>
          <Button onClick={() => onChoose('replace')}>Replace</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDialog({
  asset,
  onClose,
  onDeleted,
}: {
  asset: AssetEntry | null
  onClose: () => void
  onDeleted: (name: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [blockedBy, setBlockedBy] = useState<AssetEntry['usages']>([])

  useEffect(() => {
    setError(null)
    setBlockedBy([])
  }, [asset])

  const usages = blockedBy.length > 0 ? blockedBy : (asset?.usages ?? [])
  const inUse = usages.length > 0

  async function confirm() {
    if (!asset) return
    setBusy(true)
    setError(null)
    try {
      await deleteAsset(asset.name)
      onDeleted(asset.name)
      onClose()
    } catch (cause) {
      setBlockedBy(usagesOf(cause))
      setError(errorMessage(cause, 'Delete failed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={asset !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {asset?.name}?</DialogTitle>
          <DialogDescription>
            {inUse
              ? 'This file is still imported, so deleting it would break these files. Swap or remove the imports first.'
              : 'The file is removed from assets/. Nothing imports it.'}
          </DialogDescription>
        </DialogHeader>
        {inUse ? (
          <ul className="flex flex-col gap-1 rounded-lg bg-muted/60 p-3 font-mono text-xs">
            {usages.map((u) => (
              <li key={u.file} className="truncate" title={u.file}>
                {u.file}
                {u.count > 1 ? <span className="text-muted-foreground"> ×{u.count}</span> : null}
              </li>
            ))}
          </ul>
        ) : null}
        {error && !inUse ? <p className="text-xs text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={inUse || busy} onClick={() => void confirm()}>
            {busy ? <Spinner data-icon="inline-start" /> : <Trash2Icon data-icon="inline-start" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PreviewDialog({
  asset,
  onClose,
  onCopy,
}: {
  asset: AssetEntry | null
  onClose: () => void
  onCopy: (asset: AssetEntry) => void
}) {
  const [copied, setCopied] = useState(false)
  useEffect(() => setCopied(false), [asset])

  return (
    <Dialog open={asset !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        {asset ? (
          <>
            <DialogHeader>
              <DialogTitle className="truncate pr-8">{asset.name}</DialogTitle>
              <DialogDescription>
                {asset.mime} · {formatBytes(asset.size)} · modified {formatDate(asset.mtime)}
              </DialogDescription>
            </DialogHeader>
            {asset.kind === 'image' ? (
              <div className="flex max-h-[55vh] justify-center overflow-hidden rounded-lg ring-1 ring-border">
                <AssetThumb asset={asset} className="max-h-[55vh] w-full [&_img]:max-h-[55vh]" />
              </div>
            ) : asset.kind === 'font' ? (
              <FontSample asset={asset} />
            ) : (
              <AssetThumb asset={asset} className="h-40 rounded-lg ring-1 ring-border" />
            )}
            <div className="flex items-center gap-2 rounded-lg bg-muted/60 p-2 pl-3">
              <code className="min-w-0 flex-1 truncate font-mono text-xs">
                {assetImportLine(asset.name)}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onCopy(asset)
                  setCopied(true)
                }}
              >
                {copied ? (
                  <CheckIcon data-icon="inline-start" />
                ) : (
                  <CopyIcon data-icon="inline-start" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {asset.usages.length === 0
                ? 'Not imported anywhere in src/ yet.'
                : `${usageLabel(asset)}: ${asset.usages.map((u) => u.file).join(', ')}`}
            </p>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function FontSample({ asset }: { asset: AssetEntry }) {
  const family = `asset-preview-${asset.name.replace(/[^a-z0-9]+/gi, '-')}`
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    setState('loading')
    const face = new FontFace(family, `url(${JSON.stringify(asset.url)})`)
    let cancelled = false
    face
      .load()
      .then((loaded) => {
        if (cancelled) return
        document.fonts.add(loaded)
        setState('ready')
      })
      .catch(() => {
        if (!cancelled) setState('error')
      })
    return () => {
      cancelled = true
      document.fonts.delete(face)
    }
  }, [family, asset.url])

  if (state !== 'ready') {
    return (
      <EmptyState>{state === 'error' ? 'This font could not be loaded.' : <Spinner />}</EmptyState>
    )
  }
  return (
    <div
      className="flex flex-col gap-2 overflow-hidden rounded-lg p-4 ring-1 ring-border"
      style={{ fontFamily: `'${family}'` }}
    >
      <p className="truncate text-[40px] leading-tight">The quick brown fox</p>
      <p className="truncate text-[28px] leading-tight">jumps over the lazy dog</p>
      <p className="text-[20px] leading-snug">
        ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
      </p>
    </div>
  )
}

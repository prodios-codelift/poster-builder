import { FileIcon, FileVideoIcon, TypeIcon } from 'lucide-react'
import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import type { AssetEntry } from './asset-files'

/** Light checkerboard so transparent PNG/SVG logos stay visible. */
export const CHECKERBOARD: CSSProperties = {
  backgroundImage:
    'conic-gradient(var(--muted) 25%, transparent 0 50%, var(--muted) 0 75%, transparent 0)',
  backgroundSize: '16px 16px',
}

export function AssetThumb({ asset, className }: { asset: AssetEntry; className?: string }) {
  const Icon = asset.kind === 'font' ? TypeIcon : asset.kind === 'video' ? FileVideoIcon : FileIcon
  return (
    <div
      className={cn('flex items-center justify-center overflow-hidden bg-background', className)}
      style={CHECKERBOARD}
    >
      {asset.kind === 'image' ? (
        <img
          src={asset.url}
          alt=""
          loading="lazy"
          draggable={false}
          className="size-full object-contain"
        />
      ) : (
        <Icon aria-hidden className="size-8 text-muted-foreground" />
      )}
    </div>
  )
}

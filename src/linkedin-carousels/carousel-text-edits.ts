import type { CarouselTextEdit } from './edit-carousel-source'

export type PendingCarouselEdit = CarouselTextEdit & {
  key: string
}

type Listener = () => void

type EditStore = {
  pending: Map<string, PendingCarouselEdit>
  listeners: Set<Listener>
}

const STORE_KEY = '__posterBuilderCarouselTextEdits__'

function getStore(): EditStore {
  const globalObject = globalThis as typeof globalThis & {
    [STORE_KEY]?: EditStore
  }
  if (!globalObject[STORE_KEY]) {
    globalObject[STORE_KEY] = {
      pending: new Map(),
      listeners: new Set(),
    }
  }
  return globalObject[STORE_KEY]
}

function emit() {
  // Defer so updates from contentEditable `input` handlers are not swallowed
  // when React is still finishing the native event.
  queueMicrotask(() => {
    for (const listener of getStore().listeners) listener()
  })
}

export function subscribeCarouselTextEdits(listener: Listener): () => void {
  const store = getStore()
  store.listeners.add(listener)
  return () => {
    store.listeners.delete(listener)
  }
}

export function getCarouselTextEditCount(): number {
  return getStore().pending.size
}

export function getPendingCarouselTextEdits(): PendingCarouselEdit[] {
  return [...getStore().pending.values()]
}

export function editKey(file: string, position: string): string {
  return `${file}@${position}`
}

export function upsertCarouselTextEdit(edit: PendingCarouselEdit): void {
  const store = getStore()
  if (edit.prevText === edit.nextText) {
    if (store.pending.has(edit.key)) {
      store.pending.delete(edit.key)
      emit()
    }
    return
  }
  store.pending.set(edit.key, edit)
  emit()
}

export function clearCarouselTextEdits(): void {
  const store = getStore()
  if (store.pending.size === 0) return
  store.pending = new Map()
  emit()
}

export function replaceCarouselTextEdits(edits: PendingCarouselEdit[]): void {
  getStore().pending = new Map(edits.map((edit) => [edit.key, edit]))
  emit()
}

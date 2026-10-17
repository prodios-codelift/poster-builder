import { useServerFn } from '@tanstack/react-start'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  addCarouselComment,
  listCarouselComments,
  removeCarouselComment,
  updateCarouselComment,
} from './carousel-comment-fns'
import type { CarouselComment } from './carousel-comments'

export type CarouselCommentsState = {
  comments: CarouselComment[]
  error: string | null
  /** `source` is the clicked element's `data-tsd-source`. */
  add: (input: { source: string; text: string; page: number }) => Promise<void>
  update: (id: string, text: string) => Promise<void>
  remove: (id: string) => Promise<void>
}

function messageOf(cause: unknown, fallback: string): string {
  return cause instanceof Error ? cause.message : fallback
}

/**
 * Dev-only: pending `@slide-comment` markers in `file`. Refetches after every
 * mutation and after each HMR update, so markers applied or deleted outside
 * the studio (e.g. by the apply-comment skill) drop off live.
 */
export function useCarouselComments({
  file,
  enabled,
}: {
  file: string | null
  enabled: boolean
}): CarouselCommentsState {
  const listFn = useServerFn(listCarouselComments)
  const addFn = useServerFn(addCarouselComment)
  const updateFn = useServerFn(updateCarouselComment)
  const removeFn = useServerFn(removeCarouselComment)
  const [comments, setComments] = useState<CarouselComment[]>([])
  const [error, setError] = useState<string | null>(null)
  const active = enabled && file ? file : null
  // Drops responses for a file the studio has already moved away from.
  const fileRef = useRef(active)
  fileRef.current = active

  const refresh = useCallback(async () => {
    const target = fileRef.current
    if (!target) return
    try {
      const next = await listFn({ data: { file: target } })
      if (fileRef.current !== target) return
      setComments(next)
      setError(null)
    } catch (cause) {
      if (fileRef.current === target) setError(messageOf(cause, 'Failed to load comments'))
    }
  }, [listFn])

  useEffect(() => {
    setComments([])
    setError(null)
    if (!active) return
    void refresh()
    const hot = import.meta.hot
    const onHotUpdate = () => void refresh()
    hot?.on('vite:afterUpdate', onHotUpdate)
    return () => hot?.off('vite:afterUpdate', onHotUpdate)
  }, [active, refresh])

  const add = useCallback<CarouselCommentsState['add']>(
    async ({ source, text, page }) => {
      await addFn({ data: { source, text, page } })
      await refresh()
    },
    [addFn, refresh],
  )

  const update = useCallback<CarouselCommentsState['update']>(
    async (id, text) => {
      const target = fileRef.current
      if (!target) return
      await updateFn({ data: { file: target, id, text } })
      await refresh()
    },
    [updateFn, refresh],
  )

  const remove = useCallback<CarouselCommentsState['remove']>(
    async (id) => {
      const target = fileRef.current
      if (!target) return
      await removeFn({ data: { file: target, id } })
      await refresh()
    },
    [removeFn, refresh],
  )

  return { comments, error, add, update, remove }
}

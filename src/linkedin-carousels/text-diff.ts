/** Smallest single-range change turning `prevText` into `nextText`. */
export function textDiff(prevText: string, nextText: string) {
  let start = 0
  while (
    start < prevText.length &&
    start < nextText.length &&
    prevText[start] === nextText[start]
  ) {
    start += 1
  }

  let prevEnd = prevText.length
  let nextEnd = nextText.length
  while (prevEnd > start && nextEnd > start && prevText[prevEnd - 1] === nextText[nextEnd - 1]) {
    prevEnd -= 1
    nextEnd -= 1
  }

  return { start, end: prevEnd, value: nextText.slice(start, nextEnd) }
}

export type TextHunk = ReturnType<typeof textDiff>

const MAX_LCS_CELLS = 1_000_000

function hunkSize(hunk: TextHunk): number {
  return Math.max(hunk.end - hunk.start, hunk.value.length)
}

/**
 * The changes between two texts as separate hunks (in `prevText` offsets), so
 * edits in two places of a heading stay in their own source parts. Matches
 * shorter than the edits around them are folded in, so a replaced word is one
 * hunk rather than letter-level noise.
 */
export function textHunks(prevText: string, nextText: string): TextHunk[] {
  const outer = textDiff(prevText, nextText)
  if (outer.start === outer.end && outer.value === '') return []
  const a = prevText.slice(outer.start, outer.end)
  const b = outer.value
  const n = a.length
  const m = b.length
  if (n === 0 || m === 0 || n * m > MAX_LCS_CELLS) return [outer]

  // lcs[i * (m + 1) + j]: longest common subsequence of a[i:] and b[j:].
  const width = m + 1
  const lcs = new Uint16Array((n + 1) * width)
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i * width + j] =
        a[i] === b[j]
          ? (lcs[(i + 1) * width + j + 1] ?? 0) + 1
          : Math.max(lcs[(i + 1) * width + j] ?? 0, lcs[i * width + j + 1] ?? 0)
    }
  }

  const raw: TextHunk[] = []
  let current: TextHunk | null = null
  let i = 0
  let j = 0
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) {
      if (current) raw.push(current)
      current = null
      i++
      j++
      continue
    }
    current ??= { start: outer.start + i, end: outer.start + i, value: '' }
    const insert =
      j < m && (i === n || (lcs[i * width + j + 1] ?? 0) >= (lcs[(i + 1) * width + j] ?? 0))
    if (insert) {
      current.value += b[j]
      j++
    } else {
      current.end = outer.start + i + 1
      i++
    }
  }
  if (current) raw.push(current)

  const merged: TextHunk[] = []
  for (const hunk of raw) {
    const prev = merged.at(-1)
    const gap = prev ? hunk.start - prev.end : Number.POSITIVE_INFINITY
    if (prev && gap <= Math.min(hunkSize(prev), hunkSize(hunk))) {
      merged[merged.length - 1] = {
        start: prev.start,
        end: hunk.end,
        value: prev.value + prevText.slice(prev.end, hunk.start) + hunk.value,
      }
    } else {
      merged.push(hunk)
    }
  }
  return merged
}

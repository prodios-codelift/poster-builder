import { describe, expect, it } from 'vite-plus/test'

import { textHunks } from './text-diff'

describe('textHunks', () => {
  it('keeps separate edits separate', () => {
    expect(textHunks('A buyer describes a life.', 'A client describes a life together.')).toEqual([
      { start: 2, end: 7, value: 'client' },
      { start: 24, end: 24, value: ' together' },
    ])
  })

  it('treats a replaced word as one change, not letter noise', () => {
    expect(textHunks('arrive in conversation, not', 'arrive in chat, not')).toEqual([
      { start: 11, end: 22, value: 'hat' },
    ])
  })

  it('returns nothing for identical text', () => {
    expect(textHunks('same', 'same')).toEqual([])
  })
})

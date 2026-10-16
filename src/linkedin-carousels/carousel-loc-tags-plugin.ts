import path from 'node:path'

import * as t from '@babel/types'
import type { Plugin } from 'vite-plus'

import { CAROUSEL_LOC_ATTR, formatCarouselLoc } from './carousel-loc'
import { parseCarouselSource, walkAst } from './edit-carousel-source'

function isFragmentName(name: t.JSXOpeningElement['name']): boolean {
  if (t.isJSXIdentifier(name)) return name.name === 'Fragment'
  return (
    t.isJSXMemberExpression(name) &&
    t.isJSXIdentifier(name.object) &&
    name.object.name === 'React' &&
    name.property.name === 'Fragment'
  )
}

function hasLocAttr(opening: t.JSXOpeningElement): boolean {
  return opening.attributes.some(
    (attr) =>
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.name) &&
      attr.name.name === CAROUSEL_LOC_ATTR,
  )
}

/**
 * Adds `data-carousel-loc` to every JSX element, components included: host
 * elements render it to the DOM, and component call sites keep it in their
 * fiber props, so inline editing can find `<Eyebrow>Copy</Eyebrow>` from the
 * `<p>{children}</p>` the browser actually shows.
 */
export function injectCarouselLocTags(code: string, carouselId: string): string | null {
  const ast = parseCarouselSource(code)
  if (!ast) return null

  const insertions: { offset: number; text: string }[] = []
  walkAst(ast, (node) => {
    if (!t.isJSXElement(node) || !node.loc) return
    const opening = node.openingElement
    if (isFragmentName(opening.name) || hasLocAttr(opening)) return
    // Attributes go after `<Name<TypeArgs>`.
    const after = opening.typeArguments ?? opening.name
    insertions.push({
      offset: after.end ?? 0,
      text: ` ${CAROUSEL_LOC_ATTR}="${formatCarouselLoc(carouselId, node.loc.start.line, node.loc.start.column)}"`,
    })
  })

  if (insertions.length === 0) return null
  insertions.sort((a, b) => b.offset - a.offset)
  let next = code
  for (const insertion of insertions) {
    next = next.slice(0, insertion.offset) + insertion.text + next.slice(insertion.offset)
  }
  return next
}

/** `<carouselsRoot>/<id>/index.tsx` → `<id>`; the only files inline editing writes to. */
export function carouselIdFromModuleId(id: string, carouselsRoot: string): string | null {
  const file = id.split(/[?#]/)[0]?.replace(/\\/g, '/') ?? ''
  const root = carouselsRoot.replace(/\\/g, '/').replace(/\/$/, '')
  if (!file.startsWith(`${root}/`)) return null
  const match = /^([a-z0-9-]+)\/index\.tsx$/.exec(file.slice(root.length + 1))
  return match?.[1] ?? null
}

/** Dev-only. Must run before other JSX transforms so locations match the file on disk. */
export function carouselLocTagsPlugin(): Plugin {
  let carouselsRoot = ''
  return {
    name: 'poster-builder:carousel-loc-tags',
    apply: 'serve',
    enforce: 'pre',
    configResolved(config) {
      carouselsRoot = path.resolve(config.root, 'src/linkedin-carousels/carousels')
    },
    transform(code, id) {
      const carouselId = carouselIdFromModuleId(id, carouselsRoot)
      if (!carouselId) return null
      const next = injectCarouselLocTags(code, carouselId)
      return next === null ? null : { code: next, map: null }
    },
  }
}

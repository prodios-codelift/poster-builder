import { parse } from '@babel/parser'
import * as t from '@babel/types'
import type { Plugin } from 'vite-plus'

/**
 * Dev-only plugin that stamps carousel JSX with the exact source file and
 * position of each editable thing, so the studio can write edits back without
 * guessing:
 *
 *   data-slide-file          project-relative path of the source file
 *   data-slide-position      "line:column" of the JSX element (1-based line,
 *                            0-based column)
 *   data-slide-element-type  "text" | "image" | "icon"
 *
 * No wrapper elements are added; attributes are inserted after tag names.
 *
 * - text (host):      <h1>Hi</h1> is tagged directly.
 * - text (component): <Title>Hi</Title> is tagged at the call site when Title
 *                     is declared in the same file and forwards a rest prop
 *                     onto the element it renders (see `SlideProps` in
 *                     slide-attrs.ts). Text components that don't forward get
 *                     a dev warning instead of silently being uneditable.
 * - image:            <img> is tagged directly.
 * - icon:             elements imported from lucide-react / @solar-icons/react.
 *
 * "Text" means every child is non-blank JSX text or a string literal. Text
 * from props, arrays, constants, `{expr}` children, mixed nested elements or
 * imported components is not marked.
 */

const CAROUSEL_FILE = /\/src\/linkedin-carousels\/carousels\/.+\.tsx$/
const ICON_SOURCES = [/^lucide-react$/, /^@solar-icons\/react(\/|$)/]

type Insertion = { at: number; text: string }
type ElementType = 'text' | 'image' | 'icon'

function positionOf(node: t.Node): string {
  const start = node.loc!.start
  return `${start.line}:${start.column}`
}

function isTextOnly(el: t.JSXElement): boolean {
  let hasText = false
  for (const child of el.children) {
    if (t.isJSXText(child)) {
      if (child.value.trim() !== '') hasText = true
    } else if (t.isJSXExpressionContainer(child) && t.isStringLiteral(child.expression)) {
      if (child.expression.value.trim() !== '') hasText = true
    } else {
      return false
    }
  }
  return hasText
}

function walk(node: unknown, visit: (n: t.Node) => boolean | void): void {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit)
    return
  }
  const n = node as t.Node
  if (typeof n.type !== 'string') return
  if (visit(n) === false) return
  for (const key of Object.keys(n)) {
    if (key === 'loc' || key === 'extra' || key.endsWith('Comments')) continue
    walk((n as unknown as Record<string, unknown>)[key], visit)
  }
}

type LocalComponent = { name: string; fn: t.Function }

function collectLocalComponents(ast: t.File): LocalComponent[] {
  const out: LocalComponent[] = []
  const isComponentName = (name: string) => /^[A-Z]/.test(name)
  for (const statement of ast.program.body) {
    const decl = t.isExportNamedDeclaration(statement) ? statement.declaration : statement
    if (t.isFunctionDeclaration(decl) && decl.id && isComponentName(decl.id.name)) {
      out.push({ name: decl.id.name, fn: decl })
    } else if (t.isVariableDeclaration(decl)) {
      for (const d of decl.declarations) {
        if (
          t.isIdentifier(d.id) &&
          isComponentName(d.id.name) &&
          (t.isArrowFunctionExpression(d.init) || t.isFunctionExpression(d.init))
        ) {
          out.push({ name: d.id.name, fn: d.init })
        }
      }
    }
  }
  return out
}

/**
 * True when `fn` destructures `children` plus a rest prop and spreads that rest
 * prop onto a host element, i.e. call-site data-slide-* props reach the DOM.
 */
function forwardsSlideProps(fn: t.Function): boolean {
  const param = fn.params[0]
  if (!t.isObjectPattern(param)) return false
  const hasChildren = param.properties.some(
    (p) =>
      t.isObjectProperty(p) &&
      t.isIdentifier(p.key, { name: 'children' }) &&
      t.isIdentifier(p.value, { name: 'children' }),
  )
  const rest = param.properties.find((p) => t.isRestElement(p))
  if (!hasChildren || !rest || !t.isRestElement(rest) || !t.isIdentifier(rest.argument)) {
    return false
  }
  const restName = rest.argument.name
  let spread = false
  walk(fn.body, (n) => {
    if (!t.isJSXElement(n)) return
    const name = n.openingElement.name
    if (!t.isJSXIdentifier(name) || !/^[a-z]/.test(name.name)) return
    if (
      n.openingElement.attributes.some(
        (attr) => t.isJSXSpreadAttribute(attr) && t.isIdentifier(attr.argument, { name: restName }),
      )
    ) {
      spread = true
    }
  })
  return spread
}

export type MarkResult = { code: string; warnings: string[] }

export function markSlideSource(code: string, file: string): MarkResult | null {
  let ast: t.File
  try {
    ast = parse(code, { sourceType: 'module', plugins: ['typescript', 'jsx'] })
  } catch {
    return null
  }

  const iconNames = new Set<string>()
  for (const statement of ast.program.body) {
    if (!t.isImportDeclaration(statement)) continue
    if (!ICON_SOURCES.some((pattern) => pattern.test(statement.source.value))) continue
    for (const specifier of statement.specifiers) iconNames.add(specifier.local.name)
  }

  const local = new Map<string, boolean>()
  for (const { name, fn } of collectLocalComponents(ast)) local.set(name, forwardsSlideProps(fn))

  const insertions: Insertion[] = []
  const unforwarded = new Set<string>()

  const tag = (el: t.JSXElement, type: ElementType) => {
    insertions.push({
      at: el.openingElement.name.end!,
      text:
        ` data-slide-file="${file}" data-slide-position="${positionOf(el)}"` +
        ` data-slide-element-type="${type}"`,
    })
  }

  walk(ast.program, (n) => {
    if (!t.isJSXElement(n)) return
    const name = n.openingElement.name
    if (!t.isJSXIdentifier(name)) return
    // Text inside svg is not editable HTML text.
    if (name.name === 'svg') return false
    if (/^[a-z]/.test(name.name)) {
      if (name.name === 'img') tag(n, 'image')
      else if (isTextOnly(n)) tag(n, 'text')
    } else if (iconNames.has(name.name)) {
      tag(n, 'icon')
    } else if (local.has(name.name) && isTextOnly(n)) {
      if (local.get(name.name)) tag(n, 'text')
      else unforwarded.add(name.name)
    }
  })

  const warnings = [...unforwarded].map(
    (name) =>
      `${file}: <${name}> renders text but does not forward slide props, so it can't be edited inline. ` +
      `Destructure \`...slide\` (type \`& SlideProps\`) and spread it onto the element that renders children.`,
  )
  if (insertions.length === 0 && warnings.length === 0) return null

  // Apply from the end so earlier offsets stay valid. Every insertion lands
  // on the line of its anchor, so line numbers in the output are unchanged.
  insertions.sort((a, b) => b.at - a.at)
  let out = code
  for (const { at, text } of insertions) out = out.slice(0, at) + text + out.slice(at)
  return { code: out, warnings }
}

export function slideSourcePlugin(): Plugin {
  let root = process.cwd()
  return {
    name: 'slide-source-markers',
    enforce: 'pre',
    apply: 'serve',
    configResolved(config) {
      root = config.root
    },
    transform(code, id) {
      const path = id.split('?')[0].replace(/\\/g, '/')
      if (!CAROUSEL_FILE.test(path)) return null
      const file = path.startsWith(`${root}/`) ? path.slice(root.length + 1) : path
      const result = markSlideSource(code, file)
      if (!result) return null
      for (const warning of result.warnings) this.warn(warning)
      return result.code === code ? null : { code: result.code, map: null }
    },
  }
}

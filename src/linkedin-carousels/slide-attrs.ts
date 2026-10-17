/**
 * Props the dev-only `vite-plugin-slide-source.ts` adds to a text component's
 * call site (`<Title data-slide-file=… data-slide-position=… …>`). A component
 * that renders its `children` as text must accept them and spread them onto
 * the element it renders, so the studio can find the source of the text:
 *
 *   function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
 *     return <h2 className="…" {...slide}>{children}</h2>
 *   }
 */
export type SlideProps = { [K in `data-slide-${string}`]?: string }

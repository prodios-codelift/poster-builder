// Theme demo: paper-editorial — keep components in lockstep with theme.md
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'

const TOKENS = {
  '--cx-bg': '#F5F0E6',
  '--cx-fg': '#1B1A17',
  '--cx-accent': '#C2410C',
  '--cx-muted': '#6B655A',
  '--cx-rule': 'rgba(27, 26, 23, 0.16)',
  '--cx-font-display': "'Fraunces', Georgia, serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

const AUTHOR = { name: 'Your Name', handle: '@yourhandle' }

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LinkedInCarouselSlide>
      <div
        style={TOKENS}
        className={cn(
          'flex size-full flex-col bg-(--cx-bg) px-[96px] pt-[112px] pb-[72px] font-(family-name:--cx-font-body) text-(--cx-fg)',
          className,
        )}
      >
        {children}
      </div>
    </LinkedInCarouselSlide>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[28px] leading-[1.2] font-bold tracking-[0.18em] text-(--cx-accent) uppercase">
      {children}
    </p>
  )
}

function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[128px] leading-[1.02] font-medium tracking-[-0.025em]">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[88px] leading-[1.05] font-medium tracking-[-0.02em]">
      {children}
    </h2>
  )
}

function Body({ children }: { children: ReactNode }) {
  return <p className="text-[40px] leading-[1.45] font-medium">{children}</p>
}

function Point({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-[32px] border-t border-(--cx-rule) pt-[32px]">
      <span className="w-[56px] shrink-0 font-(family-name:--cx-font-display) text-[56px] leading-none font-bold text-(--cx-accent)">
        {n}
      </span>
      <p className="text-[40px] leading-[1.35] font-semibold">{children}</p>
    </div>
  )
}

function SwipeCue() {
  return <p className="text-[30px] leading-[1.3] font-bold text-(--cx-accent)">Swipe →</p>
}

function AuthorCard() {
  return (
    <div className="flex flex-col gap-[8px] border-l-[6px] border-(--cx-accent) pl-[32px]">
      <p className="font-(family-name:--cx-font-display) text-[52px] leading-[1.1] font-bold">
        {AUTHOR.name}
      </p>
      <p className="text-[32px] leading-[1.3] font-semibold text-(--cx-muted)">{AUTHOR.handle}</p>
    </div>
  )
}

function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between border-t border-(--cx-rule) pt-[28px] text-[26px] leading-[1.3] font-semibold text-(--cx-muted)">
      <span>
        {AUTHOR.name} · {AUTHOR.handle}
      </span>
      <span className="tabular-nums">
        {pad(page)} / {pad(total)}
      </span>
    </div>
  )
}

function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Paper Editorial</Eyebrow>
        <Hero>Ideas worth a slow read</Hero>
        <Body>Warm paper, ink type and one rust accent. Built for thoughtful, text-led posts.</Body>
        <SwipeCue />
      </div>
      <Footer page={1} total={3} />
    </Frame>
  )
}

function Content() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[64px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The rules</Eyebrow>
          <Title>Three habits of a readable slide</Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="1">One idea per slide, nothing more.</Point>
          <Point n="2">Thirty words of body copy, at most.</Point>
          <Point n="3">One accent colour, used sparingly.</Point>
        </div>
      </div>
      <Footer page={2} total={3} />
    </Frame>
  )
}

function Closer() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Before you go</Eyebrow>
        <Title>Found this useful?</Title>
        <Body>Follow for a new carousel every week, and repost to share it with your network.</Body>
        <AuthorCard />
      </div>
      <Footer page={3} total={3} />
    </Frame>
  )
}

export const slides = [Cover, Content, Closer]

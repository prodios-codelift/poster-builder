// Theme demo: paper-editorial — keep components in lockstep with theme.md
import { cn } from 'cn'
import { BookOpen, Check, Feather, Lightbulb, type LucideIcon, PenLine, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#F5F0E6',
  '--cx-fg': '#1B1A17',
  '--cx-accent': '#C2410C',
  '--cx-muted': '#6B655A',
  '--cx-rule': 'rgba(27, 26, 23, 0.16)',
  '--cx-font-display': "'Fraunces', Georgia, serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  rust: {
    name: 'Rust',
    tokens: {
      '--cx-bg': '#F5F0E6',
      '--cx-fg': '#1B1A17',
      '--cx-accent': '#C2410C',
      '--cx-muted': '#6B655A',
      '--cx-rule': 'rgba(27, 26, 23, 0.16)',
    } as CSSProperties,
  },
  sage: {
    name: 'Sage',
    tokens: {
      '--cx-bg': '#EEF0E8',
      '--cx-fg': '#1A1E1A',
      '--cx-accent': '#3F6B4B',
      '--cx-muted': '#5A6158',
      '--cx-rule': 'rgba(26, 30, 26, 0.16)',
    } as CSSProperties,
  },
  'ink-blue': {
    name: 'Ink Blue',
    tokens: {
      '--cx-bg': '#F3F1EC',
      '--cx-fg': '#16181D',
      '--cx-accent': '#2547A8',
      '--cx-muted': '#5F6168',
      '--cx-rule': 'rgba(22, 24, 29, 0.16)',
    } as CSSProperties,
  },
} satisfies Record<string, { name: string; tokens: CSSProperties }>

const AUTHOR = { name: 'Your Name', handle: '@yourhandle' }

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LinkedInCarouselSlide tokens={TOKENS}>
      <div
        className={cn(
          'relative isolate flex size-full flex-col bg-(--cx-bg) px-[96px] pt-[112px] pb-[72px] font-(family-name:--cx-font-body) text-(--cx-fg)',
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

function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.2]" />
      <div className="absolute inset-0 bg-(--cx-bg) mix-blend-multiply" />
      <div className="absolute inset-0 bg-(--cx-fg) mix-blend-lighten" />
    </div>
  )
}

function IconCard({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[44px] border-t border-(--cx-rule) pt-[32px]">
      <Icon className="size-[88px] text-(--cx-accent)" strokeWidth={1.5} />
      <p className="text-[44px] leading-[1.3] font-semibold">{children}</p>
    </div>
  )
}

function Quote({ children, by }: { children: ReactNode; by: string }) {
  return (
    <figure className="flex flex-col gap-[40px]">
      <span className="font-(family-name:--cx-font-display) text-[180px] leading-[0.6] font-bold text-(--cx-accent)">
        “
      </span>
      <blockquote className="font-(family-name:--cx-font-display) text-[72px] leading-[1.12] font-medium tracking-[-0.015em]">
        {children}
      </blockquote>
      <figcaption className="text-[30px] leading-[1.3] font-semibold text-(--cx-muted)">
        — {by}
      </figcaption>
    </figure>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[28px]">
      <p className="font-(family-name:--cx-font-display) text-[240px] leading-[0.9] font-medium tracking-[-0.04em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[44px] leading-[1.3] font-semibold">{label}</p>
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div
      className={cn(
        'flex flex-col gap-[40px] border-t-[3px] pt-[28px]',
        kind === 'do' ? 'border-(--cx-fg)' : 'border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] text-[26px] leading-[1.2] font-bold tracking-[0.18em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[30px]" strokeWidth={2.5} />
        {kind === 'do' ? 'Try this' : 'Not this'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[42px] leading-[1.35] font-semibold',
            kind === 'dont' && 'text-(--cx-muted)',
          )}
        >
          {item}
        </p>
      ))}
    </div>
  )
}

function Step({
  n,
  title,
  children,
  last = false,
}: {
  n: string
  title: string
  children: ReactNode
  last?: boolean
}) {
  return (
    <div
      className={cn('flex gap-[32px] border-t border-(--cx-rule) pt-[28px]', !last && 'pb-[56px]')}
    >
      <span className="w-[56px] shrink-0 font-(family-name:--cx-font-display) text-[62px] leading-none font-bold text-(--cx-accent)">
        {n}
      </span>
      <div className="flex flex-col gap-[8px]">
        <p className="font-(family-name:--cx-font-display) text-[54px] leading-[1.1] font-medium">
          {title}
        </p>
        <p className="text-[40px] leading-[1.4] font-medium">{children}</p>
      </div>
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
      <Footer page={1} total={10} />
    </Frame>
  )
}

function PhotoCover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[44px]">
        <Photo src={coverPhoto} alt="An open book on a table" className="h-[600px] w-full" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The long read</Eyebrow>
          <Hero>Slow down, read closer</Hero>
        </div>
      </div>
      <Footer page={2} total={10} />
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
      <Footer page={3} total={10} />
    </Frame>
  )
}

function ImageSplit() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[48px]">
        <Photo
          src={splitPhoto}
          alt="A fountain pen resting on a notebook"
          className="h-[540px] w-full"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>On writing</Eyebrow>
          <Title>Write the draft by hand</Title>
          <Body>Paper slows you down enough to notice what you mean.</Body>
        </div>
      </div>
      <Footer page={4} total={10} />
    </Frame>
  )
}

function IconGrid() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[56px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>A reader’s toolkit</Eyebrow>
          <Title>Four habits worth keeping</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={BookOpen}>Read a little every day</IconCard>
          <IconCard icon={PenLine}>Write in the margins</IconCard>
          <IconCard icon={Lightbulb}>Note one idea per page</IconCard>
          <IconCard icon={Feather}>Revise with fresh eyes</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame className="bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklab,var(--cx-accent)_10%,transparent),transparent_60%)]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your best line goes here, in the author’s own words.</Quote>
      </div>
      <Footer page={6} total={10} />
    </Frame>
  )
}

function StatSlide() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[56px]">
        <Eyebrow>Rule of thumb</Eyebrow>
        <BigStat value="20" label="minutes of reading a day is enough to build the habit." />
      </div>
      <Footer page={7} total={10} />
    </Frame>
  )
}

function Compare() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[56px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Better notes</Eyebrow>
          <Title>Notes you will reread</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Copying whole passages', 'Highlighting everything', 'One giant document']}
          />
          <CompareColumn
            kind="do"
            items={['One line in your words', 'Mark only surprises', 'A page per idea']}
          />
        </div>
      </div>
      <Footer page={8} total={10} />
    </Frame>
  )
}

function Steps() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[56px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The method</Eyebrow>
          <Title>From book to essay</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Read">
            Mark the lines that surprise you.
          </Step>
          <Step n="2" title="Gather">
            Copy each one onto its own card.
          </Step>
          <Step n="3" title="Write" last>
            Connect three cards into one argument.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
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
      <Footer page={10} total={10} />
    </Frame>
  )
}

export const slides = [
  Cover,
  PhotoCover,
  Content,
  ImageSplit,
  IconGrid,
  QuoteSlide,
  StatSlide,
  Compare,
  Steps,
  Closer,
]

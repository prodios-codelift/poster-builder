// Theme demo: swiss-grid — keep components in lockstep with theme.md
import { cn } from 'cn'
import { Check, Grid3x3, type LucideIcon, Ruler, Square, Type, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#111111',
  '--cx-accent': '#E4252B',
  '--cx-muted': '#5C5C5C',
  '--cx-grid': 'rgba(17, 17, 17, 0.07)',
  '--cx-font-display': "'Inter Tight', system-ui, sans-serif",
  '--cx-font-body': "'Inter Tight', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  'signal-red': {
    name: 'Signal Red',
    tokens: {
      '--cx-bg': '#FFFFFF',
      '--cx-fg': '#111111',
      '--cx-accent': '#E4252B',
      '--cx-muted': '#5C5C5C',
      '--cx-grid': 'rgba(17, 17, 17, 0.07)',
    } as CSSProperties,
  },
  'klein-blue': {
    name: 'Klein Blue',
    tokens: {
      '--cx-bg': '#F4F4F0',
      '--cx-fg': '#0D0D0D',
      '--cx-accent': '#1F3FD1',
      '--cx-muted': '#57574F',
      '--cx-grid': 'rgba(13, 13, 13, 0.07)',
    } as CSSProperties,
  },
  'safety-orange': {
    name: 'Safety Orange',
    tokens: {
      '--cx-bg': '#FAFAF7',
      '--cx-fg': '#121212',
      '--cx-accent': '#F0501A',
      '--cx-muted': '#5A5A55',
      '--cx-grid': 'rgba(18, 18, 18, 0.07)',
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
        <div className="pointer-events-none absolute inset-y-0 left-[96px] right-[96px] grid grid-cols-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="border-l border-(--cx-grid) last:border-r" />
          ))}
        </div>
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </LinkedInCarouselSlide>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-[20px]">
      <span className="size-[24px] shrink-0 bg-(--cx-accent)" />
      <p className="text-[26px] leading-[1.2] font-bold tracking-[0.12em] uppercase">{children}</p>
    </div>
  )
}

function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[136px] leading-[0.98] font-extrabold tracking-[-0.045em]">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[92px] leading-[1.0] font-extrabold tracking-[-0.04em]">
      {children}
    </h2>
  )
}

function Body({ children }: { children: ReactNode }) {
  return <p className="max-w-[740px] text-[40px] leading-[1.4] font-medium">{children}</p>
}

function SectionNumber({ n }: { n: string }) {
  return (
    <p className="font-(family-name:--cx-font-display) text-[240px] leading-[0.85] font-extrabold tracking-[-0.06em] text-(--cx-accent) tabular-nums">
      {n}
    </p>
  )
}

function Point({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[148px_1fr] border-t-[3px] border-(--cx-fg) pt-[24px]">
      <span className="text-[36px] leading-[1.3] font-bold text-(--cx-accent) tabular-nums">
        {n}
      </span>
      <p className="text-[40px] leading-[1.3] font-semibold tracking-[-0.01em]">{children}</p>
    </div>
  )
}

function SwipeCue() {
  return <p className="text-[30px] leading-[1.3] font-bold text-(--cx-accent)">Swipe →</p>
}

function AuthorCard() {
  return (
    <div className="flex flex-col gap-[8px] border-t-[3px] border-(--cx-fg) pt-[28px]">
      <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.05] font-extrabold tracking-[-0.03em]">
        {AUTHOR.name}
      </p>
      <p className="text-[32px] leading-[1.3] font-semibold text-(--cx-muted)">{AUTHOR.handle}</p>
    </div>
  )
}

function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto grid grid-cols-[148px_1fr_auto] items-baseline text-[26px] leading-[1.3] font-semibold text-(--cx-muted)">
      <span className="font-bold text-(--cx-fg) tabular-nums">
        {pad(page)}/{pad(total)}
      </span>
      <span>{AUTHOR.name}</span>
      <span>{AUTHOR.handle}</span>
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
    <div className="flex flex-col gap-[44px] border-t-[3px] border-(--cx-fg) pt-[24px]">
      <Icon className="size-[96px]" strokeWidth={2} />
      <p className="text-[44px] leading-[1.2] font-bold tracking-[-0.01em]">{children}</p>
    </div>
  )
}

function Quote({ children, by }: { children: ReactNode; by: string }) {
  return (
    <figure className="flex flex-col gap-[40px]">
      <span className="font-(family-name:--cx-font-display) text-[220px] leading-[0.55] font-extrabold text-(--cx-accent)">
        “
      </span>
      <blockquote className="font-(family-name:--cx-font-display) text-[76px] leading-[1.02] font-extrabold tracking-[-0.035em]">
        {children}
      </blockquote>
      <figcaption className="text-[28px] leading-[1.3] font-semibold text-(--cx-muted)">
        {by}
      </figcaption>
    </figure>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[32px] border-t-[3px] border-(--cx-fg) pt-[32px]">
      <p className="font-(family-name:--cx-font-display) text-[300px] leading-[0.85] font-extrabold tracking-[-0.06em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="max-w-[740px] text-[44px] leading-[1.2] font-bold tracking-[-0.01em]">
        {label}
      </p>
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div className="flex flex-col gap-[40px] border-t-[3px] border-(--cx-fg) pt-[24px]">
      <p
        className={cn(
          'flex items-center gap-[12px] text-[26px] leading-[1.2] font-bold tracking-[0.12em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[30px]" strokeWidth={3} />
        {kind === 'do' ? 'Do' : 'Don’t'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[44px] leading-[1.25] font-bold tracking-[-0.01em]',
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
      className={cn(
        'grid grid-cols-[148px_1fr] border-t-[3px] border-(--cx-fg) pt-[24px]',
        !last && 'pb-[56px]',
      )}
    >
      <span className="font-(family-name:--cx-font-display) text-[64px] leading-[0.9] font-extrabold tracking-[-0.04em] text-(--cx-accent)">
        {n}
      </span>
      <div className="flex flex-col gap-[8px]">
        <p className="text-[50px] leading-[1.1] font-extrabold tracking-[-0.025em]">{title}</p>
        <p className="text-[40px] leading-[1.35] font-medium">{children}</p>
      </div>
    </div>
  )
}

function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-end gap-[48px] pb-[48px]">
        <Eyebrow>Swiss Grid</Eyebrow>
        <Hero>Less, but better.</Hero>
        <Body>A strict grid, heavy grotesk type and one signal colour. Nothing decorative.</Body>
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
        <Photo
          src={coverPhoto}
          alt="Concrete architecture with sharp geometric lines"
          className="h-[580px] w-full"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Form follows function</Eyebrow>
          <Hero>Structure is freedom.</Hero>
        </div>
      </div>
      <Footer page={2} total={10} />
    </Frame>
  )
}

function Content() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[56px]">
        <SectionNumber n="01" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Principles</Eyebrow>
          <Title>Order is the message</Title>
        </div>
        <div className="flex flex-col gap-[32px]">
          <Point n="A">Align everything to the grid.</Point>
          <Point n="B">Let size set the hierarchy.</Point>
          <Point n="C">Use colour only to point.</Point>
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
          alt="A spiral staircase seen from above"
          className="h-[540px] w-full"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Rhythm</Eyebrow>
          <Title>Repeat until it reads</Title>
          <Body>A system of repeated measures makes every page feel related.</Body>
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
          <Eyebrow>Toolkit</Eyebrow>
          <Title>Four tools, no more</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Grid3x3}>A grid</IconCard>
          <IconCard icon={Type}>One typeface</IconCard>
          <IconCard icon={Ruler}>A scale of sizes</IconCard>
          <IconCard icon={Square}>One signal colour</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame className="bg-[radial-gradient(var(--cx-grid)_2px,transparent_2.5px)] bg-[size:36px_36px]">
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
        <Eyebrow>Measure</Eyebrow>
        <BigStat value="6" label="columns are enough for almost any slide." />
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
          <Eyebrow>Hierarchy</Eyebrow>
          <Title>Size, not decoration</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Five colours', 'Centred everything', 'Drop shadows']}
          />
          <CompareColumn kind="do" items={['One signal colour', 'Flush left', 'Bigger type']} />
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
          <Eyebrow>Process</Eyebrow>
          <Title>Build the page</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Set the grid">
            Choose margins and columns first.
          </Step>
          <Step n="2" title="Place the type">
            Size by importance, align to columns.
          </Step>
          <Step n="3" title="Add the signal" last>
            One colour, only where you point.
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
      <div className="flex flex-1 flex-col justify-end gap-[48px] pb-[48px]">
        <Eyebrow>Follow</Eyebrow>
        <Title>One clear idea, every week.</Title>
        <Body>Follow for more, and repost if this helped someone on your team.</Body>
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

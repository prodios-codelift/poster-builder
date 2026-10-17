// Theme demo: bento-pop — keep components in lockstep with theme.md
import { cn } from 'cn'
import { Calendar, Check, Coffee, type LucideIcon, Moon, Sun, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#F5F3EF',
  '--cx-fg': '#1A1A1A',
  '--cx-accent': '#E8466B',
  '--cx-muted': '#5F5A52',
  '--cx-surface': '#FFFFFF',
  '--cx-tile-1': '#FFD6E0',
  '--cx-tile-2': '#CDE7FF',
  '--cx-tile-3': '#D9F99D',
  '--cx-tile-4': '#FDE68A',
  '--cx-font-display': "'Geist Variable', system-ui, sans-serif",
  '--cx-font-body': "'Geist Variable', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  'soft-pastel': {
    name: 'Soft Pastel',
    tokens: {
      '--cx-bg': '#F5F3EF',
      '--cx-fg': '#1A1A1A',
      '--cx-accent': '#E8466B',
      '--cx-muted': '#5F5A52',
      '--cx-surface': '#FFFFFF',
      '--cx-tile-1': '#FFD6E0',
      '--cx-tile-2': '#CDE7FF',
      '--cx-tile-3': '#D9F99D',
      '--cx-tile-4': '#FDE68A',
    } as CSSProperties,
  },
  sorbet: {
    name: 'Sorbet',
    tokens: {
      '--cx-bg': '#FFF7F0',
      '--cx-fg': '#1F1A17',
      '--cx-accent': '#E4572E',
      '--cx-muted': '#665A52',
      '--cx-surface': '#FFFFFF',
      '--cx-tile-1': '#FFB4A2',
      '--cx-tile-2': '#A0C4FF',
      '--cx-tile-3': '#B5E48C',
      '--cx-tile-4': '#FFD6A5',
    } as CSSProperties,
  },
  'cool-mint': {
    name: 'Cool Mint',
    tokens: {
      '--cx-bg': '#F2F7F6',
      '--cx-fg': '#14201E',
      '--cx-accent': '#0F9D8A',
      '--cx-muted': '#55625F',
      '--cx-surface': '#FFFFFF',
      '--cx-tile-1': '#B8F2E6',
      '--cx-tile-2': '#D7C6FF',
      '--cx-tile-3': '#AED9E0',
      '--cx-tile-4': '#FFE5A5',
    } as CSSProperties,
  },
} satisfies Record<string, { name: string; tokens: CSSProperties }>

const AUTHOR = { name: 'Your Name', handle: '@yourhandle' }

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LinkedInCarouselSlide tokens={TOKENS}>
      <div
        className={cn(
          'relative isolate flex size-full flex-col bg-(--cx-bg) px-[80px] pt-[96px] pb-[72px] font-(family-name:--cx-font-body) text-(--cx-fg)',
          className,
        )}
      >
        {children}
      </div>
    </LinkedInCarouselSlide>
  )
}

const TILE_TONES = {
  1: 'bg-(--cx-tile-1)',
  2: 'bg-(--cx-tile-2)',
  3: 'bg-(--cx-tile-3)',
  4: 'bg-(--cx-tile-4)',
  white: 'bg-(--cx-surface)',
}

function Tile({
  tone,
  className,
  children,
}: {
  tone: keyof typeof TILE_TONES
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('flex flex-col rounded-[40px] p-[44px]', TILE_TONES[tone], className)}>
      {children}
    </div>
  )
}

function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="flex items-center gap-[14px] self-start rounded-full bg-(--cx-surface) px-[22px] py-[10px] text-[26px] leading-[1.2] font-semibold"
      {...slide}
    >
      <span className="size-[14px] rounded-full bg-(--cx-accent)" />
      {children}
    </p>
  )
}

function Hero({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h1
      className="font-(family-name:--cx-font-display) text-[112px] leading-[1.02] font-bold tracking-[-0.05em]"
      {...slide}
    >
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[80px] leading-[1.06] font-bold tracking-[-0.04em]"
      {...slide}
    >
      {children}
    </h2>
  )
}

function Body({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p className="text-[38px] leading-[1.4] font-medium" {...slide}>
      {children}
    </p>
  )
}

function BentoItem({
  tone,
  n,
  children,
  className,
  ...slide
}: {
  tone: keyof typeof TILE_TONES
  n: string
  children: ReactNode
  className?: string
} & SlideProps) {
  return (
    <Tile tone={tone} className={cn('min-h-[260px] justify-between gap-[32px]', className)}>
      <span className="flex size-[64px] items-center justify-center rounded-full bg-(--cx-surface) text-[30px] leading-none font-bold">
        {n}
      </span>
      <p className="text-[40px] leading-[1.2] font-bold tracking-[-0.02em]" {...slide}>
        {children}
      </p>
    </Tile>
  )
}

function SwipeCue() {
  return (
    <p className="flex items-center gap-[16px] text-[32px] leading-[1.2] font-bold">
      Swipe
      <span className="flex size-[64px] items-center justify-center rounded-full bg-(--cx-fg) text-[32px] leading-none text-(--cx-surface)">
        →
      </span>
    </p>
  )
}

function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
  return (
    <Tile tone={4} className="flex-row items-center gap-[32px]">
      <div className="flex size-[112px] shrink-0 items-center justify-center rounded-full bg-(--cx-fg) text-[42px] leading-none font-bold text-(--cx-surface)">
        {initials}
      </div>
      <div className="flex flex-col gap-[6px]">
        <p className="text-[46px] leading-[1.1] font-bold tracking-[-0.03em]">{AUTHOR.name}</p>
        <p className="text-[30px] leading-[1.3] font-medium text-(--cx-muted)">{AUTHOR.handle}</p>
      </div>
    </Tile>
  )
}

function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between pt-[28px] text-[26px] leading-[1.3] font-semibold text-(--cx-muted)">
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
      <img
        src={src}
        alt={alt}
        className="size-full object-cover grayscale brightness-[1.05] contrast-[1.05]"
      />
      <div className="absolute inset-0 bg-(--cx-tile-2) mix-blend-multiply" />
    </div>
  )
}

function IconCard({
  icon: Icon,
  tone,
  children,
  ...slide
}: {
  icon: LucideIcon
  tone: keyof typeof TILE_TONES
  children: ReactNode
} & SlideProps) {
  return (
    <Tile tone={tone} className="min-h-[300px] justify-between gap-[44px]">
      <span className="flex size-[120px] items-center justify-center rounded-full bg-(--cx-surface)">
        <Icon className="size-[60px]" strokeWidth={2} />
      </span>
      <p className="text-[44px] leading-[1.2] font-bold tracking-[-0.02em]" {...slide}>
        {children}
      </p>
    </Tile>
  )
}

function Quote({ children, by, ...slide }: { children: ReactNode; by: string } & SlideProps) {
  return (
    <Tile tone={2} className="gap-[36px] p-[56px]">
      <span className="text-[140px] leading-[0.6] font-bold">“</span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[58px] leading-[1.2] font-bold tracking-[-0.035em]"
        {...slide}
      >
        {children}
      </blockquote>
      <p className="text-[30px] leading-[1.3] font-medium text-(--cx-muted)">— {by}</p>
    </Tile>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <Tile tone={3} className="gap-[28px] p-[56px]">
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] font-bold tracking-[-0.06em]">
        {value}
      </p>
      <p className="text-[42px] leading-[1.25] font-bold tracking-[-0.02em]">{label}</p>
    </Tile>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <Tile tone={kind === 'do' ? 3 : 'white'} className="gap-[40px]">
      <p className="flex items-center gap-[10px] self-start rounded-full bg-(--cx-bg) px-[20px] py-[8px] text-[26px] leading-[1.2] font-semibold">
        <Icon className="size-[28px]" strokeWidth={2.5} />
        {kind === 'do' ? 'Swap in' : 'Swap out'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[42px] leading-[1.25] font-bold tracking-[-0.01em]',
            kind === 'dont' && 'text-(--cx-muted)',
          )}
        >
          {item}
        </p>
      ))}
    </Tile>
  )
}

function Step({
  n,
  title,
  children,
  last = false,
  ...slide
}: {
  n: string
  title: string
  children: ReactNode
  last?: boolean
} & SlideProps) {
  const tones = [1, 2, 3, 4] as const
  return (
    <Tile
      tone={tones[(Number(n) - 1) % 4]}
      className={cn('flex-row items-center gap-[32px] py-[36px]', !last && 'mb-[20px]')}
    >
      <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-(--cx-surface) text-[32px] leading-none font-bold">
        {n}
      </span>
      <div className="flex flex-col gap-[6px]">
        <p className="text-[46px] leading-[1.15] font-bold tracking-[-0.02em]">{title}</p>
        <p className="text-[40px] leading-[1.3] font-medium" {...slide}>
          {children}
        </p>
      </div>
    </Tile>
  )
}

function Cover() {
  return (
    <Frame>
      <div className="grid flex-1 grid-cols-2 grid-rows-[1fr_auto] gap-[24px]">
        <Tile tone={1} className="col-span-2 justify-end gap-[40px]">
          <Eyebrow>Bento Pop</Eyebrow>
          <Hero>Small boxes, big ideas</Hero>
        </Tile>
        <Tile tone={2} className="justify-center">
          <Body>Soft colour tiles for friendly, scannable posts.</Body>
        </Tile>
        <Tile tone={3} className="justify-center">
          <SwipeCue />
        </Tile>
      </div>
      <Footer page={1} total={10} />
    </Frame>
  )
}

function PhotoCover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[24px]">
        <Photo
          src={coverPhoto}
          alt="Two white ceramic vases"
          className="h-[540px] rounded-[40px]"
        />
        <Tile tone={1} className="flex-1 justify-end gap-[32px]">
          <Eyebrow>Slow living</Eyebrow>
          <Hero>Make room for less</Hero>
        </Tile>
      </div>
      <Footer page={2} total={10} />
    </Frame>
  )
}

function Content() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[56px]">
        <div className="flex flex-col gap-[28px]">
          <Eyebrow>Quick wins</Eyebrow>
          <Title>Three habits for tidy slides</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <BentoItem tone={1} n="1" className="col-span-2">
            Group related ideas into one tile.
          </BentoItem>
          <BentoItem tone={2} n="2">
            Keep each tile short.
          </BentoItem>
          <BentoItem tone={3} n="3">
            Let colour do the sorting.
          </BentoItem>
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
          alt="A blue and white vase with flowers"
          className="h-[540px] w-full rounded-[40px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Little rituals</Eyebrow>
          <Title>Fresh flowers on Monday</Title>
          <Body>Small, repeatable joys make a week feel lighter.</Body>
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
          <Eyebrow>A calm day</Eyebrow>
          <Title>Four tiny routines</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Sun} tone={1}>
            Morning light
          </IconCard>
          <IconCard icon={Coffee} tone={2}>
            Slow coffee
          </IconCard>
          <IconCard icon={Calendar} tone={3}>
            One priority
          </IconCard>
          <IconCard icon={Moon} tone={4}>
            Screens off at 10
          </IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame>
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
        <Eyebrow>Gentle goal</Eyebrow>
        <BigStat value="3" label="things done well beat ten rushed." />
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
          <Eyebrow>Simple swaps</Eyebrow>
          <Title>Trade busy for calm</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Inbox at breakfast', 'Back-to-back calls', 'Doom scrolling']}
          />
          <CompareColumn kind="do" items={['A walk first', 'Blocks of focus', 'A real book']} />
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
          <Eyebrow>Start small</Eyebrow>
          <Title>Build the habit</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Pick one">
            Choose a single tiny ritual.
          </Step>
          <Step n="2" title="Anchor it">
            Attach it to something you already do.
          </Step>
          <Step n="3" title="Keep it" last>
            Do it for two weeks, then add more.
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
        <Title>Liked this format?</Title>
        <Body>Follow for a new carousel every week, and repost to share it.</Body>
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

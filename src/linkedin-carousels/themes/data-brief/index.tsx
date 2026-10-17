// Theme demo: data-brief — keep components in lockstep with theme.md
import { cn } from 'cn'
import { BarChart3, Check, Database, type LucideIcon, Search, Target, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#F1F5FB',
  '--cx-fg': '#0F172A',
  '--cx-accent': '#1D4ED8',
  '--cx-accent-soft': '#DCE6FD',
  '--cx-muted': '#526077',
  '--cx-card': '#FFFFFF',
  '--cx-rule': 'rgba(15, 23, 42, 0.10)',
  '--cx-font-display': "'Geist Variable', system-ui, sans-serif",
  '--cx-font-body': "'Geist Variable', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  'corporate-blue': {
    name: 'Corporate Blue',
    tokens: {
      '--cx-bg': '#F1F5FB',
      '--cx-fg': '#0F172A',
      '--cx-accent': '#1D4ED8',
      '--cx-accent-soft': '#DCE6FD',
      '--cx-muted': '#526077',
      '--cx-card': '#FFFFFF',
      '--cx-rule': 'rgba(15, 23, 42, 0.10)',
    } as CSSProperties,
  },
  emerald: {
    name: 'Emerald',
    tokens: {
      '--cx-bg': '#EFF7F3',
      '--cx-fg': '#0B1F17',
      '--cx-accent': '#047857',
      '--cx-accent-soft': '#D1F3E3',
      '--cx-muted': '#4F6159',
      '--cx-card': '#FFFFFF',
      '--cx-rule': 'rgba(11, 31, 23, 0.10)',
    } as CSSProperties,
  },
  plum: {
    name: 'Plum',
    tokens: {
      '--cx-bg': '#F6F2FA',
      '--cx-fg': '#1E1424',
      '--cx-accent': '#6D28D9',
      '--cx-accent-soft': '#EADFFB',
      '--cx-muted': '#625868',
      '--cx-card': '#FFFFFF',
      '--cx-rule': 'rgba(30, 20, 36, 0.10)',
    } as CSSProperties,
  },
} satisfies Record<string, { name: string; tokens: CSSProperties }>

const AUTHOR = { name: 'Your Name', handle: '@yourhandle' }

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LinkedInCarouselSlide tokens={TOKENS}>
      <div
        className={cn(
          'relative isolate flex size-full flex-col bg-(--cx-bg) px-[88px] pt-[104px] pb-[72px] font-(family-name:--cx-font-body) text-(--cx-fg)',
          className,
        )}
      >
        {children}
      </div>
    </LinkedInCarouselSlide>
  )
}

function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="self-start rounded-full bg-(--cx-accent-soft) px-[22px] py-[10px] text-[26px] leading-[1.2] font-bold tracking-[0.1em] text-(--cx-accent) uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}

function Hero({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h1
      className="font-(family-name:--cx-font-display) text-[120px] leading-[1.04] font-bold tracking-[-0.04em]"
      {...slide}
    >
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[84px] leading-[1.08] font-bold tracking-[-0.035em]"
      {...slide}
    >
      {children}
    </h2>
  )
}

function Body({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p className="text-[40px] leading-[1.45] font-medium" {...slide}>
      {children}
    </p>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[20px] rounded-[28px] border border-(--cx-rule) bg-(--cx-card) p-[40px]">
      <p className="font-(family-name:--cx-font-display) text-[136px] leading-none font-bold tracking-[-0.05em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[34px] leading-[1.3] font-semibold">{label}</p>
    </div>
  )
}

function Insight({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <div className="flex gap-[28px] rounded-[28px] bg-(--cx-card) p-[40px]">
      <span className="w-[8px] shrink-0 rounded-full bg-(--cx-accent)" />
      <p className="text-[38px] leading-[1.4] font-medium" {...slide}>
        {children}
      </p>
    </div>
  )
}

function SwipeCue() {
  return (
    <p className="text-[30px] leading-[1.3] font-bold text-(--cx-accent)">
      Swipe for the numbers →
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
    <div className="flex items-center gap-[32px] rounded-[28px] border border-(--cx-rule) bg-(--cx-card) p-[36px]">
      <div className="flex size-[104px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) text-[40px] leading-none font-bold text-(--cx-card)">
        {initials}
      </div>
      <div className="flex flex-col gap-[6px]">
        <p className="text-[44px] leading-[1.1] font-bold tracking-[-0.02em]">{AUTHOR.name}</p>
        <p className="text-[30px] leading-[1.3] font-semibold text-(--cx-muted)">{AUTHOR.handle}</p>
      </div>
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
      <div className="absolute inset-0 bg-(--cx-accent-soft) mix-blend-multiply" />
      <div className="absolute inset-0 bg-(--cx-fg) mix-blend-lighten" />
    </div>
  )
}

function IconCard({
  icon: Icon,
  children,
  ...slide
}: { icon: LucideIcon; children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[44px] rounded-[28px] border border-(--cx-rule) bg-(--cx-card) p-[44px]">
      <span className="flex size-[120px] items-center justify-center rounded-[20px] bg-(--cx-accent-soft)">
        <Icon className="size-[64px] text-(--cx-accent)" strokeWidth={2} />
      </span>
      <p className="text-[44px] leading-[1.25] font-semibold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function Quote({ children, by, ...slide }: { children: ReactNode; by: string } & SlideProps) {
  return (
    <figure className="flex flex-col gap-[36px] rounded-[28px] border border-(--cx-rule) bg-(--cx-card) p-[56px]">
      <span className="text-[140px] leading-[0.6] font-bold text-(--cx-accent)">“</span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[60px] leading-[1.2] font-bold tracking-[-0.03em]"
        {...slide}
      >
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
    <div className="flex flex-col gap-[28px] rounded-[28px] border border-(--cx-rule) bg-(--cx-card) p-[56px]">
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] font-bold tracking-[-0.06em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[42px] leading-[1.3] font-semibold">{label}</p>
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div
      className={cn(
        'flex flex-col gap-[40px] rounded-[28px] border p-[40px]',
        kind === 'do' ? 'border-(--cx-accent) bg-(--cx-card)' : 'border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[10px] self-start rounded-full px-[20px] py-[8px] text-[26px] leading-[1.2] font-bold tracking-[0.08em] uppercase',
          kind === 'do' ? 'bg-(--cx-accent-soft) text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[28px]" strokeWidth={2.5} />
        {kind === 'do' ? 'Do' : 'Skip'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[42px] leading-[1.3] font-semibold',
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
  ...slide
}: {
  n: string
  title: string
  children: ReactNode
  last?: boolean
} & SlideProps) {
  return (
    <div className="flex gap-[32px]">
      <div className="flex flex-col items-center">
        <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) text-[30px] leading-none font-bold text-(--cx-card) tabular-nums">
          {n}
        </span>
        {last ? null : <span className="w-[3px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[10px]', !last && 'pb-[56px]')}>
        <p className="text-[48px] leading-[1.2] font-bold tracking-[-0.02em]">{title}</p>
        <p className="text-[40px] leading-[1.4] font-medium" {...slide}>
          {children}
        </p>
      </div>
    </div>
  )
}

function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Data Brief</Eyebrow>
        <Hero>Let the number lead</Hero>
        <Body>White cards, big figures and one clear accent. Built for reports and analysis.</Body>
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
          alt="An aerial view of a city grid"
          className="h-[560px] w-full rounded-[28px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Quarterly brief</Eyebrow>
          <Hero>Read the city like data</Hero>
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
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The rule of thumb</Eyebrow>
          <Title>Keep every slide this lean</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <StatCard value="1" label="idea per slide" />
          <StatCard value="30" label="words of body, at most" />
        </div>
        <Insight>Put the figure first and the explanation second.</Insight>
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
          alt="Performance charts on a laptop screen"
          className="h-[540px] w-full rounded-[28px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Dashboards</Eyebrow>
          <Title>One chart, one question</Title>
          <Body>If a chart answers two questions, split it into two.</Body>
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
          <Eyebrow>Before you publish</Eyebrow>
          <Title>Check these four things</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Target}>The question it answers</IconCard>
          <IconCard icon={Database}>Where the data came from</IconCard>
          <IconCard icon={Search}>What you left out</IconCard>
          <IconCard icon={BarChart3}>The simplest chart that works</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame className="bg-[radial-gradient(var(--cx-rule)_2px,transparent_2.5px)] bg-[size:36px_36px]">
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
        <BigStat value="5" label="seconds for a reader to find the main number." />
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
          <Eyebrow>Charts</Eyebrow>
          <Title>Make the point obvious</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['3D pie charts', 'Twelve colours', 'A legend to decode']}
          />
          <CompareColumn
            kind="do"
            items={['Sorted bars', 'One highlight colour', 'Labels on the data']}
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
          <Eyebrow>Workflow</Eyebrow>
          <Title>From raw data to insight</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Ask">
            Write the question in one sentence.
          </Step>
          <Step n="2" title="Cut">
            Keep only the data that answers it.
          </Step>
          <Step n="3" title="Show" last>
            Lead with the number, then the chart.
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
        <Eyebrow>Stay in the loop</Eyebrow>
        <Title>Want the next brief?</Title>
        <Body>Follow for a data-backed breakdown every week, and repost to share it.</Body>
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

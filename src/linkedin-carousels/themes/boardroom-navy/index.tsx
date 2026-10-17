// Theme demo: boardroom-navy — keep components in lockstep with theme.md
import { cn } from 'cn'
import { Check, Compass, Handshake, type LucideIcon, Target, TrendingUp, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#0B1F3A',
  '--cx-fg': '#F5F7FA',
  '--cx-accent': '#D4A84B',
  '--cx-muted': '#9AA8BC',
  '--cx-rule': 'rgba(245, 247, 250, 0.14)',
  '--cx-surface': 'rgba(245, 247, 250, 0.06)',
  '--cx-font-display': "'Inter Tight', system-ui, sans-serif",
  '--cx-font-body': "'Inter Tight', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  'navy-gold': {
    name: 'Navy & Gold',
    tokens: {
      '--cx-bg': '#0B1F3A',
      '--cx-fg': '#F5F7FA',
      '--cx-accent': '#D4A84B',
      '--cx-muted': '#9AA8BC',
      '--cx-rule': 'rgba(245, 247, 250, 0.14)',
      '--cx-surface': 'rgba(245, 247, 250, 0.06)',
    } as CSSProperties,
  },
  'charcoal-teal': {
    name: 'Charcoal & Teal',
    tokens: {
      '--cx-bg': '#1C1F24',
      '--cx-fg': '#F2F4F5',
      '--cx-accent': '#2EC4B6',
      '--cx-muted': '#9BA3AB',
      '--cx-rule': 'rgba(242, 244, 245, 0.14)',
      '--cx-surface': 'rgba(242, 244, 245, 0.06)',
    } as CSSProperties,
  },
  'forest-brass': {
    name: 'Forest & Brass',
    tokens: {
      '--cx-bg': '#10291F',
      '--cx-fg': '#F3F1EA',
      '--cx-accent': '#C9A15A',
      '--cx-muted': '#A3B3A9',
      '--cx-rule': 'rgba(243, 241, 234, 0.14)',
      '--cx-surface': 'rgba(243, 241, 234, 0.06)',
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

function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[20px]">
      <span className="h-[4px] w-[56px] bg-(--cx-accent)" />
      <p
        className="text-[26px] leading-[1.2] font-bold tracking-[0.2em] text-(--cx-accent) uppercase"
        {...slide}
      >
        {children}
      </p>
    </div>
  )
}

function Hero({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h1
      className="font-(family-name:--cx-font-display) text-[120px] leading-[1.04] font-bold tracking-[-0.03em]"
      {...slide}
    >
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[36px]">
      <h2
        className="font-(family-name:--cx-font-display) text-[84px] leading-[1.08] font-bold tracking-[-0.025em]"
        {...slide}
      >
        {children}
      </h2>
      <span className="h-[6px] w-[96px] bg-(--cx-accent)" />
    </div>
  )
}

function Body({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p className="text-[40px] leading-[1.45] font-medium" {...slide}>
      {children}
    </p>
  )
}

function Point({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[36px] border-l-[6px] border-(--cx-accent) bg-(--cx-surface) px-[40px] py-[32px]">
      <span className="shrink-0 font-(family-name:--cx-font-display) text-[44px] leading-none font-bold text-(--cx-accent) tabular-nums">
        {n}
      </span>
      <p className="text-[38px] leading-[1.3] font-semibold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function SwipeCue() {
  return <p className="text-[30px] leading-[1.3] font-bold text-(--cx-accent)">Swipe →</p>
}

function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
  return (
    <div className="flex items-center gap-[32px]">
      <div className="flex size-[112px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) font-(family-name:--cx-font-display) text-[44px] leading-none font-bold text-(--cx-bg)">
        {initials}
      </div>
      <div className="flex flex-col gap-[6px]">
        <p className="font-(family-name:--cx-font-display) text-[48px] leading-[1.1] font-bold">
          {AUTHOR.name}
        </p>
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
    <div className={cn('relative overflow-hidden', className)}>
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.15]" />
      <div className="absolute inset-0 bg-(--cx-bg) mix-blend-color" />
    </div>
  )
}

function PhotoBackdrop({ src }: { src: string }) {
  return (
    <div className="absolute inset-0 -z-10">
      <Photo src={src} alt="" className="size-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--cx-bg)_30%,color-mix(in_oklab,var(--cx-bg)_55%,transparent)_58%,transparent_85%)]" />
    </div>
  )
}

function IconCard({
  icon: Icon,
  children,
  ...slide
}: { icon: LucideIcon; children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[44px] border-t-[4px] border-(--cx-accent) bg-(--cx-surface) p-[44px]">
      <Icon className="size-[96px] text-(--cx-accent)" strokeWidth={1.75} />
      <p className="text-[44px] leading-[1.3] font-semibold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function Quote({ children, by, ...slide }: { children: ReactNode; by: string } & SlideProps) {
  return (
    <figure className="flex flex-col gap-[40px]">
      <span className="font-(family-name:--cx-font-display) text-[160px] leading-[0.6] font-bold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[68px] leading-[1.15] font-bold tracking-[-0.02em]"
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
    <div className="flex flex-col gap-[28px]">
      <p className="font-(family-name:--cx-font-display) text-[240px] leading-[0.9] font-bold tracking-[-0.05em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[44px] leading-[1.25] font-semibold">{label}</p>
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div
      className={cn(
        'flex flex-col gap-[40px] p-[40px]',
        kind === 'do'
          ? 'border-t-[4px] border-(--cx-accent) bg-(--cx-surface)'
          : 'border-t-[4px] border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[14px] text-[26px] leading-[1.2] font-bold tracking-[0.16em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[32px]" strokeWidth={2.5} />
        {kind === 'do' ? 'Instead' : 'Avoid'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[34px] leading-[1.3] font-semibold',
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
    <div className="flex gap-[36px]">
      <div className="flex flex-col items-center">
        <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full border-[3px] border-(--cx-accent) text-[30px] leading-none font-bold text-(--cx-accent) tabular-nums">
          {n}
        </span>
        {last ? null : <span className="w-[3px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[12px]', !last && 'pb-[56px]')}>
        <p className="text-[46px] leading-[1.2] font-bold">{title}</p>
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
        <Eyebrow>Boardroom Navy</Eyebrow>
        <Hero>Strategy, stated plainly</Hero>
        <Body>Deep navy, crisp type and one gold accent. Built for leadership and B2B posts.</Body>
        <SwipeCue />
      </div>
      <Footer page={1} total={10} />
    </Frame>
  )
}

function PhotoCover() {
  return (
    <Frame>
      <PhotoBackdrop src={coverPhoto} />
      <div className="flex flex-1 flex-col justify-end gap-[40px] pb-[48px]">
        <Eyebrow>Leadership notes</Eyebrow>
        <Hero>Decide faster, explain better</Hero>
        <SwipeCue />
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
          <Eyebrow>The framework</Eyebrow>
          <Title>Three moves before any decision</Title>
        </div>
        <div className="flex flex-col gap-[24px]">
          <Point n="01">Define the outcome you need.</Point>
          <Point n="02">Name the trade-off out loud.</Point>
          <Point n="03">Set the date you will review it.</Point>
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
        <Photo src={splitPhoto} alt="An empty boardroom table" className="h-[540px] w-full" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>In the room</Eyebrow>
          <Title>Bring one page, not a deck</Title>
          <Body>A single page forces the real decision to the top.</Body>
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
          <Eyebrow>What good looks like</Eyebrow>
          <Title>Four signs of a clear plan</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Target}>One measurable goal</IconCard>
          <IconCard icon={Compass}>A stated direction</IconCard>
          <IconCard icon={Handshake}>A named owner</IconCard>
          <IconCard icon={TrendingUp}>A way to track it</IconCard>
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
        <Quote by={AUTHOR.name}>Your best quote goes here, in the author’s own words.</Quote>
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
        <BigStat value="1" label="decision per meeting, written down before anyone leaves." />
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
          <Eyebrow>Before and after</Eyebrow>
          <Title>Status updates that land</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Every task listed', 'Ten slides of context', 'Asks buried at the end']}
          />
          <CompareColumn
            kind="do"
            items={['The three that matter', 'One page of context', 'The ask up front']}
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
          <Eyebrow>The process</Eyebrow>
          <Title>From idea to approval</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Frame the problem">
            One sentence a new hire would understand.
          </Step>
          <Step n="2" title="Show two options">
            Each with its cost and its risk.
          </Step>
          <Step n="3" title="Recommend one" last>
            And say what would change your mind.
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
        <Eyebrow>Next step</Eyebrow>
        <Title>Want more like this?</Title>
        <Body>
          Follow for one practical framework every week, and repost to share it with your team.
        </Body>
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

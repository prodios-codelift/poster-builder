// Theme demo: olive-serif — keep components in lockstep with theme.md
import { cn } from 'cn'
import { ArrowRight, Check, Droplets, Leaf, type LucideIcon, Moon, Sun, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#3A4029',
  '--cx-fg': '#F2EDE1',
  '--cx-accent': '#D9C9A3',
  '--cx-muted': '#C2BDA8',
  '--cx-rule': 'rgba(242, 237, 225, 0.28)',
  '--cx-surface': 'rgba(242, 237, 225, 0.07)',
  '--cx-font-display': "'Instrument Serif', Georgia, serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  olive: {
    name: 'Olive',
    tokens: {
      '--cx-bg': '#3A4029',
      '--cx-fg': '#F2EDE1',
      '--cx-accent': '#D9C9A3',
      '--cx-muted': '#C2BDA8',
      '--cx-rule': 'rgba(242, 237, 225, 0.28)',
      '--cx-surface': 'rgba(242, 237, 225, 0.07)',
    } as CSSProperties,
  },
  forest: {
    name: 'Forest',
    tokens: {
      '--cx-bg': '#1F3A2E',
      '--cx-fg': '#F0EEE4',
      '--cx-accent': '#E3C68C',
      '--cx-muted': '#B9C4B6',
      '--cx-rule': 'rgba(240, 238, 228, 0.28)',
      '--cx-surface': 'rgba(240, 238, 228, 0.07)',
    } as CSSProperties,
  },
  espresso: {
    name: 'Espresso',
    tokens: {
      '--cx-bg': '#3B2A22',
      '--cx-fg': '#F4ECE2',
      '--cx-accent': '#E0B48A',
      '--cx-muted': '#C9B8A8',
      '--cx-rule': 'rgba(244, 236, 226, 0.28)',
      '--cx-surface': 'rgba(244, 236, 226, 0.07)',
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
    <p className="text-[26px] leading-[1.2] font-semibold tracking-[0.26em] text-(--cx-accent) uppercase">
      {children}
    </p>
  )
}

function Em({ children }: { children: ReactNode }) {
  return <em className="text-(--cx-accent) italic">{children}</em>
}

function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[140px] leading-[1.0] font-normal tracking-[-0.02em]">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[92px] leading-[1.05] font-normal tracking-[-0.015em]">
      {children}
    </h2>
  )
}

function Body({ children }: { children: ReactNode }) {
  return <p className="text-[40px] leading-[1.45] font-medium text-(--cx-muted)">{children}</p>
}

function Point({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-[32px] border-t border-(--cx-rule) pt-[32px]">
      <span className="w-[72px] shrink-0 font-(family-name:--cx-font-display) text-[60px] leading-none text-(--cx-accent) italic">
        {n}
      </span>
      <p className="text-[40px] leading-[1.35] font-semibold">{children}</p>
    </div>
  )
}

function SwipeCue() {
  return (
    <div className="flex items-center gap-[24px] self-start rounded-full border-[2px] border-(--cx-rule) py-[16px] pr-[28px] pl-[36px]">
      <p className="text-[28px] leading-[1.2] font-semibold tracking-[0.2em] uppercase">Swipe</p>
      <span className="h-[2px] w-[140px] bg-(--cx-fg)" />
      <ArrowRight className="-ml-[30px] size-[36px]" strokeWidth={1.75} />
    </div>
  )
}

function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
  return (
    <div className="flex items-center gap-[32px]">
      <span className="flex size-[128px] shrink-0 items-center justify-center rounded-full border-[2px] border-(--cx-accent) font-(family-name:--cx-font-display) text-[60px] leading-none text-(--cx-accent) italic">
        {initials}
      </span>
      <div className="flex flex-col gap-[4px]">
        <p className="font-(family-name:--cx-font-display) text-[64px] leading-[1.05]">
          {AUTHOR.name}
        </p>
        <p className="text-[30px] leading-[1.3] font-semibold tracking-[0.04em] text-(--cx-muted)">
          {AUTHOR.handle}
        </p>
      </div>
    </div>
  )
}

function Footer({ page, total }: { page: number; total: number }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-(--cx-rule) pt-[28px] text-[26px] leading-[1.3] font-semibold tracking-[0.08em] text-(--cx-muted)">
      <span>{AUTHOR.handle}</span>
      <span className="tabular-nums">
        {page} of {total}
      </span>
    </div>
  )
}

function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.1]" />
      <div className="absolute inset-0 bg-(--cx-fg) mix-blend-multiply" />
      <div className="absolute inset-0 bg-(--cx-bg) mix-blend-lighten" />
    </div>
  )
}

function PhotoBackdrop({ src }: { src: string }) {
  return (
    <div className="absolute inset-0 -z-10">
      <Photo src={src} alt="" className="size-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--cx-bg)_34%,color-mix(in_oklab,var(--cx-bg)_55%,transparent)_62%,transparent_90%)]" />
    </div>
  )
}

function IconCard({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[36px] rounded-[28px] border-[2px] border-(--cx-rule) p-[40px]">
      <Icon className="size-[72px] text-(--cx-accent)" strokeWidth={1.5} />
      <p className="text-[40px] leading-[1.3] font-semibold">{children}</p>
    </div>
  )
}

function Quote({ children, by }: { children: ReactNode; by: string }) {
  return (
    <figure className="flex flex-col gap-[40px]">
      <span className="font-(family-name:--cx-font-display) text-[200px] leading-[0.6] text-(--cx-accent)">
        “
      </span>
      <blockquote className="font-(family-name:--cx-font-display) text-[80px] leading-[1.1] tracking-[-0.01em] italic">
        {children}
      </blockquote>
      <figcaption className="text-[26px] leading-[1.2] font-semibold tracking-[0.26em] text-(--cx-muted) uppercase">
        {by}
      </figcaption>
    </figure>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[24px]">
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] tracking-[-0.03em] text-(--cx-accent) tabular-nums">
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
        'flex flex-col gap-[36px] rounded-[28px] p-[40px]',
        kind === 'do' ? 'bg-(--cx-surface)' : 'border-[2px] border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] text-[26px] leading-[1.2] font-semibold tracking-[0.22em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[30px]" strokeWidth={2} />
        {kind === 'do' ? 'Gently' : 'Not this'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[38px] leading-[1.35] font-semibold',
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
    <div className="flex gap-[36px]">
      <div className="flex flex-col items-center">
        <span className="flex size-[84px] shrink-0 items-center justify-center rounded-full border-[2px] border-(--cx-accent) font-(family-name:--cx-font-display) text-[48px] leading-none text-(--cx-accent) italic">
          {n}
        </span>
        {!last && <span className="w-[2px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[8px]', !last && 'pb-[52px]')}>
        <p className="font-(family-name:--cx-font-display) text-[60px] leading-[1.05]">{title}</p>
        <p className="text-[40px] leading-[1.4] font-medium text-(--cx-muted)">{children}</p>
      </div>
    </div>
  )
}

function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Wellness notes</Eyebrow>
        <Hero>
          Four ways to <Em>slow down</Em>
        </Hero>
        <Body>Deep olive, a soft serif and quiet cream type. Built for calm, personal posts.</Body>
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
        <Eyebrow>At home</Eyebrow>
        <Hero>
          Make room to <Em>breathe</Em>
        </Hero>
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
          <Eyebrow>The practice</Eyebrow>
          <Title>
            Three small <Em>daily</Em> rituals
          </Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="i.">Ten minutes outside before your phone.</Point>
          <Point n="ii.">One slow meal without a screen.</Point>
          <Point n="iii.">Lights low an hour before bed.</Point>
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
          alt="A bowl of oats on a wooden table"
          className="h-[540px] w-full rounded-t-[444px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Mornings</Eyebrow>
          <Title>
            Start <Em>unhurried</Em>
          </Title>
          <Body>Breakfast at the table, not at the desk.</Body>
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
          <Eyebrow>The basics</Eyebrow>
          <Title>
            Four things to <Em>protect</Em>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Sun}>Morning light</IconCard>
          <IconCard icon={Droplets}>Water first</IconCard>
          <IconCard icon={Leaf}>Time outdoors</IconCard>
          <IconCard icon={Moon}>A set bedtime</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame className="bg-[radial-gradient(circle_at_50%_46%,transparent_0_400px,var(--cx-rule)_400px_402px,transparent_402px)]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your gentlest line goes here, in your own words.</Quote>
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
        <BigStat value="10" label="quiet minutes a day is enough to start." />
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
          <Eyebrow>Evenings</Eyebrow>
          <Title>
            Wind down, <Em>kindly</Em>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['Scroll in bed', 'Late emails', 'Bright lights']} />
          <CompareColumn kind="do" items={['A paper book', 'Phone outside', 'Warm lamps']} />
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
          <Eyebrow>Begin here</Eyebrow>
          <Title>
            A <Em>gentle</Em> reset
          </Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Notice">
            Write down when you feel rushed.
          </Step>
          <Step n="2" title="Remove">
            Drop one thing from that hour.
          </Step>
          <Step n="3" title="Replace" last>
            Fill the gap with something slow.
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
        <Title>
          Found this <Em>useful?</Em>
        </Title>
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

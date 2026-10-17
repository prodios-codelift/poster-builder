// Theme demo: condensed-impact — keep components in lockstep with theme.md
import { cn } from 'cn'
import { ArrowRight, Check, Ear, Hand, type LucideIcon, Mic, Timer, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#3B1FA8',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#FFD23F',
  '--cx-muted': '#D4CCF5',
  '--cx-on-accent': '#1A0F4D',
  '--cx-rule': 'rgba(255, 255, 255, 0.22)',
  '--cx-surface': 'rgba(255, 255, 255, 0.09)',
  '--cx-ring': 'rgba(255, 255, 255, 0.13)',
  '--cx-font-display': "'Oswald', 'Arial Narrow', sans-serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  ultraviolet: {
    name: 'Ultraviolet',
    tokens: {
      '--cx-bg': '#3B1FA8',
      '--cx-fg': '#FFFFFF',
      '--cx-accent': '#FFD23F',
      '--cx-muted': '#D4CCF5',
      '--cx-on-accent': '#1A0F4D',
      '--cx-rule': 'rgba(255, 255, 255, 0.22)',
      '--cx-surface': 'rgba(255, 255, 255, 0.09)',
      '--cx-ring': 'rgba(255, 255, 255, 0.13)',
    } as CSSProperties,
  },
  'royal-blue': {
    name: 'Royal Blue',
    tokens: {
      '--cx-bg': '#1E3FD8',
      '--cx-fg': '#FFFFFF',
      '--cx-accent': '#FFD23F',
      '--cx-muted': '#C9D3FA',
      '--cx-on-accent': '#0B1A5C',
      '--cx-rule': 'rgba(255, 255, 255, 0.22)',
      '--cx-surface': 'rgba(255, 255, 255, 0.09)',
      '--cx-ring': 'rgba(255, 255, 255, 0.13)',
    } as CSSProperties,
  },
  'deep-teal': {
    name: 'Deep Teal',
    tokens: {
      '--cx-bg': '#0E5E5A',
      '--cx-fg': '#FFFFFF',
      '--cx-accent': '#FFC857',
      '--cx-muted': '#BFE3DF',
      '--cx-on-accent': '#0B2E2C',
      '--cx-rule': 'rgba(255, 255, 255, 0.22)',
      '--cx-surface': 'rgba(255, 255, 255, 0.09)',
      '--cx-ring': 'rgba(255, 255, 255, 0.13)',
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
        <Rings />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </LinkedInCarouselSlide>
  )
}

function Rings() {
  return (
    <div className="pointer-events-none absolute -top-[300px] -right-[300px] size-[760px] rounded-full bg-[repeating-radial-gradient(circle,transparent_0_44px,var(--cx-ring)_44px_50px)]" />
  )
}

function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="self-start rounded-[8px] bg-(--cx-accent) px-[20px] py-[10px] text-[26px] leading-[1.2] font-extrabold tracking-[0.14em] text-(--cx-on-accent) uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}

function Hero({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h1
      className="font-(family-name:--cx-font-display) text-[150px] leading-[1.0] font-bold tracking-[-0.005em] uppercase"
      {...slide}
    >
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[96px] leading-[1.05] font-bold uppercase"
      {...slide}
    >
      {children}
    </h2>
  )
}

function Body({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p className="text-[40px] leading-[1.45] font-medium text-(--cx-muted)" {...slide}>
      {children}
    </p>
  )
}

function Point({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-baseline gap-[32px] border-t border-(--cx-rule) pt-[32px]">
      <span className="w-[64px] shrink-0 font-(family-name:--cx-font-display) text-[64px] leading-none font-bold text-(--cx-accent)">
        {n}
      </span>
      <p className="text-[42px] leading-[1.35] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function SwipeCue() {
  return (
    <div className="flex items-center gap-[20px]">
      <p className="text-[30px] leading-[1.3] font-bold tracking-[0.14em] uppercase">Swipe</p>
      <span className="flex size-[64px] items-center justify-center rounded-full border-[3px] border-(--cx-accent) text-(--cx-accent)">
        <ArrowRight className="size-[32px]" strokeWidth={2.5} />
      </span>
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
      <span className="flex size-[120px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) font-(family-name:--cx-font-display) text-[52px] leading-none font-bold text-(--cx-on-accent)">
        {initials}
      </span>
      <div className="flex flex-col gap-[6px]">
        <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.1] font-bold uppercase">
          {AUTHOR.name}
        </p>
        <p className="text-[32px] leading-[1.3] font-semibold text-(--cx-muted)">{AUTHOR.handle}</p>
      </div>
    </div>
  )
}

function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-bold text-(--cx-muted)">
      <span>{AUTHOR.handle}</span>
      <span className="font-(family-name:--cx-font-display) tracking-[0.08em] tabular-nums">
        {pad(page)} / {pad(total)}
      </span>
    </div>
  )
}

function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.25]" />
      <div className="absolute inset-0 bg-(--cx-bg) mix-blend-screen" />
    </div>
  )
}

function PhotoBackdrop({ src }: { src: string }) {
  return (
    <div className="absolute -inset-x-[96px] -top-[112px] -bottom-[72px] -z-10">
      <Photo src={src} alt="" className="size-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--cx-bg)_34%,color-mix(in_oklab,var(--cx-bg)_60%,transparent)_60%,transparent_88%)]" />
    </div>
  )
}

function IconCard({
  icon: Icon,
  children,
  ...slide
}: { icon: LucideIcon; children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[32px] rounded-[24px] bg-(--cx-surface) p-[40px]">
      <Icon className="size-[72px] text-(--cx-accent)" strokeWidth={2} />
      <p className="text-[40px] leading-[1.3] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function Quote({ children, by, ...slide }: { children: ReactNode; by: string } & SlideProps) {
  return (
    <figure className="flex flex-col gap-[40px]">
      <span className="font-(family-name:--cx-font-display) text-[200px] leading-[0.6] font-bold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[84px] leading-[1.12] font-medium uppercase"
        {...slide}
      >
        {children}
      </blockquote>
      <figcaption className="text-[30px] leading-[1.3] font-bold tracking-[0.14em] text-(--cx-muted) uppercase">
        {by}
      </figcaption>
    </figure>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[28px]">
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] font-bold text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[44px] leading-[1.3] font-bold">{label}</p>
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div
      className={cn(
        'flex flex-col gap-[36px] rounded-[24px] p-[40px]',
        kind === 'do' ? 'bg-(--cx-surface)' : 'border-[3px] border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] font-(family-name:--cx-font-display) text-[40px] leading-[1.1] font-bold uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[40px]" strokeWidth={3} />
        {kind === 'do' ? 'Do' : "Don't"}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[38px] leading-[1.35] font-bold',
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
        <span className="flex size-[88px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) font-(family-name:--cx-font-display) text-[48px] leading-none font-bold text-(--cx-on-accent)">
          {n}
        </span>
        {!last && <span className="w-[4px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[10px]', !last && 'pb-[56px]')}>
        <p className="font-(family-name:--cx-font-display) text-[60px] leading-[1.05] font-bold uppercase">
          {title}
        </p>
        <p className="text-[40px] leading-[1.4] font-medium text-(--cx-muted)" {...slide}>
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
        <Eyebrow>Speaking tips</Eyebrow>
        <Hero>Own the room in five minutes</Hero>
        <Body>Tall type, loud colour and one yellow tag. Built for bold, punchy advice.</Body>
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
        <Eyebrow>On stage</Eyebrow>
        <Hero>Bring the energy</Hero>
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
          <Eyebrow>The basics</Eyebrow>
          <Title>Three rules for any talk</Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="1">Open with the point, not the agenda.</Point>
          <Point n="2">One idea per slide behind you.</Point>
          <Point n="3">End on what they should do next.</Point>
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
          alt="A speaker talking into a microphone on stage"
          className="h-[520px] w-full rounded-[24px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Rehearsal</Eyebrow>
          <Title>Practise standing up</Title>
          <Body>Your voice changes the moment you stand.</Body>
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
          <Eyebrow>Your toolkit</Eyebrow>
          <Title>Four habits of calm speakers</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Mic}>Test the mic early</IconCard>
          <IconCard icon={Timer}>Cut it to time</IconCard>
          <IconCard icon={Ear}>Pause after questions</IconCard>
          <IconCard icon={Hand}>Use open hands</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame className="bg-[linear-gradient(160deg,var(--cx-bg)_40%,color-mix(in_oklab,var(--cx-bg)_70%,black)_100%)]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your boldest line goes here, short and loud.</Quote>
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
        <BigStat value="3" label="rehearsals out loud before any talk that matters." />
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
          <Eyebrow>Openers</Eyebrow>
          <Title>The first thirty seconds</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Thank the hosts', 'Read the agenda', 'Apologise first']}
          />
          <CompareColumn kind="do" items={['Ask a question', 'Tell a story', 'State the point']} />
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
          <Title>Build a talk in a day</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Outline">
            Write the one sentence you want remembered.
          </Step>
          <Step n="2" title="Draft">
            Add three stories that prove it.
          </Step>
          <Step n="3" title="Rehearse" last>
            Run it out loud, then cut a third.
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

// Theme demo: split-versus — keep components in lockstep with theme.md
import { cn } from 'cn'
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ListChecks,
  type LucideIcon,
  Repeat,
  Target,
  X,
} from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#14213D',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#3DDC97',
  '--cx-muted': '#B4BED0',
  '--cx-on-accent': '#0B1A33',
  '--cx-band': '#F4F5F7',
  '--cx-band-fg': '#14213D',
  '--cx-band-muted': '#4A5568',
  '--cx-rule': 'rgba(255, 255, 255, 0.18)',
  '--cx-band-rule': 'rgba(20, 33, 61, 0.14)',
  '--cx-font-display': "'Inter Tight', system-ui, sans-serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  'navy-white': {
    name: 'Navy & White',
    tokens: {
      '--cx-bg': '#14213D',
      '--cx-fg': '#FFFFFF',
      '--cx-accent': '#3DDC97',
      '--cx-muted': '#B4BED0',
      '--cx-on-accent': '#0B1A33',
      '--cx-band': '#F4F5F7',
      '--cx-band-fg': '#14213D',
      '--cx-band-muted': '#4A5568',
      '--cx-rule': 'rgba(255, 255, 255, 0.18)',
      '--cx-band-rule': 'rgba(20, 33, 61, 0.14)',
    } as CSSProperties,
  },
  'black-lime': {
    name: 'Black & Lime',
    tokens: {
      '--cx-bg': '#111111',
      '--cx-fg': '#FFFFFF',
      '--cx-accent': '#D4FF3F',
      '--cx-muted': '#ADADAD',
      '--cx-on-accent': '#111111',
      '--cx-band': '#F2F2EE',
      '--cx-band-fg': '#111111',
      '--cx-band-muted': '#555555',
      '--cx-rule': 'rgba(255, 255, 255, 0.18)',
      '--cx-band-rule': 'rgba(17, 17, 17, 0.14)',
    } as CSSProperties,
  },
  'plum-cream': {
    name: 'Plum & Cream',
    tokens: {
      '--cx-bg': '#3E1F47',
      '--cx-fg': '#FFFFFF',
      '--cx-accent': '#FFB86B',
      '--cx-muted': '#CDB8D3',
      '--cx-on-accent': '#3E1F47',
      '--cx-band': '#F7EFE3',
      '--cx-band-fg': '#3E1F47',
      '--cx-band-muted': '#6B5A6F',
      '--cx-rule': 'rgba(255, 255, 255, 0.18)',
      '--cx-band-rule': 'rgba(62, 31, 71, 0.14)',
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

function Band({ from }: { from: number }) {
  return <div className="absolute inset-x-0 bottom-0 -z-10 bg-(--cx-band)" style={{ top: from }} />
}

function VsBadge({ at, label = 'VS' }: { at: number; label?: string }) {
  return (
    <span
      className="absolute left-1/2 flex size-[136px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[10px] border-(--cx-bg) bg-(--cx-accent) font-(family-name:--cx-font-display) text-[44px] leading-none font-extrabold text-(--cx-on-accent)"
      style={{ top: at }}
    >
      {label}
    </span>
  )
}

function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="text-[28px] leading-[1.2] font-extrabold tracking-[0.16em] text-(--cx-accent) uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}

function Hero({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h1
      className="font-(family-name:--cx-font-display) text-[120px] leading-[1.0] font-extrabold tracking-[-0.02em] uppercase"
      {...slide}
    >
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[84px] leading-[1.05] font-extrabold tracking-[-0.015em] uppercase"
      {...slide}
    >
      {children}
    </h2>
  )
}

function Body({
  children,
  tone = 'dark',
  ...slide
}: { children: ReactNode; tone?: 'dark' | 'band' } & SlideProps) {
  return (
    <p
      className={cn(
        'text-[40px] leading-[1.45] font-medium',
        tone === 'dark' ? 'text-(--cx-muted)' : 'text-(--cx-band-muted)',
      )}
      {...slide}
    >
      {children}
    </p>
  )
}

function Point({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[32px] border-t border-(--cx-rule) pt-[32px]">
      <span className="flex size-[72px] shrink-0 items-center justify-center rounded-[16px] bg-(--cx-accent) font-(family-name:--cx-font-display) text-[40px] leading-none font-extrabold text-(--cx-on-accent)">
        {n}
      </span>
      <p className="text-[40px] leading-[1.35] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function SwipeCue() {
  return (
    <p className="flex items-center gap-[14px] self-start rounded-full bg-(--cx-accent) px-[32px] py-[14px] text-[28px] leading-[1.2] font-extrabold tracking-[0.12em] text-(--cx-on-accent) uppercase">
      Swipe
      <ArrowRight className="size-[32px]" strokeWidth={3} />
    </p>
  )
}

function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
  return (
    <div className="flex items-center gap-[32px] text-(--cx-band-fg)">
      <span className="flex size-[120px] shrink-0 items-center justify-center rounded-full bg-(--cx-band-fg) font-(family-name:--cx-font-display) text-[48px] leading-none font-extrabold text-(--cx-band)">
        {initials}
      </span>
      <div className="flex flex-col gap-[6px]">
        <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.1] font-extrabold tracking-[-0.015em] uppercase">
          {AUTHOR.name}
        </p>
        <p className="text-[32px] leading-[1.3] font-bold text-(--cx-band-muted)">
          {AUTHOR.handle}
        </p>
      </div>
    </div>
  )
}

function Footer({
  page,
  total,
  tone = 'dark',
}: {
  page: number
  total: number
  tone?: 'dark' | 'band'
}) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div
      className={cn(
        'mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-bold',
        tone === 'dark' ? 'text-(--cx-muted)' : 'text-(--cx-band-muted)',
      )}
    >
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
      <div className="absolute inset-0 bg-(--cx-band) mix-blend-multiply" />
      <div className="absolute inset-0 bg-(--cx-bg) mix-blend-lighten" />
    </div>
  )
}

function PhotoBackdrop({ src }: { src: string }) {
  return (
    <div className="absolute inset-0 -z-10">
      <Photo src={src} alt="" className="size-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--cx-bg)_36%,color-mix(in_oklab,var(--cx-bg)_60%,transparent)_62%,transparent_90%)]" />
    </div>
  )
}

function IconCard({
  icon: Icon,
  children,
  ...slide
}: { icon: LucideIcon; children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[32px] rounded-[24px] bg-(--cx-band) p-[40px] text-(--cx-band-fg)">
      <Icon className="size-[72px]" strokeWidth={2.25} />
      <p className="text-[40px] leading-[1.3] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function Quote({ children, by, ...slide }: { children: ReactNode; by: string } & SlideProps) {
  return (
    <figure className="flex flex-col gap-[40px]">
      <span className="font-(family-name:--cx-font-display) text-[200px] leading-[0.6] font-extrabold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[76px] leading-[1.1] font-extrabold tracking-[-0.015em] uppercase"
        {...slide}
      >
        {children}
      </blockquote>
      <figcaption className="text-[30px] leading-[1.3] font-bold text-(--cx-muted)">
        — {by}
      </figcaption>
    </figure>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[28px]">
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] font-extrabold tracking-[-0.04em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[44px] leading-[1.3] font-bold">{label}</p>
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div className={cn('flex flex-col gap-[24px]', kind === 'do' && 'text-(--cx-band-fg)')}>
      <p
        className={cn(
          'flex items-center gap-[12px] text-[28px] leading-[1.2] font-extrabold tracking-[0.16em] uppercase',
          kind === 'do' ? 'text-(--cx-band-muted)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[34px]" strokeWidth={3} />
        {kind === 'do' ? 'Instead' : 'Stop'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className="font-(family-name:--cx-font-display) text-[52px] leading-[1.1] font-extrabold tracking-[-0.01em] uppercase"
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
        <span className="flex size-[80px] shrink-0 items-center justify-center rounded-[18px] bg-(--cx-accent) font-(family-name:--cx-font-display) text-[44px] leading-none font-extrabold text-(--cx-on-accent)">
          {n}
        </span>
        {!last && <span className="w-[4px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[8px]', !last && 'pb-[56px]')}>
        <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.05] font-extrabold uppercase">
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
      <Band from={675} />
      <VsBadge at={675} />
      <div className="flex flex-1 flex-col">
        <div className="flex h-[515px] flex-col justify-end gap-[32px] pb-[72px]">
          <Eyebrow>Mindset</Eyebrow>
          <Hero>Wait for motivation</Hero>
        </div>
        <div className="flex flex-col gap-[32px] pt-[120px] text-(--cx-band-fg)">
          <Hero>Build a system</Hero>
          <Body tone="band">Two tones, one big contrast.</Body>
          <SwipeCue />
        </div>
      </div>
      <Footer page={1} total={10} tone="band" />
    </Frame>
  )
}

function PhotoCover() {
  return (
    <Frame>
      <PhotoBackdrop src={coverPhoto} />
      <div className="flex flex-1 flex-col justify-end gap-[40px] pb-[48px]">
        <Eyebrow>Strategy</Eyebrow>
        <Hero>Play the long game</Hero>
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
          <Eyebrow>The shift</Eyebrow>
          <Title>Three habits that beat willpower</Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="1">Decide the night before.</Point>
          <Point n="2">Make the first step tiny.</Point>
          <Point n="3">Track streaks, not results.</Point>
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
          alt="A dirt road splitting into two paths"
          className="h-[520px] w-full rounded-[24px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Choices</Eyebrow>
          <Title>Pick a lane</Title>
          <Body>Every yes to one path is a no to another.</Body>
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
          <Eyebrow>The system</Eyebrow>
          <Title>Four parts of a routine</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Target}>One clear goal</IconCard>
          <IconCard icon={CalendarCheck}>A fixed time</IconCard>
          <IconCard icon={ListChecks}>A short checklist</IconCard>
          <IconCard icon={Repeat}>A weekly review</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame className="bg-[repeating-linear-gradient(90deg,transparent_0_134px,var(--cx-rule)_134px_136px)]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your sharpest contrast goes here, in one line.</Quote>
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
        <BigStat value="2" label="minutes is the right size for a new habit's first step." />
      </div>
      <Footer page={7} total={10} />
    </Frame>
  )
}

function Compare() {
  return (
    <Frame>
      <Band from={720} />
      <VsBadge at={720} />
      <div className="flex flex-1 flex-col">
        <div className="flex h-[560px] flex-col gap-[40px]">
          <div className="flex flex-col gap-[24px]">
            <Eyebrow>Monday morning</Eyebrow>
            <Title>Old way</Title>
          </div>
          <CompareColumn
            kind="dont"
            items={['Wait to feel ready', 'Plan the whole year', 'Start from zero']}
          />
        </div>
        <div className="pt-[96px]">
          <CompareColumn
            kind="do"
            items={['Start before ready', 'Plan one week', 'Reuse last week']}
          />
        </div>
      </div>
      <Footer page={8} total={10} tone="band" />
    </Frame>
  )
}

function Steps() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[56px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The method</Eyebrow>
          <Title>Build it in a week</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Choose">
            Pick one habit you can do daily.
          </Step>
          <Step n="2" title="Anchor">
            Attach it to something you already do.
          </Step>
          <Step n="3" title="Review" last>
            Check the streak every Sunday.
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
      <Band from={700} />
      <div className="flex flex-1 flex-col">
        <div className="flex h-[540px] flex-col justify-end gap-[32px] pb-[72px]">
          <Eyebrow>Before you go</Eyebrow>
          <Title>Found this useful?</Title>
          <Body>Follow for a new carousel every week, and repost it.</Body>
        </div>
        <div className="pt-[96px]">
          <AuthorCard />
        </div>
      </div>
      <Footer page={10} total={10} tone="band" />
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

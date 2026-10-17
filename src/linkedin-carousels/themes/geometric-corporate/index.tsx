// Theme demo: geometric-corporate — keep components in lockstep with theme.md
import { cn } from 'cn'
import {
  ArrowRight,
  BarChart3,
  Check,
  Handshake,
  type LucideIcon,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#0F1E3D',
  '--cx-accent': '#1D4ED8',
  '--cx-muted': '#556070',
  '--cx-on-accent': '#FFFFFF',
  '--cx-shape-1': '#0F1E3D',
  '--cx-shape-2': '#60A5FA',
  '--cx-tint': '#EEF3FB',
  '--cx-rule': 'rgba(15, 30, 61, 0.12)',
  '--cx-font-display': "'Manrope', system-ui, sans-serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  'corporate-blue': {
    name: 'Corporate Blue',
    tokens: {
      '--cx-bg': '#FFFFFF',
      '--cx-fg': '#0F1E3D',
      '--cx-accent': '#1D4ED8',
      '--cx-muted': '#556070',
      '--cx-on-accent': '#FFFFFF',
      '--cx-shape-1': '#0F1E3D',
      '--cx-shape-2': '#60A5FA',
      '--cx-tint': '#EEF3FB',
      '--cx-rule': 'rgba(15, 30, 61, 0.12)',
    } as CSSProperties,
  },
  'peach-coral': {
    name: 'Peach Coral',
    tokens: {
      '--cx-bg': '#FFFBF8',
      '--cx-fg': '#3A1F1A',
      '--cx-accent': '#C2410C',
      '--cx-muted': '#6B5550',
      '--cx-on-accent': '#FFFFFF',
      '--cx-shape-1': '#C2412D',
      '--cx-shape-2': '#FDBA9B',
      '--cx-tint': '#FDEEE6',
      '--cx-rule': 'rgba(58, 31, 26, 0.12)',
    } as CSSProperties,
  },
  emerald: {
    name: 'Emerald',
    tokens: {
      '--cx-bg': '#FFFFFF',
      '--cx-fg': '#0B2A22',
      '--cx-accent': '#047857',
      '--cx-muted': '#4F6460',
      '--cx-on-accent': '#FFFFFF',
      '--cx-shape-1': '#0B2A22',
      '--cx-shape-2': '#6EE7B7',
      '--cx-tint': '#E9F7F1',
      '--cx-rule': 'rgba(11, 42, 34, 0.12)',
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
        <Shapes />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </LinkedInCarouselSlide>
  )
}

function Shapes() {
  return (
    <>
      <div className="pointer-events-none absolute top-0 right-0 size-[150px] rounded-bl-full bg-(--cx-shape-1)" />
      <div className="pointer-events-none absolute top-[150px] right-0 size-[75px] rounded-l-full bg-(--cx-shape-2)" />
      <div className="pointer-events-none absolute top-0 left-0 size-[96px] bg-(--cx-shape-2) [clip-path:polygon(0_0,100%_0,0_100%)]" />
      <div className="pointer-events-none absolute bottom-[300px] left-0 h-[120px] w-[60px] rounded-r-full bg-(--cx-shape-1)" />
    </>
  )
}

function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="self-start rounded-full bg-(--cx-accent) px-[22px] py-[10px] text-[26px] leading-[1.2] font-bold tracking-[0.1em] text-(--cx-on-accent) uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}

function Mark({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <span className="text-(--cx-accent)" {...slide}>
      {children}
    </span>
  )
}

function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[116px] leading-[1.02] font-extrabold tracking-[-0.035em]">
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[80px] leading-[1.08] font-extrabold tracking-[-0.03em]"
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
    <div className="flex items-center gap-[28px] rounded-[20px] bg-(--cx-tint) px-[32px] py-[28px]">
      <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-(--cx-shape-1) text-[36px] leading-none font-extrabold text-(--cx-bg)">
        {n}
      </span>
      <p className="text-[40px] leading-[1.3] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function SwipeCue() {
  return (
    <p className="flex items-center gap-[16px] self-start rounded-full border-[3px] border-(--cx-accent) px-[30px] py-[12px] text-[28px] leading-[1.2] font-bold text-(--cx-accent)">
      Swipe to learn more
      <ArrowRight className="size-[32px]" strokeWidth={2.75} />
    </p>
  )
}

function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
  return (
    <div className="flex items-center gap-[32px]">
      <span className="flex size-[120px] shrink-0 items-center justify-center rounded-full rounded-tr-none bg-(--cx-accent) text-[48px] leading-none font-extrabold text-(--cx-on-accent)">
        {initials}
      </span>
      <div className="flex flex-col gap-[6px]">
        <p className="text-[52px] leading-[1.1] font-extrabold tracking-[-0.02em]">{AUTHOR.name}</p>
        <p className="text-[32px] leading-[1.3] font-semibold text-(--cx-muted)">{AUTHOR.handle}</p>
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
      <span className="font-bold text-(--cx-accent) tabular-nums">
        {pad(page)} / {pad(total)}
      </span>
    </div>
  )
}

function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.15]" />
      <div className="absolute inset-0 bg-(--cx-tint) mix-blend-multiply" />
      <div className="absolute inset-0 bg-(--cx-shape-1) mix-blend-lighten" />
    </div>
  )
}

function IconCard({
  icon: Icon,
  children,
  ...slide
}: { icon: LucideIcon; children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[32px] rounded-[24px] rounded-tr-[80px] bg-(--cx-tint) p-[40px]">
      <span className="flex size-[96px] items-center justify-center rounded-full bg-(--cx-shape-1) text-(--cx-bg)">
        <Icon className="size-[48px]" strokeWidth={2} />
      </span>
      <p className="text-[40px] leading-[1.3] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function Quote({ children, by, ...slide }: { children: ReactNode; by: string } & SlideProps) {
  return (
    <figure className="flex flex-col gap-[40px]">
      <span className="text-[200px] leading-[0.6] font-extrabold text-(--cx-accent)">“</span>
      <blockquote
        className="text-[72px] leading-[1.15] font-extrabold tracking-[-0.025em]"
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
      <p className="text-[260px] leading-[0.9] font-extrabold tracking-[-0.05em] text-(--cx-accent) tabular-nums">
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
        kind === 'do' ? 'rounded-tr-[80px] bg-(--cx-tint)' : 'border-[2px] border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] text-[26px] leading-[1.2] font-bold tracking-[0.1em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[30px]" strokeWidth={2.75} />
        {kind === 'do' ? 'Do' : 'Avoid'}
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
        <span className="flex size-[80px] shrink-0 items-center justify-center rounded-full rounded-tr-none bg-(--cx-accent) text-[38px] leading-none font-extrabold text-(--cx-on-accent)">
          {n}
        </span>
        {!last && <span className="w-[3px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[10px]', !last && 'pb-[56px]')}>
        <p className="text-[52px] leading-[1.1] font-extrabold tracking-[-0.02em]">{title}</p>
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
        <Eyebrow>Consulting notes</Eyebrow>
        <Hero>
          Five ways to <Mark>scale</Mark> your firm
        </Hero>
        <Body>Clean white space, bold geometry and one corporate blue. Built for B2B advice.</Body>
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
          alt="Looking up at a glass office building"
          className="h-[600px] w-full rounded-[32px] rounded-bl-[200px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Growth</Eyebrow>
          <Hero>
            Build to <Mark>last</Mark>
          </Hero>
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
          <Eyebrow>The basics</Eyebrow>
          <Title>
            Three mistakes to <Mark>avoid</Mark>
          </Title>
        </div>
        <div className="flex flex-col gap-[24px]">
          <Point n="1">Hiring before the process is clear.</Point>
          <Point n="2">Saying yes to every client.</Point>
          <Point n="3">Pricing by the hour forever.</Point>
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
          alt="Colleagues working together around a table"
          className="h-[520px] w-full rounded-[32px] rounded-tr-[200px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Teams</Eyebrow>
          <Title>Hire for the gaps</Title>
          <Body>Add the skills you lack, not more of yours.</Body>
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
          <Eyebrow>Foundations</Eyebrow>
          <Title>Four pillars of a firm</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Users}>The right team</IconCard>
          <IconCard icon={BarChart3}>Clear numbers</IconCard>
          <IconCard icon={Handshake}>Repeat clients</IconCard>
          <IconCard icon={ShieldCheck}>Simple contracts</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame className="bg-[radial-gradient(var(--cx-rule)_2px,transparent_2px)] bg-size-[36px_36px]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your clearest line goes here, in plain business words.</Quote>
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
        <BigStat value="80%" label="of revenue usually comes from your best fifth of clients." />
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
          <Eyebrow>Proposals</Eyebrow>
          <Title>Win the next pitch</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['Forty slides', 'Every service', 'Hourly rates']} />
          <CompareColumn kind="do" items={['One clear plan', 'Their problem', 'A fixed price']} />
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
          <Title>From founder to firm</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Document">
            Write down how you deliver today.
          </Step>
          <Step n="2" title="Delegate">
            Hand one step to someone else.
          </Step>
          <Step n="3" title="Repeat" last>
            Pick the next step every month.
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
          Found this <Mark>useful?</Mark>
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

// Theme demo: halftone-pop — keep components in lockstep with theme.md
import { cn } from 'cn'
import {
  ArrowRight,
  AtSign,
  Check,
  type LucideIcon,
  Megaphone,
  MessageCircle,
  PenLine,
  X,
} from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#141414',
  '--cx-accent': '#F26B1D',
  '--cx-accent-ink': '#B4470C',
  '--cx-muted': '#5A5A5A',
  '--cx-on-accent': '#141414',
  '--cx-rule': 'rgba(20, 20, 20, 0.12)',
  '--cx-font-display': "'Space Grotesk', system-ui, sans-serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  orange: {
    name: 'Orange',
    tokens: {
      '--cx-bg': '#FFFFFF',
      '--cx-fg': '#141414',
      '--cx-accent': '#F26B1D',
      '--cx-accent-ink': '#B4470C',
      '--cx-muted': '#5A5A5A',
      '--cx-on-accent': '#141414',
      '--cx-rule': 'rgba(20, 20, 20, 0.12)',
    } as CSSProperties,
  },
  'electric-blue': {
    name: 'Electric Blue',
    tokens: {
      '--cx-bg': '#FFFFFF',
      '--cx-fg': '#0D1530',
      '--cx-accent': '#2F6BFF',
      '--cx-accent-ink': '#1F4FD1',
      '--cx-muted': '#565D72',
      '--cx-on-accent': '#FFFFFF',
      '--cx-rule': 'rgba(13, 21, 48, 0.12)',
    } as CSSProperties,
  },
  magenta: {
    name: 'Magenta',
    tokens: {
      '--cx-bg': '#FFFFFF',
      '--cx-fg': '#1D0F18',
      '--cx-accent': '#E0218A',
      '--cx-accent-ink': '#B5136C',
      '--cx-muted': '#65586A',
      '--cx-on-accent': '#FFFFFF',
      '--cx-rule': 'rgba(29, 15, 24, 0.12)',
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
        <Halftone className="top-0 right-0 h-[380px] w-[560px] mask-[radial-gradient(ellipse_at_100%_0%,black_0%,transparent_64%)]" />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </LinkedInCarouselSlide>
  )
}

function Halftone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute bg-[radial-gradient(var(--cx-accent)_38%,transparent_40%)] bg-size-[26px_26px]',
        className,
      )}
    />
  )
}

function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="font-(family-name:--cx-font-display) text-[28px] leading-[1.2] font-bold tracking-[0.12em] text-(--cx-accent-ink) uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}

function Mark({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <span
      className="bg-(--cx-accent) box-decoration-clone px-[14px] text-(--cx-on-accent)"
      {...slide}
    >
      {children}
    </span>
  )
}

function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[116px] leading-[1.08] font-bold tracking-[-0.035em]">
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[80px] leading-[1.1] font-bold tracking-[-0.03em]"
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
    <div className="flex items-baseline gap-[32px] border-t-[3px] border-(--cx-fg) pt-[28px]">
      <span className="w-[64px] shrink-0 font-(family-name:--cx-font-display) text-[56px] leading-none font-bold text-(--cx-accent-ink)">
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
    <div className="flex items-center gap-[20px] text-(--cx-fg)">
      <span className="h-[3px] w-[160px] bg-(--cx-fg)" />
      <ArrowRight className="-ml-[34px] size-[44px]" strokeWidth={2.5} />
      <p className="font-(family-name:--cx-font-display) text-[30px] leading-[1.3] font-bold">
        Swipe
      </p>
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
      <span className="flex size-[120px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) font-(family-name:--cx-font-display) text-[48px] leading-none font-bold text-(--cx-on-accent)">
        {initials}
      </span>
      <div className="flex flex-col gap-[6px]">
        <p className="font-(family-name:--cx-font-display) text-[52px] leading-[1.1] font-bold tracking-[-0.02em]">
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
    <div className="mt-auto flex items-center justify-between font-(family-name:--cx-font-display) text-[26px] leading-[1.3] font-bold text-(--cx-muted)">
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
      <div className="absolute inset-0 bg-(--cx-accent) mix-blend-screen" />
      <Halftone className="inset-0 opacity-[0.35] mix-blend-multiply mask-[linear-gradient(to_top,black,transparent_60%)]" />
    </div>
  )
}

function IconCard({
  icon: Icon,
  children,
  ...slide
}: { icon: LucideIcon; children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[32px] border-[3px] border-(--cx-fg) p-[40px] shadow-[10px_10px_0_var(--cx-accent)]">
      <Icon className="size-[72px] text-(--cx-accent-ink)" strokeWidth={2.25} />
      <p className="text-[40px] leading-[1.3] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function Quote({ children, by, ...slide }: { children: ReactNode; by: string } & SlideProps) {
  return (
    <figure className="flex flex-col gap-[40px]">
      <span className="font-(family-name:--cx-font-display) text-[220px] leading-[0.6] font-bold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[72px] leading-[1.15] font-bold tracking-[-0.025em]"
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
      <p className="self-start bg-(--cx-accent) px-[24px] font-(family-name:--cx-font-display) text-[240px] leading-[1.0] font-bold tracking-[-0.05em] text-(--cx-on-accent) tabular-nums">
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
        'flex flex-col gap-[36px] p-[40px]',
        kind === 'do'
          ? 'border-[3px] border-(--cx-fg) shadow-[10px_10px_0_var(--cx-accent)]'
          : 'border-[3px] border-dashed border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] font-(family-name:--cx-font-display) text-[30px] leading-[1.2] font-bold uppercase',
          kind === 'do' ? 'text-(--cx-accent-ink)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[34px]" strokeWidth={3} />
        {kind === 'do' ? 'Write' : 'Avoid'}
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
        <span className="flex size-[80px] shrink-0 items-center justify-center bg-(--cx-accent) font-(family-name:--cx-font-display) text-[44px] leading-none font-bold text-(--cx-on-accent)">
          {n}
        </span>
        {!last && <span className="w-[3px] flex-1 bg-(--cx-fg)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[8px]', !last && 'pb-[56px]')}>
        <p className="font-(family-name:--cx-font-display) text-[52px] leading-[1.1] font-bold tracking-[-0.02em]">
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
        <Eyebrow>Copywriting tips</Eyebrow>
        <Hero>
          How to write a better <Mark>headline</Mark>
        </Hero>
        <Body>
          Halftone dots, a grotesk headline and one highlighted word. Built for loud how-tos.
        </Body>
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
        <Photo src={coverPhoto} alt="A megaphone on a white wall" className="h-[600px] w-full" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Be heard</Eyebrow>
          <Hero>
            Say it <Mark>louder</Mark>
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
      <div className="flex flex-1 flex-col gap-[64px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The basics</Eyebrow>
          <Title>
            Three rules for <Mark>clear</Mark> copy
          </Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="1">Write to one reader, not a crowd.</Point>
          <Point n="2">Lead with the benefit.</Point>
          <Point n="3">Cut every word you can.</Point>
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
        <Photo src={splitPhoto} alt="Hands typing on a laptop" className="h-[520px] w-full" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Drafting</Eyebrow>
          <Title>Write fast, edit slow</Title>
          <Body>Get it all down first, then cut it in half.</Body>
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
          <Eyebrow>The toolkit</Eyebrow>
          <Title>Four hooks that work</Title>
        </div>
        <div className="grid grid-cols-2 gap-[32px]">
          <IconCard icon={MessageCircle}>Ask a question</IconCard>
          <IconCard icon={Megaphone}>Make a bold claim</IconCard>
          <IconCard icon={PenLine}>Start a story</IconCard>
          <IconCard icon={AtSign}>Call out a reader</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame>
      <Halftone className="-right-[96px] bottom-[80px] -z-10 h-[400px] w-[640px] mask-[radial-gradient(ellipse_at_100%_100%,black_10%,transparent_70%)]" />
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your punchiest line goes here, short enough to repost.</Quote>
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
        <BigStat value="5×" label="more people read the headline than the body." />
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
          <Eyebrow>Word choice</Eyebrow>
          <Title>Swap these words</Title>
        </div>
        <div className="grid grid-cols-2 gap-[32px]">
          <CompareColumn kind="dont" items={['Utilise', 'In order to', 'Very unique']} />
          <CompareColumn kind="do" items={['Use', 'To', 'Unique']} />
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
          <Title>Edit in three passes</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Cut">
            Delete anything the reader won't miss.
          </Step>
          <Step n="2" title="Sharpen">
            Swap vague words for exact ones.
          </Step>
          <Step n="3" title="Read aloud" last>
            Fix every spot where you stumble.
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

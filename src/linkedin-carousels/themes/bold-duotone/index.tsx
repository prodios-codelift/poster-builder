// Theme demo: bold-duotone — keep components in lockstep with theme.md
import { cn } from 'cn'
import { Check, Eye, Heart, type LucideIcon, MessageCircle, Repeat2, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#1E3AFF',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#D4FF3A',
  '--cx-on-accent': '#0A0A0A',
  '--cx-muted': 'rgba(255, 255, 255, 0.78)',
  '--cx-font-display': "'Inter Tight', system-ui, sans-serif",
  '--cx-font-body': "'Inter Tight', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  'cobalt-lime': {
    name: 'Cobalt Lime',
    tokens: {
      '--cx-bg': '#1E3AFF',
      '--cx-fg': '#FFFFFF',
      '--cx-accent': '#D4FF3A',
      '--cx-on-accent': '#0A0A0A',
      '--cx-muted': 'rgba(255, 255, 255, 0.78)',
    } as CSSProperties,
  },
  'tomato-ink': {
    name: 'Tomato Ink',
    tokens: {
      '--cx-bg': '#FF5A36',
      '--cx-fg': '#1A1A1A',
      '--cx-accent': '#FFFFFF',
      '--cx-on-accent': '#1A1A1A',
      '--cx-muted': 'rgba(26, 26, 26, 0.9)',
    } as CSSProperties,
  },
  'grape-peach': {
    name: 'Grape Peach',
    tokens: {
      '--cx-bg': '#5B21B6',
      '--cx-fg': '#FFF1E6',
      '--cx-accent': '#FFB38A',
      '--cx-on-accent': '#2E1065',
      '--cx-muted': 'rgba(255, 241, 230, 0.78)',
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
      className="text-[28px] leading-[1.2] font-extrabold tracking-[0.14em] text-(--cx-accent) uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}

function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[140px] leading-[1.04] font-extrabold tracking-[-0.04em] [&_mark]:bg-(--cx-accent) [&_mark]:px-[14px] [&_mark]:text-(--cx-on-accent) [&_mark]:[box-decoration-break:clone]">
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[100px] leading-[1.06] font-extrabold tracking-[-0.035em] [&_mark]:bg-(--cx-accent) [&_mark]:px-[12px] [&_mark]:text-(--cx-on-accent) [&_mark]:[box-decoration-break:clone]"
      {...slide}
    >
      {children}
    </h2>
  )
}

function Body({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p className="text-[42px] leading-[1.4] font-semibold" {...slide}>
      {children}
    </p>
  )
}

function Point({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-start gap-[36px]">
      <span className="w-[100px] shrink-0 font-(family-name:--cx-font-display) text-[88px] leading-[0.9] font-extrabold tracking-[-0.05em] text-(--cx-accent)">
        {n}
      </span>
      <p className="pt-[8px] text-[44px] leading-[1.2] font-bold tracking-[-0.02em]" {...slide}>
        {children}
      </p>
    </div>
  )
}

function SwipeCue() {
  return (
    <p className="self-start rounded-full bg-(--cx-accent) px-[36px] py-[16px] text-[30px] leading-[1.2] font-extrabold text-(--cx-on-accent)">
      Swipe →
    </p>
  )
}

function AuthorCard() {
  return (
    <div className="flex flex-col gap-[8px]">
      <p className="font-(family-name:--cx-font-display) text-[64px] leading-[1.0] font-extrabold tracking-[-0.04em]">
        {AUTHOR.name}
      </p>
      <p className="text-[34px] leading-[1.3] font-bold text-(--cx-accent)">{AUTHOR.handle}</p>
    </div>
  )
}

function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-bold text-(--cx-muted)">
      <span>{AUTHOR.handle}</span>
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
      <div className="absolute inset-0 bg-(--cx-accent) mix-blend-multiply" />
      <div className="absolute inset-0 bg-(--cx-bg) mix-blend-lighten" />
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
    <div className="flex flex-col gap-[44px]">
      <Icon className="size-[128px] text-(--cx-accent)" strokeWidth={2.25} />
      <p className="text-[52px] leading-[1.15] font-extrabold tracking-[-0.02em]" {...slide}>
        {children}
      </p>
    </div>
  )
}

function Quote({ children, by, ...slide }: { children: ReactNode; by: string } & SlideProps) {
  return (
    <figure className="flex flex-col gap-[40px]">
      <span className="font-(family-name:--cx-font-display) text-[240px] leading-[0.55] font-extrabold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[76px] leading-[1.06] font-extrabold tracking-[-0.035em]"
        {...slide}
      >
        {children}
      </blockquote>
      <figcaption className="text-[32px] leading-[1.3] font-bold text-(--cx-accent)">
        {by}
      </figcaption>
    </figure>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[32px]">
      <p className="font-(family-name:--cx-font-display) text-[360px] leading-[0.85] font-extrabold tracking-[-0.06em] text-(--cx-accent)">
        {value}
      </p>
      <p className="text-[52px] leading-[1.15] font-extrabold tracking-[-0.03em]">{label}</p>
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div className="flex flex-col gap-[40px]">
      <p
        className={cn(
          'flex items-center gap-[12px] text-[28px] leading-[1.2] font-extrabold tracking-[0.14em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[34px]" strokeWidth={3} />
        {kind === 'do' ? 'Do' : 'Don’t'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[48px] leading-[1.15] font-extrabold tracking-[-0.02em]',
            kind === 'dont' ? 'text-(--cx-muted) line-through' : 'text-(--cx-accent)',
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
    <div className={cn('flex items-start gap-[36px]', !last && 'pb-[56px]')}>
      <span className="w-[100px] shrink-0 font-(family-name:--cx-font-display) text-[96px] leading-[0.9] font-extrabold tracking-[-0.05em] text-(--cx-accent)">
        {n}
      </span>
      <div className="flex flex-col gap-[8px] pt-[6px]">
        <p className="text-[54px] leading-[1.1] font-extrabold tracking-[-0.03em]">{title}</p>
        <p className="text-[42px] leading-[1.3] font-semibold" {...slide}>
          {children}
        </p>
      </div>
    </div>
  )
}

function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[56px]">
        <Eyebrow>Bold Duotone</Eyebrow>
        <Hero>
          Say it big. Say it <mark>once.</mark>
        </Hero>
        <Body>One loud colour, giant type and a single highlight.</Body>
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
        <Eyebrow>Real talk</Eyebrow>
        <Hero>
          Own the <mark>stage</mark>
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
      <div className="flex flex-1 flex-col justify-center gap-[72px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The formula</Eyebrow>
          <Title>
            Hook, <mark>proof,</mark> ask
          </Title>
        </div>
        <div className="flex flex-col gap-[48px]">
          <Point n="1">Open with the bold claim.</Point>
          <Point n="2">Back it with one example.</Point>
          <Point n="3">End with a single ask.</Point>
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
          alt="A black and white studio portrait"
          className="h-[520px] w-full"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>On stage</Eyebrow>
          <Title>
            Talk like a <mark>human</mark>
          </Title>
          <Body>Write the post the way you would say it out loud.</Body>
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
          <Eyebrow>What counts</Eyebrow>
          <Title>
            Four <mark>signals</mark>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Eye}>Dwell time</IconCard>
          <IconCard icon={MessageCircle}>Comments</IconCard>
          <IconCard icon={Repeat2}>Reposts</IconCard>
          <IconCard icon={Heart}>Saves</IconCard>
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
        <Quote by={AUTHOR.name}>Your best line goes here, in your own words.</Quote>
      </div>
      <Footer page={6} total={10} />
    </Frame>
  )
}

function StatSlide() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[56px]">
        <Eyebrow>Remember</Eyebrow>
        <BigStat value="1" label="idea. One post. Every time." />
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
          <Eyebrow>Write it like this</Eyebrow>
          <Title>
            Cut the <mark>fluff</mark>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['In today’s world', 'I’m humbled', 'Thoughts?']} />
          <CompareColumn kind="do" items={['Here’s the fix', 'I learned this', 'Try it today']} />
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
          <Eyebrow>Playbook</Eyebrow>
          <Title>Post in 3 moves</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Hook">
            One bold line.
          </Step>
          <Step n="2" title="Value">
            One useful idea.
          </Step>
          <Step n="3" title="Ask" last>
            One clear action.
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
      <div className="flex flex-1 flex-col justify-center gap-[56px]">
        <Eyebrow>That’s it</Eyebrow>
        <Title>
          <mark>Follow</mark> for more
        </Title>
        <Body>A new carousel every week. Repost if it helped.</Body>
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

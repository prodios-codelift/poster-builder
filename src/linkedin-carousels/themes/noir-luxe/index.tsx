// Theme demo: noir-luxe — keep components in lockstep with theme.md
import { cn } from 'cn'
import { Check, Crown, Diamond, Gem, type LucideIcon, Sparkle, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#0C0C0C',
  '--cx-fg': '#F3EDE2',
  '--cx-accent': '#CBB389',
  '--cx-muted': '#968F84',
  '--cx-rule': 'rgba(203, 179, 137, 0.32)',
  '--cx-font-display': "'Instrument Serif', Georgia, serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  champagne: {
    name: 'Champagne',
    tokens: {
      '--cx-bg': '#0C0C0C',
      '--cx-fg': '#F3EDE2',
      '--cx-accent': '#CBB389',
      '--cx-muted': '#968F84',
      '--cx-rule': 'rgba(203, 179, 137, 0.32)',
    } as CSSProperties,
  },
  bordeaux: {
    name: 'Bordeaux',
    tokens: {
      '--cx-bg': '#170B0F',
      '--cx-fg': '#F5ECE8',
      '--cx-accent': '#D98A98',
      '--cx-muted': '#A08F93',
      '--cx-rule': 'rgba(217, 138, 152, 0.32)',
    } as CSSProperties,
  },
  'emerald-gold': {
    name: 'Emerald Gold',
    tokens: {
      '--cx-bg': '#0A1411',
      '--cx-fg': '#EFEADF',
      '--cx-accent': '#C8A45A',
      '--cx-muted': '#929B95',
      '--cx-rule': 'rgba(200, 164, 90, 0.32)',
    } as CSSProperties,
  },
} satisfies Record<string, { name: string; tokens: CSSProperties }>

const AUTHOR = { name: 'Your Name', handle: '@yourhandle' }

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LinkedInCarouselSlide tokens={TOKENS}>
      <div
        className={cn(
          'relative isolate flex size-full flex-col bg-(--cx-bg) px-[104px] pt-[120px] pb-[72px] font-(family-name:--cx-font-body) text-(--cx-fg)',
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
    <div className="flex items-center gap-[24px]">
      <p className="text-[26px] leading-[1.2] font-semibold tracking-[0.32em] text-(--cx-accent) uppercase">
        {children}
      </p>
      <span className="h-px w-[96px] bg-(--cx-accent)" />
    </div>
  )
}

function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[144px] leading-[0.98] font-normal tracking-[-0.02em] [&_em]:text-(--cx-accent)">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[100px] leading-[1.02] font-normal tracking-[-0.015em] [&_em]:text-(--cx-accent)">
      {children}
    </h2>
  )
}

function Body({ children }: { children: ReactNode }) {
  return <p className="text-[38px] leading-[1.55] font-medium">{children}</p>
}

function Point({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-[40px] border-b border-(--cx-rule) pb-[32px]">
      <span className="w-[72px] shrink-0 font-(family-name:--cx-font-display) text-[56px] leading-none text-(--cx-accent) italic">
        {n}
      </span>
      <p className="text-[38px] leading-[1.4] font-medium">{children}</p>
    </div>
  )
}

function SwipeCue() {
  return (
    <p className="font-(family-name:--cx-font-display) text-[44px] leading-[1.2] text-(--cx-accent) italic">
      Swipe →
    </p>
  )
}

function AuthorCard() {
  return (
    <div className="flex flex-col gap-[14px] border-t border-(--cx-rule) pt-[36px]">
      <p className="font-(family-name:--cx-font-display) text-[68px] leading-[1.05]">
        {AUTHOR.name}
      </p>
      <p className="text-[26px] leading-[1.3] font-semibold tracking-[0.24em] text-(--cx-muted) uppercase">
        {AUTHOR.handle}
      </p>
    </div>
  )
}

function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-semibold tracking-[0.2em] text-(--cx-muted) uppercase">
      <span>{AUTHOR.name}</span>
      <span className="tabular-nums">
        {pad(page)} — {pad(total)}
      </span>
    </div>
  )
}

function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.1]" />
      <div className="absolute inset-0 bg-(--cx-accent) opacity-60 mix-blend-color" />
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

function IconCard({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[44px] border-t border-(--cx-rule) pt-[32px]">
      <Icon className="size-[80px] text-(--cx-accent)" strokeWidth={1.25} />
      <p className="font-(family-name:--cx-font-display) text-[60px] leading-[1.1]">{children}</p>
    </div>
  )
}

function Quote({ children, by }: { children: ReactNode; by: string }) {
  return (
    <figure className="flex flex-col gap-[40px]">
      <span className="font-(family-name:--cx-font-display) text-[200px] leading-[0.55] text-(--cx-accent)">
        “
      </span>
      <blockquote className="font-(family-name:--cx-font-display) text-[80px] leading-[1.08] italic">
        {children}
      </blockquote>
      <figcaption className="text-[26px] leading-[1.3] font-semibold tracking-[0.24em] text-(--cx-muted) uppercase">
        {by}
      </figcaption>
    </figure>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[28px]">
      <p className="font-(family-name:--cx-font-display) text-[300px] leading-[0.85] text-(--cx-accent)">
        {value}
      </p>
      <p className="text-[40px] leading-[1.45] font-medium">{label}</p>
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div className="flex flex-col gap-[40px] border-t border-(--cx-rule) pt-[32px]">
      <p
        className={cn(
          'flex items-center gap-[12px] text-[26px] leading-[1.2] font-semibold tracking-[0.28em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[28px]" strokeWidth={1.5} />
        {kind === 'do' ? 'Refined' : 'Ordinary'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'font-(family-name:--cx-font-display) text-[52px] leading-[1.15]',
            kind === 'dont' && 'text-(--cx-muted)',
            kind === 'do' && 'italic',
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
  const numerals = ['i.', 'ii.', 'iii.', 'iv.', 'v.']
  return (
    <div
      className={cn(
        'flex items-baseline gap-[40px] border-b border-(--cx-rule) pt-[28px] pb-[56px]',
        last && 'border-b-0',
      )}
    >
      <span className="w-[72px] shrink-0 font-(family-name:--cx-font-display) text-[62px] leading-none text-(--cx-accent) italic">
        {numerals[Number(n) - 1] ?? n}
      </span>
      <div className="flex flex-col gap-[10px]">
        <p className="font-(family-name:--cx-font-display) text-[62px] leading-[1.05]">{title}</p>
        <p className="text-[40px] leading-[1.45] font-medium">{children}</p>
      </div>
    </div>
  )
}

function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Noir Luxe</Eyebrow>
        <Hero>
          Quiet work, <em>loud</em> results
        </Hero>
        <Body>
          Black stock, an elegant serif and a single metallic accent. Built for personal brands.
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
      <PhotoBackdrop src={coverPhoto} />
      <div className="flex flex-1 flex-col justify-end gap-[40px] pb-[48px]">
        <Eyebrow>The edit</Eyebrow>
        <Hero>
          Time, <em>well</em> spent
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
          <Eyebrow>The standard</Eyebrow>
          <Title>
            Three signs of <em>real</em> craft
          </Title>
        </div>
        <div className="flex flex-col gap-[36px]">
          <Point n="i.">It looks simple from the outside.</Point>
          <Point n="ii.">Every detail has a reason.</Point>
          <Point n="iii.">Nothing is there to impress.</Point>
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
        <Photo src={splitPhoto} alt="Black marble with white veins" className="h-[520px] w-full" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Materials</Eyebrow>
          <Title>
            Choose <em>fewer</em>, better things
          </Title>
          <Body>Quality is what remains when everything else is removed.</Body>
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
          <Eyebrow>The pillars</Eyebrow>
          <Title>
            What makes it <em>lasting</em>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Gem}>Material</IconCard>
          <IconCard icon={Crown}>Restraint</IconCard>
          <IconCard icon={Diamond}>Precision</IconCard>
          <IconCard icon={Sparkle}>Patience</IconCard>
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
        <Eyebrow>A standard</Eyebrow>
        <BigStat value="100" label="years is the horizon a classic is designed for." />
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
          <Eyebrow>The difference</Eyebrow>
          <Title>
            Loud versus <em>lasting</em>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['Logos everywhere', 'Every trend', 'More options']} />
          <CompareColumn kind="do" items={['Quiet details', 'Timeless form', 'One choice']} />
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
          <Eyebrow>The practice</Eyebrow>
          <Title>
            How a brand <em>endures</em>
          </Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Edit">
            Remove until it feels inevitable.
          </Step>
          <Step n="2" title="Refine">
            Return to it after a week away.
          </Step>
          <Step n="3" title="Repeat" last>
            Hold the standard every time.
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
        <Eyebrow>Until next time</Eyebrow>
        <Title>
          Keep the <em>conversation</em> going
        </Title>
        <Body>Follow for a considered idea each week, and share it with someone who cares.</Body>
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

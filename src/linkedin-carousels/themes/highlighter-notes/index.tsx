// Theme demo: highlighter-notes — keep components in lockstep with theme.md
import { cn } from 'cn'
import { Brain, Check, Clock, type LucideIcon, NotebookPen, Target, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#FFFBEA',
  '--cx-fg': '#1C1917',
  '--cx-highlight': '#FDE047',
  '--cx-pen': '#C81E1E',
  '--cx-muted': '#615A50',
  '--cx-rule': 'rgba(28, 25, 23, 0.07)',
  '--cx-font-display': "'Manrope', system-ui, sans-serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
  '--cx-font-hand': "'Caveat', 'Comic Sans MS', cursive",
} as CSSProperties

export const PALETTES = {
  'classic-yellow': {
    name: 'Classic Yellow',
    tokens: {
      '--cx-bg': '#FFFBEA',
      '--cx-fg': '#1C1917',
      '--cx-highlight': '#FDE047',
      '--cx-pen': '#C81E1E',
      '--cx-muted': '#615A50',
      '--cx-rule': 'rgba(28, 25, 23, 0.07)',
    } as CSSProperties,
  },
  'pink-marker': {
    name: 'Pink Marker',
    tokens: {
      '--cx-bg': '#FFF5F8',
      '--cx-fg': '#1C1719',
      '--cx-highlight': '#F9A8D4',
      '--cx-pen': '#1D4ED8',
      '--cx-muted': '#635860',
      '--cx-rule': 'rgba(28, 23, 25, 0.07)',
    } as CSSProperties,
  },
  'green-marker': {
    name: 'Green Marker',
    tokens: {
      '--cx-bg': '#F7FEF0',
      '--cx-fg': '#18201A',
      '--cx-highlight': '#BEF264',
      '--cx-pen': '#9A3412',
      '--cx-muted': '#56604F',
      '--cx-rule': 'rgba(24, 32, 26, 0.07)',
    } as CSSProperties,
  },
} satisfies Record<string, { name: string; tokens: CSSProperties }>

const AUTHOR = { name: 'Your Name', handle: '@yourhandle' }

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LinkedInCarouselSlide tokens={TOKENS}>
      <div
        className={cn(
          'relative isolate flex size-full flex-col bg-(--cx-bg) bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_62px,var(--cx-rule)_62px,var(--cx-rule)_64px)] px-[96px] pt-[112px] pb-[72px] font-(family-name:--cx-font-body) text-(--cx-fg)',
          className,
        )}
      >
        {children}
      </div>
    </LinkedInCarouselSlide>
  )
}

function Mark({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <mark
      className="bg-transparent bg-[linear-gradient(transparent_52%,var(--cx-highlight)_52%,var(--cx-highlight)_92%,transparent_92%)] px-[6px] text-inherit [box-decoration-break:clone]"
      {...slide}
    >
      {children}
    </mark>
  )
}

function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="-rotate-2 self-start font-(family-name:--cx-font-hand) text-[48px] leading-[1.1] font-semibold text-(--cx-pen)"
      {...slide}
    >
      {children}
    </p>
  )
}

function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[112px] leading-[1.08] font-extrabold tracking-[-0.035em]">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[80px] leading-[1.12] font-extrabold tracking-[-0.03em]">
      {children}
    </h2>
  )
}

function Body({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p className="text-[40px] leading-[1.5] font-medium" {...slide}>
      {children}
    </p>
  )
}

function CheckItem({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[28px]">
      <span className="flex size-[56px] shrink-0 items-center justify-center rounded-[10px] border-[4px] border-(--cx-pen) font-(family-name:--cx-font-hand) text-[56px] leading-none font-semibold text-(--cx-pen)">
        ✓
      </span>
      <p className="text-[40px] leading-[1.35] font-semibold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function Note({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="rotate-[-1.5deg] self-start font-(family-name:--cx-font-hand) text-[46px] leading-[1.15] font-semibold text-(--cx-pen)"
      {...slide}
    >
      {children}
    </p>
  )
}

function SwipeCue() {
  return (
    <p className="font-(family-name:--cx-font-hand) text-[54px] leading-[1.1] font-semibold text-(--cx-pen)">
      swipe →
    </p>
  )
}

function AuthorCard() {
  return (
    <div className="flex flex-col gap-[4px]">
      <p className="text-[52px] leading-[1.15] font-extrabold tracking-[-0.02em]">
        <Mark>{AUTHOR.name}</Mark>
      </p>
      <p className="font-(family-name:--cx-font-hand) text-[46px] leading-[1.15] font-semibold text-(--cx-pen)">
        {AUTHOR.handle}
      </p>
    </div>
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
    <div className={cn('relative', className)}>
      <div className="relative isolate size-full overflow-hidden border-[3px] border-(--cx-fg)">
        <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.15]" />
        <div className="absolute inset-0 bg-(--cx-highlight) mix-blend-multiply" />
      </div>
      <span className="absolute -top-[22px] left-1/2 h-[44px] w-[180px] -translate-x-1/2 rotate-[-3deg] bg-(--cx-highlight) opacity-80" />
    </div>
  )
}

function IconCard({
  icon: Icon,
  children,
  ...slide
}: { icon: LucideIcon; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[44px] py-[16px]">
      <span className="flex size-[136px] shrink-0 -rotate-3 items-center justify-center rounded-full border-[4px] border-(--cx-pen)">
        <Icon className="size-[80px] text-(--cx-pen)" strokeWidth={2} />
      </span>
      <p className="text-[44px] leading-[1.25] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function Quote({ children, by, ...slide }: { children: ReactNode; by: string } & SlideProps) {
  return (
    <figure className="flex flex-col gap-[32px]">
      <span className="font-(family-name:--cx-font-hand) text-[200px] leading-[0.5] font-semibold text-(--cx-pen)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[64px] leading-[1.18] font-extrabold tracking-[-0.03em]"
        {...slide}
      >
        {children}
      </blockquote>
      <figcaption className="-rotate-1 self-start font-(family-name:--cx-font-hand) text-[50px] leading-[1.1] font-semibold text-(--cx-pen)">
        — {by}
      </figcaption>
    </figure>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[28px]">
      <p className="self-start font-(family-name:--cx-font-display) text-[260px] leading-[1.0] font-extrabold tracking-[-0.05em]">
        <Mark>{value}</Mark>
      </p>
      <p className="text-[44px] leading-[1.3] font-semibold">{label}</p>
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div className="flex flex-col gap-[40px]">
      <p className="flex items-center gap-[10px] font-(family-name:--cx-font-hand) text-[52px] leading-[1.1] font-semibold text-(--cx-pen)">
        <Icon className="size-[40px]" strokeWidth={3} />
        {kind === 'do' ? 'do this' : 'not this'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[42px] leading-[1.35] font-semibold',
            kind === 'dont' &&
              'text-(--cx-muted) line-through decoration-(--cx-pen) decoration-[4px]',
          )}
        >
          {kind === 'do' ? <Mark>{item}</Mark> : item}
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
    <div className={cn('flex items-start gap-[32px]', !last && 'pb-[56px]')}>
      <span className="flex size-[80px] shrink-0 -rotate-6 items-center justify-center rounded-full border-[4px] border-(--cx-pen) font-(family-name:--cx-font-hand) text-[52px] leading-none font-semibold text-(--cx-pen)">
        {n}
      </span>
      <div className="flex flex-col gap-[6px] pt-[6px]">
        <p className="text-[48px] leading-[1.2] font-extrabold tracking-[-0.02em]">{title}</p>
        <p className="text-[40px] leading-[1.45] font-medium" {...slide}>
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
        <Eyebrow>notes to self</Eyebrow>
        <Hero>
          The stuff I <Mark>wish</Mark> I knew
        </Hero>
        <Body>
          Notebook lines, marker highlights and handwritten asides. Built for lessons and tips.
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
        <Photo
          src={coverPhoto}
          alt="A notebook and pen on a grey desk"
          className="mx-[12px] h-[560px] rotate-[-1.5deg]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>study notes</Eyebrow>
          <Hero>
            Learn it <Mark>once</Mark>
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
        <div className="flex flex-col gap-[24px]">
          <Eyebrow>the checklist</Eyebrow>
          <Title>
            Before you <Mark>hit post</Mark>
          </Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <CheckItem>The hook fits in one line.</CheckItem>
          <CheckItem>Every slide makes one point.</CheckItem>
          <CheckItem>The last slide asks for one thing.</CheckItem>
        </div>
        <Note>↑ the hook matters most</Note>
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
          alt="A team brainstorming with sticky notes on a glass wall"
          className="mx-[12px] h-[520px] rotate-[1deg]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>team notes</Eyebrow>
          <Title>
            Think out <Mark>loud</Mark>
          </Title>
          <Body>Ideas get better the moment someone else can see them.</Body>
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
          <Eyebrow>my toolkit</Eyebrow>
          <Title>
            What actually <Mark>helps</Mark>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={NotebookPen}>Write it by hand</IconCard>
          <IconCard icon={Clock}>25-minute blocks</IconCard>
          <IconCard icon={Brain}>Explain it simply</IconCard>
          <IconCard icon={Target}>One goal a day</IconCard>
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
        <Eyebrow>remember this</Eyebrow>
        <BigStat value="3" label="reviews spaced over a week beat one long cram." />
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
          <Eyebrow>old me vs new me</Eyebrow>
          <Title>
            How I <Mark>study</Mark> now
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Rereading notes', 'Highlighting pages', 'All-nighters']}
          />
          <CompareColumn kind="do" items={['Quiz yourself', 'Teach a friend', 'Sleep on it']} />
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
          <Eyebrow>the method</Eyebrow>
          <Title>
            Remember <Mark>anything</Mark>
          </Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Learn">
            Read it once, slowly.
          </Step>
          <Step n="2" title="Recall">
            Close the book and write it down.
          </Step>
          <Step n="3" title="Review" last>
            Check again in two days.
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
        <Eyebrow>one more thing</Eyebrow>
        <Title>
          <Mark>Save this</Mark> for later
        </Title>
        <Body>Follow for a new set of notes every week, and repost to help someone else.</Body>
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

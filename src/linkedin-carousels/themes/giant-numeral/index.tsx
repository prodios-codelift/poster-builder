// Theme demo: giant-numeral — keep components in lockstep with theme.md
import { cn } from 'cn'
import {
  ArrowRight,
  Check,
  Hash,
  type LucideIcon,
  Quote as QuoteIcon,
  Scissors,
  Target,
  X,
} from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#111111',
  '--cx-accent': '#D92D20',
  '--cx-muted': '#5C5C5C',
  '--cx-on-accent': '#FFFFFF',
  '--cx-tint': '#F6F6F4',
  '--cx-rule': 'rgba(17, 17, 17, 0.12)',
  '--cx-font-display': "'Inter Tight', system-ui, sans-serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  'signal-red': {
    name: 'Signal Red',
    tokens: {
      '--cx-bg': '#FFFFFF',
      '--cx-fg': '#111111',
      '--cx-accent': '#D92D20',
      '--cx-muted': '#5C5C5C',
      '--cx-on-accent': '#FFFFFF',
      '--cx-tint': '#F6F6F4',
      '--cx-rule': 'rgba(17, 17, 17, 0.12)',
    } as CSSProperties,
  },
  cobalt: {
    name: 'Cobalt',
    tokens: {
      '--cx-bg': '#FFFFFF',
      '--cx-fg': '#0E1430',
      '--cx-accent': '#2340D9',
      '--cx-muted': '#596075',
      '--cx-on-accent': '#FFFFFF',
      '--cx-tint': '#F3F5FB',
      '--cx-rule': 'rgba(14, 20, 48, 0.12)',
    } as CSSProperties,
  },
  tangerine: {
    name: 'Tangerine',
    tokens: {
      '--cx-bg': '#FFFCF8',
      '--cx-fg': '#1F1308',
      '--cx-accent': '#C2410C',
      '--cx-muted': '#66594F',
      '--cx-on-accent': '#FFFFFF',
      '--cx-tint': '#FBF3EA',
      '--cx-rule': 'rgba(31, 19, 8, 0.12)',
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

function Numeral({ value, className }: { value: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute -left-[150px] font-(family-name:--cx-font-display) text-[720px] leading-[0.8] font-extrabold tracking-[-0.06em] text-(--cx-accent) select-none',
        className,
      )}
    >
      {value}
    </span>
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

function Hero({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h1
      className="font-(family-name:--cx-font-display) text-[112px] leading-[1.0] font-extrabold tracking-[-0.035em]"
      {...slide}
    >
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[84px] leading-[1.05] font-extrabold tracking-[-0.03em]"
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
    <div className="flex items-center gap-[36px] border-t border-(--cx-rule) pt-[28px]">
      <span className="w-[96px] shrink-0 font-(family-name:--cx-font-display) text-[112px] leading-[0.85] font-extrabold tracking-[-0.05em] text-(--cx-accent)">
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
    <p className="flex items-center gap-[16px] text-[30px] leading-[1.3] font-extrabold">
      Swipe
      <ArrowRight className="size-[40px] text-(--cx-accent)" strokeWidth={3} />
    </p>
  )
}

function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
  return (
    <div className="flex items-center gap-[28px] self-start rounded-full bg-(--cx-tint) py-[20px] pr-[48px] pl-[20px]">
      <span className="flex size-[112px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) font-(family-name:--cx-font-display) text-[44px] leading-none font-extrabold text-(--cx-on-accent)">
        {initials}
      </span>
      <div className="flex flex-col gap-[4px]">
        <p className="font-(family-name:--cx-font-display) text-[48px] leading-[1.1] font-extrabold">
          {AUTHOR.name}
        </p>
        <p className="text-[30px] leading-[1.3] font-semibold text-(--cx-muted)">{AUTHOR.handle}</p>
      </div>
    </div>
  )
}

function Footer({ page, total }: { page: number; total: number }) {
  return (
    <div className="mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-bold text-(--cx-muted)">
      <span>{AUTHOR.handle}</span>
      <span className="tabular-nums">
        <span className="text-(--cx-accent)">{page}</span>/{total}
      </span>
    </div>
  )
}

function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.25]" />
      <div className="absolute inset-0 bg-(--cx-accent) mix-blend-screen" />
    </div>
  )
}

function IconCard({
  icon: Icon,
  children,
  ...slide
}: { icon: LucideIcon; children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[32px] rounded-[20px] bg-(--cx-tint) p-[40px]">
      <Icon className="size-[72px] text-(--cx-accent)" strokeWidth={2.25} />
      <p className="text-[40px] leading-[1.3] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function Quote({ children, by, ...slide }: { children: ReactNode; by: string } & SlideProps) {
  return (
    <figure className="flex flex-col gap-[40px]">
      <span className="font-(family-name:--cx-font-display) text-[240px] leading-[0.6] font-extrabold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[72px] leading-[1.12] font-extrabold tracking-[-0.025em]"
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
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] font-extrabold tracking-[-0.05em] text-(--cx-accent) tabular-nums">
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
        'flex flex-col gap-[36px] border-t-[6px] pt-[28px]',
        kind === 'do' ? 'border-(--cx-accent)' : 'border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] text-[28px] leading-[1.2] font-extrabold tracking-[0.14em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[32px]" strokeWidth={3} />
        {kind === 'do' ? 'Write' : 'Skip'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[40px] leading-[1.3] font-bold',
            kind === 'dont' && 'text-(--cx-muted) line-through',
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
    <div
      className={cn('flex gap-[36px] border-t border-(--cx-rule) pt-[24px]', !last && 'pb-[40px]')}
    >
      <span className="w-[96px] shrink-0 font-(family-name:--cx-font-display) text-[120px] leading-[0.85] font-extrabold tracking-[-0.05em] text-(--cx-accent)">
        {n}
      </span>
      <div className="flex flex-col gap-[8px]">
        <p className="font-(family-name:--cx-font-display) text-[52px] leading-[1.1] font-extrabold tracking-[-0.02em]">
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
      <Numeral value="3" className="top-[230px]" />
      <div className="flex flex-1 flex-col justify-center gap-[48px] pl-[300px]">
        <Eyebrow>Writing tips</Eyebrow>
        <Hero>Secrets of a sharper headline</Hero>
        <Body>One huge number does the hook.</Body>
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
        <Photo src={coverPhoto} alt="Keys of an old typewriter" className="h-[600px] w-full" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The craft</Eyebrow>
          <Hero>Write fewer, better words</Hero>
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
          <Eyebrow>The rules</Eyebrow>
          <Title>Three tests for any headline</Title>
        </div>
        <div className="flex flex-col gap-[36px]">
          <Point n="1">Would you click it yourself?</Point>
          <Point n="2">Does it promise one thing?</Point>
          <Point n="3">Can you cut two more words?</Point>
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
          alt="A hand drawing a line with a pencil"
          className="h-[520px] w-full"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Drafting</Eyebrow>
          <Title>Write ten, keep one</Title>
          <Body>The best headline is rarely the first.</Body>
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
          <Title>Four headline formulas</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Hash}>Lead with a number</IconCard>
          <IconCard icon={Target}>Name the reader</IconCard>
          <IconCard icon={QuoteIcon}>Quote a pain</IconCard>
          <IconCard icon={Scissors}>Cut every adverb</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame className="bg-[radial-gradient(circle_at_0%_50%,color-mix(in_oklab,var(--cx-accent)_10%,transparent),transparent_55%)]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your sharpest line goes here, in your own words.</Quote>
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
        <BigStat value="8" label="words or fewer is a good length for a hook." />
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
          <Eyebrow>Edit</Eyebrow>
          <Title>Clear beats clever</Title>
        </div>
        <div className="grid grid-cols-2 gap-[40px]">
          <CompareColumn kind="dont" items={['Puns', 'Vague teasers', 'Long intros']} />
          <CompareColumn kind="do" items={['Plain promises', 'Exact numbers', 'The point first']} />
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
          <Title>Headline in three passes</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Dump">
            Write ten versions without judging.
          </Step>
          <Step n="2" title="Pick">
            Circle the one you would click.
          </Step>
          <Step n="3" title="Trim" last>
            Cut it until every word works.
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

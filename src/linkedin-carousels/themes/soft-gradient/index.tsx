// Theme demo: soft-gradient — keep components in lockstep with theme.md
import { cn } from 'cn'
import { ArrowRight, Check, Eye, Heart, type LucideIcon, Palette, Type, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#FAFAF7',
  '--cx-fg': '#16181D',
  '--cx-accent': '#3F6212',
  '--cx-muted': '#5B5F66',
  '--cx-blob-1': '#D9F99D',
  '--cx-blob-2': '#FDE68A',
  '--cx-rule': 'rgba(22, 24, 29, 0.12)',
  '--cx-surface': 'rgba(255, 255, 255, 0.72)',
  '--cx-font-display': "'Inter Tight', system-ui, sans-serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  'lime-mist': {
    name: 'Lime Mist',
    tokens: {
      '--cx-bg': '#FAFAF7',
      '--cx-fg': '#16181D',
      '--cx-accent': '#3F6212',
      '--cx-muted': '#5B5F66',
      '--cx-blob-1': '#D9F99D',
      '--cx-blob-2': '#FDE68A',
      '--cx-rule': 'rgba(22, 24, 29, 0.12)',
      '--cx-surface': 'rgba(255, 255, 255, 0.72)',
    } as CSSProperties,
  },
  'peach-glow': {
    name: 'Peach Glow',
    tokens: {
      '--cx-bg': '#FBF9F7',
      '--cx-fg': '#1C1917',
      '--cx-accent': '#B4410C',
      '--cx-muted': '#5F5853',
      '--cx-blob-1': '#FED7AA',
      '--cx-blob-2': '#FBCFE8',
      '--cx-rule': 'rgba(28, 25, 23, 0.12)',
      '--cx-surface': 'rgba(255, 255, 255, 0.72)',
    } as CSSProperties,
  },
  'lilac-haze': {
    name: 'Lilac Haze',
    tokens: {
      '--cx-bg': '#FAFAFC',
      '--cx-fg': '#17171F',
      '--cx-accent': '#6D28D9',
      '--cx-muted': '#5D5D6B',
      '--cx-blob-1': '#DDD6FE',
      '--cx-blob-2': '#BAE6FD',
      '--cx-rule': 'rgba(23, 23, 31, 0.12)',
      '--cx-surface': 'rgba(255, 255, 255, 0.72)',
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_88%,var(--cx-blob-1),transparent_46%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_100%,var(--cx-blob-2),transparent_38%)]" />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </LinkedInCarouselSlide>
  )
}

function MetaBar({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex items-center justify-between border-b border-(--cx-rule) pb-[24px] text-[26px] leading-[1.2] font-bold tracking-[0.1em] text-(--cx-muted) uppercase">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  )
}

function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="self-start rounded-full border-[2px] border-(--cx-accent) px-[22px] py-[8px] text-[26px] leading-[1.2] font-bold tracking-[0.12em] text-(--cx-accent) uppercase"
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
      className="font-(family-name:--cx-font-display) text-[80px] leading-[1.05] font-extrabold tracking-[-0.015em] uppercase"
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
    <div className="flex items-center gap-[28px] rounded-[24px] border border-(--cx-rule) bg-(--cx-surface) px-[36px] py-[32px]">
      <span className="w-[56px] shrink-0 font-(family-name:--cx-font-display) text-[52px] leading-none font-extrabold text-(--cx-accent)">
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
    <div className="flex items-center gap-[20px]">
      <p className="text-[28px] leading-[1.2] font-bold tracking-[0.12em] uppercase">
        Swipe for more
      </p>
      <span className="flex size-[60px] items-center justify-center rounded-full bg-(--cx-fg) text-(--cx-bg)">
        <ArrowRight className="size-[30px]" strokeWidth={2.5} />
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
    <div className="flex items-center gap-[28px] self-start rounded-[28px] border border-(--cx-rule) bg-(--cx-surface) py-[28px] pr-[56px] pl-[28px]">
      <span className="flex size-[112px] shrink-0 items-center justify-center rounded-full bg-(--cx-fg) font-(family-name:--cx-font-display) text-[44px] leading-none font-extrabold text-(--cx-bg)">
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
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.1]" />
      <div className="absolute inset-0 bg-linear-to-br from-(--cx-blob-1) to-(--cx-blob-2) mix-blend-multiply" />
    </div>
  )
}

function IconCard({
  icon: Icon,
  children,
  ...slide
}: { icon: LucideIcon; children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[32px] rounded-[28px] border border-(--cx-rule) bg-(--cx-surface) p-[40px]">
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
      <span className="font-(family-name:--cx-font-display) text-[200px] leading-[0.6] font-extrabold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[72px] leading-[1.1] font-extrabold tracking-[-0.015em] uppercase"
        {...slide}
      >
        {children}
      </blockquote>
      <figcaption className="text-[28px] leading-[1.2] font-bold tracking-[0.1em] text-(--cx-muted) uppercase">
        {by}
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
    <div
      className={cn(
        'flex flex-col gap-[36px] rounded-[28px] p-[40px]',
        kind === 'do'
          ? 'border border-(--cx-rule) bg-(--cx-surface)'
          : 'border-[2px] border-dashed border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] text-[26px] leading-[1.2] font-bold tracking-[0.12em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[30px]" strokeWidth={2.75} />
        {kind === 'do' ? 'Keep' : 'Drop'}
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
        <span className="flex size-[80px] shrink-0 items-center justify-center rounded-full bg-(--cx-fg) font-(family-name:--cx-font-display) text-[40px] leading-none font-extrabold text-(--cx-bg)">
          {n}
        </span>
        {!last && <span className="w-[2px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[8px]', !last && 'pb-[56px]')}>
        <p className="font-(family-name:--cx-font-display) text-[52px] leading-[1.1] font-extrabold uppercase">
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
      <MetaBar left="Brand basics" right="Part 1" />
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Brand dictionary</Eyebrow>
        <Hero>Three parts of a lasting brand</Hero>
        <Body>Soft colour glows, heavy caps and glassy cards. Built for friendly explainers.</Body>
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
          alt="A minimal desk with a laptop"
          className="h-[600px] w-full rounded-[32px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Workspace</Eyebrow>
          <Hero>Design with less</Hero>
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
          <Title>What every brand needs</Title>
        </div>
        <div className="flex flex-col gap-[24px]">
          <Point n="1">A promise you can say in one line.</Point>
          <Point n="2">A look people spot from afar.</Point>
          <Point n="3">A voice that sounds like you.</Point>
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
          alt="An open notebook and a pen next to a plant"
          className="h-[520px] w-full rounded-[32px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>On paper</Eyebrow>
          <Title>Sketch it first</Title>
          <Body>Ten rough sketches beat one polished guess.</Body>
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
          <Eyebrow>The kit</Eyebrow>
          <Title>Four pieces to define</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Palette}>Two core colours</IconCard>
          <IconCard icon={Type}>One typeface</IconCard>
          <IconCard icon={Eye}>A simple mark</IconCard>
          <IconCard icon={Heart}>Three values</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame className="bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--cx-blob-2)_70%,transparent),transparent_45%)]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your brightest line goes here, short and sure.</Quote>
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
        <BigStat value="2" label="core colours are enough for most personal brands." />
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
          <Eyebrow>Edit ruthlessly</Eyebrow>
          <Title>Keep it simple</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['Five fonts', 'A new look weekly', 'Trendy jargon']} />
          <CompareColumn kind="do" items={['One typeface', 'One look, always', 'Plain words']} />
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
          <Title>Brand in an afternoon</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Promise">
            Finish the sentence “I help…”.
          </Step>
          <Step n="2" title="Look">
            Pick two colours and one typeface.
          </Step>
          <Step n="3" title="Voice" last>
            Write three words for how you sound.
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
      <MetaBar left="Brand basics" right="The end" />
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

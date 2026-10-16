// Theme demo: torn-paper — keep components in lockstep with theme.md
import { cn } from 'cn'
import {
  ArrowRight,
  Check,
  Megaphone,
  PenTool,
  Scissors,
  Share2,
  type LucideIcon,
  X,
} from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#141414',
  '--cx-fg': '#F4F1EA',
  '--cx-accent': '#CC2A1F',
  '--cx-muted': '#A8A49C',
  '--cx-on-accent': '#FFFFFF',
  '--cx-paper': '#EDE8DD',
  '--cx-ink': '#141414',
  '--cx-paper-muted': '#5E5A52',
  '--cx-mark': '#CC2A1F',
  '--cx-rule': 'rgba(244, 241, 234, 0.12)',
  '--cx-font-display': "'Inter Tight', system-ui, sans-serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  'ink-red': {
    name: 'Ink & Red',
    tokens: {
      '--cx-bg': '#141414',
      '--cx-fg': '#F4F1EA',
      '--cx-accent': '#CC2A1F',
      '--cx-muted': '#A8A49C',
      '--cx-on-accent': '#FFFFFF',
      '--cx-paper': '#EDE8DD',
      '--cx-ink': '#141414',
      '--cx-paper-muted': '#5E5A52',
      '--cx-mark': '#CC2A1F',
      '--cx-rule': 'rgba(244, 241, 234, 0.12)',
    } as CSSProperties,
  },
  'charcoal-orange': {
    name: 'Charcoal & Orange',
    tokens: {
      '--cx-bg': '#1C1B1A',
      '--cx-fg': '#F5F0E8',
      '--cx-accent': '#C2410C',
      '--cx-muted': '#ABA59B',
      '--cx-on-accent': '#FFFFFF',
      '--cx-paper': '#EFE9DC',
      '--cx-ink': '#1C1B1A',
      '--cx-paper-muted': '#5F5A50',
      '--cx-mark': '#C2410C',
      '--cx-rule': 'rgba(245, 240, 232, 0.12)',
    } as CSSProperties,
  },
  'navy-lime': {
    name: 'Navy & Lime',
    tokens: {
      '--cx-bg': '#0F1A2E',
      '--cx-fg': '#F1F4F8',
      '--cx-accent': '#C6F432',
      '--cx-muted': '#A2ADC0',
      '--cx-on-accent': '#0F1A2E',
      '--cx-paper': '#EEF0E6',
      '--cx-ink': '#0F1A2E',
      '--cx-paper-muted': '#56606E',
      '--cx-mark': '#4D7C0F',
      '--cx-rule': 'rgba(241, 244, 248, 0.12)',
    } as CSSProperties,
  },
} satisfies Record<string, { name: string; tokens: CSSProperties }>

const AUTHOR = { name: 'Your Name', handle: '@yourhandle' }

const TORN_EDGE =
  'polygon(0% 3%, 6% 0.5%, 13% 2.5%, 21% 0%, 30% 2%, 38% 0.5%, 47% 3%, 55% 0.5%, 64% 2.5%, 72% 0%, 81% 2%, 89% 0.5%, 100% 2.5%, 99.5% 30%, 100% 62%, 99% 97%, 92% 100%, 84% 97.5%, 75% 99.5%, 66% 97%, 58% 100%, 49% 97.5%, 40% 99.5%, 31% 97%, 22% 100%, 14% 97.5%, 6% 99.5%, 0% 97%, 0.5% 64%, 0% 33%)'

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

function Scrap({
  children,
  tilt = 'left',
  className,
}: {
  children: ReactNode
  tilt?: 'left' | 'right' | 'none'
  className?: string
}) {
  return (
    <div
      className={cn(
        'bg-(--cx-paper) px-[48px] py-[48px] text-(--cx-ink)',
        tilt === 'left' && '-rotate-[1.2deg]',
        tilt === 'right' && 'rotate-[1deg]',
        className,
      )}
      style={{ clipPath: TORN_EDGE }}
    >
      {children}
    </div>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="-rotate-[2deg] self-start bg-(--cx-accent) px-[20px] py-[10px] text-[28px] leading-[1.2] font-extrabold tracking-[0.12em] text-(--cx-on-accent) uppercase">
      {children}
    </p>
  )
}

function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[128px] leading-[1.0] font-extrabold tracking-[-0.03em]">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[88px] leading-[1.05] font-extrabold tracking-[-0.025em]">
      {children}
    </h2>
  )
}

function Body({ children }: { children: ReactNode }) {
  return <p className="text-[40px] leading-[1.45] font-medium text-(--cx-muted)">{children}</p>
}

function Strip({
  n,
  children,
  tilt = 'left',
}: {
  n: string
  children: ReactNode
  tilt?: 'left' | 'right'
}) {
  return (
    <Scrap tilt={tilt} className="flex items-baseline gap-[28px] py-[36px]">
      <span className="w-[56px] shrink-0 font-(family-name:--cx-font-display) text-[56px] leading-none font-extrabold text-(--cx-mark)">
        {n}
      </span>
      <p className="text-[40px] leading-[1.3] font-bold">{children}</p>
    </Scrap>
  )
}

function SwipeCue() {
  return (
    <p className="flex items-center gap-[16px] text-[30px] leading-[1.3] font-extrabold tracking-[0.12em] uppercase">
      Swipe
      <ArrowRight className="size-[40px] text-(--cx-accent)" strokeWidth={3} />
    </p>
  )
}

function AuthorCard() {
  return (
    <Scrap tilt="right" className="flex flex-col gap-[8px] self-start pr-[96px]">
      <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.1] font-extrabold tracking-[-0.02em]">
        {AUTHOR.name}
      </p>
      <p className="text-[32px] leading-[1.3] font-bold text-(--cx-paper-muted)">{AUTHOR.handle}</p>
    </Scrap>
  )
}

function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-bold text-(--cx-muted)">
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
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.3]" />
      <div className="absolute inset-0 bg-(--cx-paper) mix-blend-multiply" />
    </div>
  )
}

function PhotoBackdrop({ src }: { src: string }) {
  return (
    <div className="absolute inset-0 -z-10">
      <Photo src={src} alt="" className="size-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--cx-bg)_36%,color-mix(in_oklab,var(--cx-bg)_65%,transparent)_60%,color-mix(in_oklab,var(--cx-bg)_25%,transparent)_100%)]" />
    </div>
  )
}

function IconCard({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <Scrap tilt="none" className="flex flex-col gap-[32px] px-[40px] py-[44px]">
      <Icon className="size-[72px] text-(--cx-mark)" strokeWidth={2.25} />
      <p className="text-[40px] leading-[1.3] font-bold">{children}</p>
    </Scrap>
  )
}

function Quote({ children, by }: { children: ReactNode; by: string }) {
  return (
    <Scrap className="flex flex-col gap-[36px] px-[64px] py-[80px]">
      <span className="font-(family-name:--cx-font-display) text-[180px] leading-[0.6] font-extrabold text-(--cx-mark)">
        “
      </span>
      <blockquote className="font-(family-name:--cx-font-display) text-[68px] leading-[1.12] font-extrabold tracking-[-0.02em]">
        {children}
      </blockquote>
      <p className="text-[30px] leading-[1.3] font-bold text-(--cx-paper-muted)">— {by}</p>
    </Scrap>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[32px]">
      <p className="self-start border-b-[16px] border-(--cx-accent) font-(family-name:--cx-font-display) text-[240px] leading-[0.95] font-extrabold tracking-[-0.04em] tabular-nums">
        {value}
      </p>
      <p className="text-[44px] leading-[1.3] font-bold">{label}</p>
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  const content = (
    <>
      <p
        className={cn(
          'flex items-center gap-[12px] text-[28px] leading-[1.2] font-extrabold tracking-[0.12em] uppercase',
          kind === 'do' ? 'text-(--cx-mark)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[34px]" strokeWidth={3} />
        {kind === 'do' ? 'Do this' : 'Skip this'}
      </p>
      {items.map((item) => (
        <p key={item} className="text-[38px] leading-[1.35] font-bold">
          {item}
        </p>
      ))}
    </>
  )
  return kind === 'do' ? (
    <Scrap tilt="right" className="flex flex-col gap-[36px] px-[40px]">
      {content}
    </Scrap>
  ) : (
    <div className="flex flex-col gap-[36px] border-[3px] border-dashed border-(--cx-rule) p-[40px] text-(--cx-muted)">
      {content}
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
        <span className="flex size-[80px] shrink-0 -rotate-[3deg] items-center justify-center bg-(--cx-accent) font-(family-name:--cx-font-display) text-[44px] leading-none font-extrabold text-(--cx-on-accent)">
          {n}
        </span>
        {!last && <span className="w-0 flex-1 border-l-[3px] border-dashed border-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[8px]', !last && 'pb-[56px]')}>
        <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.1] font-extrabold tracking-[-0.02em]">
          {title}
        </p>
        <p className="text-[40px] leading-[1.4] font-medium text-(--cx-muted)">{children}</p>
      </div>
    </div>
  )
}

function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Scrap>
          <Hero>Five tips that cost nothing</Hero>
        </Scrap>
        <Eyebrow>Zero budget</Eyebrow>
        <Body>Torn paper, heavy type and one red stamp. Built for scrappy, practical posts.</Body>
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
        <Eyebrow>Street smarts</Eyebrow>
        <Hero>Make noise on no budget</Hero>
        <SwipeCue />
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
          <Title>Three free ways to get seen</Title>
        </div>
        <div className="flex flex-col gap-[28px]">
          <Strip n="1">Reply to ten posts a day.</Strip>
          <Strip n="2" tilt="right">
            Turn one win into a short story.
          </Strip>
          <Strip n="3">Ask happy clients to tag you.</Strip>
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
        <Scrap className="p-[20px]">
          <Photo src={splitPhoto} alt="A sheet of crumpled paper" className="h-[500px] w-full" />
        </Scrap>
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>First drafts</Eyebrow>
          <Title>Ship it rough</Title>
          <Body>A rough post today beats a perfect one never.</Body>
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
          <Title>Four free tools you already have</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={PenTool}>Your own words</IconCard>
          <IconCard icon={Scissors}>Cut the fluff</IconCard>
          <IconCard icon={Megaphone}>Your network</IconCard>
          <IconCard icon={Share2}>Reposts</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame className="bg-[repeating-linear-gradient(135deg,transparent_0_22px,var(--cx-rule)_22px_25px)]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your sharpest line goes here, ripped straight from the post.</Quote>
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
        <BigStat value="$0" label="is a fine budget for your first hundred followers." />
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
          <Eyebrow>Spend time, not money</Eyebrow>
          <Title>Where the effort goes</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['Paid boosts', 'Fancy tools', 'Daily logos']} />
          <CompareColumn kind="do" items={['Real replies', 'Plain stories', 'One clear offer']} />
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
          <Title>A post in thirty minutes</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Collect">
            Note one question a client asked.
          </Step>
          <Step n="2" title="Answer">
            Write the reply you gave them.
          </Step>
          <Step n="3" title="Post" last>
            Publish it before you edit it twice.
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

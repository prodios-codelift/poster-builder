// Theme demo: aurora-glow — keep components in lockstep with theme.md
import { cn } from 'cn'
import { Check, Layers, type LucideIcon, Rocket, Sparkles, X, Zap } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#0B0B14',
  '--cx-fg': '#F4F4FA',
  '--cx-accent': '#A78BFA',
  '--cx-muted': '#A3A3B8',
  '--cx-rule': 'rgba(244, 244, 250, 0.14)',
  '--cx-surface': 'rgba(244, 244, 250, 0.06)',
  '--cx-glow-1': '#7C3AED',
  '--cx-glow-2': '#22D3EE',
  '--cx-font-display': "'Geist Variable', system-ui, sans-serif",
  '--cx-font-body': "'Geist Variable', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  'violet-haze': {
    name: 'Violet Haze',
    tokens: {
      '--cx-bg': '#0B0B14',
      '--cx-fg': '#F4F4FA',
      '--cx-accent': '#A78BFA',
      '--cx-muted': '#A3A3B8',
      '--cx-rule': 'rgba(244, 244, 250, 0.14)',
      '--cx-surface': 'rgba(244, 244, 250, 0.06)',
      '--cx-glow-1': '#7C3AED',
      '--cx-glow-2': '#22D3EE',
    } as CSSProperties,
  },
  ember: {
    name: 'Ember',
    tokens: {
      '--cx-bg': '#120A08',
      '--cx-fg': '#FBF3EE',
      '--cx-accent': '#FB923C',
      '--cx-muted': '#B9A49A',
      '--cx-rule': 'rgba(251, 243, 238, 0.14)',
      '--cx-surface': 'rgba(251, 243, 238, 0.06)',
      '--cx-glow-1': '#F43F5E',
      '--cx-glow-2': '#F59E0B',
    } as CSSProperties,
  },
  'emerald-night': {
    name: 'Emerald Night',
    tokens: {
      '--cx-bg': '#06110E',
      '--cx-fg': '#ECFDF5',
      '--cx-accent': '#34D399',
      '--cx-muted': '#94B3A7',
      '--cx-rule': 'rgba(236, 253, 245, 0.14)',
      '--cx-surface': 'rgba(236, 253, 245, 0.06)',
      '--cx-glow-1': '#10B981',
      '--cx-glow-2': '#3B82F6',
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_6%,color-mix(in_oklab,var(--cx-glow-1)_55%,transparent),transparent_48%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_96%,color-mix(in_oklab,var(--cx-glow-2)_35%,transparent),transparent_45%)]" />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </LinkedInCarouselSlide>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-[14px] self-start rounded-full border border-(--cx-rule) bg-(--cx-surface) px-[24px] py-[10px] text-[26px] leading-[1.2] font-semibold tracking-[0.02em]">
      <span className="size-[12px] rounded-full bg-(--cx-accent)" />
      {children}
    </p>
  )
}

function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[124px] leading-[1.02] font-bold tracking-[-0.05em]">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[84px] leading-[1.06] font-bold tracking-[-0.04em]">
      {children}
    </h2>
  )
}

function Body({ children }: { children: ReactNode }) {
  return <p className="text-[40px] leading-[1.5] font-medium">{children}</p>
}

function FeatureCard({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-[32px] rounded-[28px] border border-(--cx-rule) bg-(--cx-surface) px-[36px] py-[30px]">
      <span className="flex size-[72px] shrink-0 items-center justify-center rounded-[18px] bg-(--cx-accent) text-[32px] leading-none font-bold text-(--cx-bg)">
        {n}
      </span>
      <p className="text-[38px] leading-[1.3] font-semibold">{children}</p>
    </div>
  )
}

function SwipeCue() {
  return (
    <p className="self-start rounded-full bg-(--cx-fg) px-[32px] py-[14px] text-[28px] leading-[1.2] font-bold text-(--cx-bg)">
      Swipe →
    </p>
  )
}

function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
  return (
    <div className="flex items-center gap-[32px] rounded-[32px] border border-(--cx-rule) bg-(--cx-surface) p-[36px]">
      <div className="flex size-[112px] shrink-0 items-center justify-center rounded-full bg-linear-to-br from-(--cx-glow-1) to-(--cx-glow-2) text-[42px] leading-none font-bold">
        {initials}
      </div>
      <div className="flex flex-col gap-[6px]">
        <p className="text-[46px] leading-[1.1] font-bold tracking-[-0.02em]">{AUTHOR.name}</p>
        <p className="text-[30px] leading-[1.3] font-medium text-(--cx-muted)">{AUTHOR.handle}</p>
      </div>
    </div>
  )
}

function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between pt-[28px] text-[26px] leading-[1.3] font-medium text-(--cx-muted)">
      <span>
        {AUTHOR.name} · {AUTHOR.handle}
      </span>
      <span className="rounded-full border border-(--cx-rule) px-[18px] py-[6px] tabular-nums">
        {pad(page)} / {pad(total)}
      </span>
    </div>
  )
}

function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.15]" />
      <div className="absolute inset-0 bg-linear-to-br from-(--cx-glow-1) to-(--cx-glow-2) mix-blend-color" />
    </div>
  )
}

function PhotoBackdrop({ src }: { src: string }) {
  return (
    <div className="absolute -inset-x-[96px] -top-[112px] -bottom-[72px] -z-10">
      <Photo src={src} alt="" className="size-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--cx-bg)_30%,color-mix(in_oklab,var(--cx-bg)_55%,transparent)_58%,transparent_85%)]" />
    </div>
  )
}

function IconCard({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[44px] rounded-[28px] border border-(--cx-rule) bg-(--cx-surface) p-[44px]">
      <span className="flex size-[112px] items-center justify-center rounded-[20px] bg-(--cx-accent)">
        <Icon className="size-[60px] text-(--cx-bg)" strokeWidth={2} />
      </span>
      <p className="text-[44px] leading-[1.25] font-semibold">{children}</p>
    </div>
  )
}

function Quote({ children, by }: { children: ReactNode; by: string }) {
  return (
    <figure className="flex flex-col gap-[36px] rounded-[32px] border border-(--cx-rule) bg-(--cx-surface) p-[56px]">
      <span className="text-[140px] leading-[0.6] font-bold text-(--cx-accent)">“</span>
      <blockquote className="font-(family-name:--cx-font-display) text-[60px] leading-[1.2] font-bold tracking-[-0.035em]">
        {children}
      </blockquote>
      <figcaption className="flex items-center gap-[14px] text-[30px] leading-[1.3] font-medium text-(--cx-muted)">
        <span className="size-[14px] rounded-full bg-(--cx-accent)" />
        {by}
      </figcaption>
    </figure>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[28px]">
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] font-bold tracking-[-0.06em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[42px] leading-[1.3] font-semibold">{label}</p>
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div
      className={cn(
        'flex flex-col gap-[40px] rounded-[28px] border bg-(--cx-surface) p-[40px]',
        kind === 'do' ? 'border-(--cx-accent)' : 'border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[10px] text-[26px] leading-[1.2] font-semibold',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[30px]" strokeWidth={2.5} />
        {kind === 'do' ? 'Now' : 'Before'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[42px] leading-[1.3] font-semibold',
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
}: {
  n: string
  title: string
  children: ReactNode
  last?: boolean
}) {
  return (
    <div className="flex gap-[32px]">
      <div className="flex flex-col items-center">
        <span className="flex size-[72px] shrink-0 items-center justify-center rounded-[20px] bg-linear-to-br from-(--cx-glow-1) to-(--cx-glow-2) text-[30px] leading-none font-bold">
          {n}
        </span>
        {last ? null : <span className="w-[2px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[10px]', !last && 'pb-[56px]')}>
        <p className="text-[48px] leading-[1.2] font-bold tracking-[-0.025em]">{title}</p>
        <p className="text-[40px] leading-[1.4] font-medium">{children}</p>
      </div>
    </div>
  )
}

function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Aurora Glow</Eyebrow>
        <Hero>Launch it like a product</Hero>
        <Body>
          Dark canvas, soft colour glow and glass cards. Built for launches and tech takes.
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
        <Eyebrow>Launch week</Eyebrow>
        <Hero>Something new is coming</Hero>
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
          <Eyebrow>What’s new</Eyebrow>
          <Title>Three things to show in a launch</Title>
        </div>
        <div className="flex flex-col gap-[24px]">
          <FeatureCard n="1">The problem, in one sentence.</FeatureCard>
          <FeatureCard n="2">The moment it clicks for users.</FeatureCard>
          <FeatureCard n="3">The one thing to try today.</FeatureCard>
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
          alt="Light trails streaking through the night"
          className="h-[540px] w-full rounded-[32px] border border-(--cx-rule)"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Under the hood</Eyebrow>
          <Title>Built for speed</Title>
          <Body>Every screen loads before you finish the thought.</Body>
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
          <Eyebrow>Highlights</Eyebrow>
          <Title>What ships today</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Zap}>Instant search</IconCard>
          <IconCard icon={Layers}>Shared workspaces</IconCard>
          <IconCard icon={Sparkles}>Smart suggestions</IconCard>
          <IconCard icon={Rocket}>One-click deploys</IconCard>
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
        <Eyebrow>By design</Eyebrow>
        <BigStat value="1" label="click from idea to shipped." />
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
          <Eyebrow>The upgrade</Eyebrow>
          <Title>What changes for you</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Five tools', 'Manual exports', 'Waiting on builds']}
          />
          <CompareColumn kind="do" items={['One workspace', 'Live sync', 'Instant previews']} />
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
          <Eyebrow>Get started</Eyebrow>
          <Title>Live in three steps</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Sign up">
            Bring your team with one link.
          </Step>
          <Step n="2" title="Connect">
            Import your existing projects.
          </Step>
          <Step n="3" title="Ship" last>
            Publish your first update today.
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
        <Eyebrow>Stay close</Eyebrow>
        <Title>Want the next drop?</Title>
        <Body>Follow for product notes every week, and repost to share it with your builders.</Body>
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

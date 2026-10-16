// Theme demo: midnight-terminal — keep components in lockstep with theme.md
import { cn } from 'cn'
import { Bug, Check, Cpu, GitBranch, type LucideIcon, Terminal, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#0A0E0B',
  '--cx-fg': '#E6EDE7',
  '--cx-accent': '#39FF88',
  '--cx-muted': '#859488',
  '--cx-rule': 'rgba(230, 237, 231, 0.12)',
  '--cx-surface': 'rgba(230, 237, 231, 0.05)',
  '--cx-font-display': "'JetBrains Mono', ui-monospace, monospace",
  '--cx-font-body': "'Geist Variable', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  'phosphor-green': {
    name: 'Phosphor Green',
    tokens: {
      '--cx-bg': '#0A0E0B',
      '--cx-fg': '#E6EDE7',
      '--cx-accent': '#39FF88',
      '--cx-muted': '#859488',
      '--cx-rule': 'rgba(230, 237, 231, 0.12)',
      '--cx-surface': 'rgba(230, 237, 231, 0.05)',
    } as CSSProperties,
  },
  'amber-crt': {
    name: 'Amber CRT',
    tokens: {
      '--cx-bg': '#0F0B06',
      '--cx-fg': '#F2E9DC',
      '--cx-accent': '#FFB000',
      '--cx-muted': '#9A8E7E',
      '--cx-rule': 'rgba(242, 233, 220, 0.12)',
      '--cx-surface': 'rgba(242, 233, 220, 0.05)',
    } as CSSProperties,
  },
  'cyan-grid': {
    name: 'Cyan Grid',
    tokens: {
      '--cx-bg': '#060B12',
      '--cx-fg': '#E3EEF7',
      '--cx-accent': '#22D3EE',
      '--cx-muted': '#8394A5',
      '--cx-rule': 'rgba(227, 238, 247, 0.12)',
      '--cx-surface': 'rgba(227, 238, 247, 0.05)',
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

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-(family-name:--cx-font-display) text-[28px] leading-[1.2] font-bold text-(--cx-accent) lowercase">
      $ {children}
    </p>
  )
}

function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[100px] leading-[1.1] font-bold tracking-[-0.03em]">
      {children}
      <span className="ml-[16px] inline-block h-[0.82em] w-[0.5em] bg-(--cx-accent) align-[-0.08em]" />
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[72px] leading-[1.15] font-bold tracking-[-0.03em]">
      {children}
    </h2>
  )
}

function Body({ children }: { children: ReactNode }) {
  return <p className="text-[40px] leading-[1.5] font-medium">{children}</p>
}

function Point({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-[32px] border-l-[4px] border-(--cx-accent) bg-(--cx-surface) px-[36px] py-[30px]">
      <span className="shrink-0 font-(family-name:--cx-font-display) text-[36px] leading-none font-bold text-(--cx-accent)">
        {n}
      </span>
      <p className="text-[38px] leading-[1.35] font-semibold">{children}</p>
    </div>
  )
}

function SwipeCue() {
  return (
    <p className="font-(family-name:--cx-font-display) text-[30px] leading-[1.3] font-bold text-(--cx-accent)">
      swipe --next →
    </p>
  )
}

function AuthorCard() {
  return (
    <div className="flex flex-col gap-[12px] rounded-[16px] border border-(--cx-rule) bg-(--cx-surface) px-[40px] py-[36px] font-(family-name:--cx-font-display)">
      <p className="text-[28px] leading-[1.2] text-(--cx-muted)">$ whoami</p>
      <p className="text-[48px] leading-[1.15] font-bold tracking-[-0.02em]">{AUTHOR.name}</p>
      <p className="text-[30px] leading-[1.3] font-bold text-(--cx-accent)">{AUTHOR.handle}</p>
    </div>
  )
}

function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between border-t border-(--cx-rule) pt-[28px] font-(family-name:--cx-font-display) text-[26px] leading-[1.3] text-(--cx-muted)">
      <span>
        {'// '}
        {AUTHOR.name} · {AUTHOR.handle}
      </span>
      <span className="tabular-nums">
        [{pad(page)}/{pad(total)}]
      </span>
    </div>
  )
}

function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.2]" />
      <div className="absolute inset-0 bg-(--cx-accent) mix-blend-multiply" />
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
    <div className="flex flex-col gap-[44px] rounded-[16px] border border-(--cx-rule) bg-(--cx-surface) p-[44px]">
      <Icon className="size-[88px] text-(--cx-accent)" strokeWidth={1.75} />
      <p className="text-[44px] leading-[1.3] font-semibold">{children}</p>
    </div>
  )
}

function Quote({ children, by }: { children: ReactNode; by: string }) {
  return (
    <figure className="flex flex-col gap-[36px] border-l-[4px] border-(--cx-accent) pl-[40px]">
      <blockquote className="font-(family-name:--cx-font-display) text-[56px] leading-[1.25] font-bold tracking-[-0.02em]">
        {children}
      </blockquote>
      <figcaption className="font-(family-name:--cx-font-display) text-[28px] leading-[1.3] text-(--cx-muted)">
        -- {by}
      </figcaption>
    </figure>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[28px]">
      <p className="font-(family-name:--cx-font-display) text-[240px] leading-[0.9] font-bold tracking-[-0.04em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[42px] leading-[1.3] font-semibold">{label}</p>
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  const sign = kind === 'do' ? '+' : '-'
  return (
    <div
      className={cn(
        'flex flex-col gap-[40px] rounded-[16px] border p-[40px]',
        kind === 'do' ? 'border-(--cx-accent) bg-(--cx-surface)' : 'border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] font-(family-name:--cx-font-display) text-[26px] leading-[1.2] font-bold',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[28px]" strokeWidth={2.5} />
        {kind === 'do' ? 'after' : 'before'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'flex gap-[14px] text-[42px] leading-[1.3] font-semibold',
            kind === 'dont' && 'text-(--cx-muted)',
          )}
        >
          <span className="font-(family-name:--cx-font-display)">{sign}</span>
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
        <span className="flex h-[64px] w-[88px] shrink-0 items-center justify-center border border-(--cx-accent) font-(family-name:--cx-font-display) text-[28px] leading-none font-bold text-(--cx-accent)">
          {n.padStart(2, '0')}
        </span>
        {last ? null : <span className="w-[2px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[8px]', !last && 'pb-[56px]')}>
        <p className="font-(family-name:--cx-font-display) text-[42px] leading-[1.2] font-bold">
          {title}
        </p>
        <p className="text-[40px] leading-[1.4] font-medium">{children}</p>
      </div>
    </div>
  )
}

function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>cat midnight-terminal</Eyebrow>
        <Hero>Ship the boring version first</Hero>
        <Body>
          Monospace headlines, a dark screen and one glowing accent. Built for dev and AI posts.
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
        <Eyebrow>tail -f ideas.log</Eyebrow>
        <Hero>Read the code twice</Hero>
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
          <Eyebrow>git log --oneline</Eyebrow>
          <Title>Three commits that save a sprint</Title>
        </div>
        <div className="flex flex-col gap-[24px]">
          <Point n="01">Write the test before the fix.</Point>
          <Point n="02">Delete the code nobody calls.</Point>
          <Point n="03">Log the error, not the noise.</Point>
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
          alt="A rack of servers glowing in a dark room"
          className="h-[540px] w-full rounded-[16px] border border-(--cx-rule)"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>ls /infra</Eyebrow>
          <Title>Boring infra wins</Title>
          <Body>Pick the tool your team can debug at 3am.</Body>
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
          <Eyebrow>man good-pr</Eyebrow>
          <Title>Four checks before merge</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Bug}>Tests cover the bug</IconCard>
          <IconCard icon={GitBranch}>Small, focused diff</IconCard>
          <IconCard icon={Terminal}>Runs locally first</IconCard>
          <IconCard icon={Cpu}>No surprise costs</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame className="bg-[linear-gradient(var(--cx-rule)_1px,transparent_1px),linear-gradient(90deg,var(--cx-rule)_1px,transparent_1px)] bg-[size:54px_54px]">
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
        <Eyebrow>echo $RULE</Eyebrow>
        <BigStat value="200" label="lines is a good upper limit for a reviewable PR." />
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
          <Eyebrow>git diff</Eyebrow>
          <Title>Commit messages</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['fix stuff', 'wip', 'final final v2']} />
          <CompareColumn
            kind="do"
            items={['Fix login timeout', 'Add retry to sync', 'Remove dead flags']}
          />
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
          <Eyebrow>make release</Eyebrow>
          <Title>Ship it safely</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="branch">
            One change per branch.
          </Step>
          <Step n="2" title="review">
            Ask one person who knows the area.
          </Step>
          <Step n="3" title="deploy" last>
            Behind a flag, then widen it.
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
        <Eyebrow>exit 0</Eyebrow>
        <Title>Found this useful?</Title>
        <Body>Follow for practical engineering notes every week, and repost for your team.</Body>
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

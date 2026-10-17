// Theme demo: neo-brutalist — keep components in lockstep with theme.md
import { cn } from 'cn'
import { Check, Flame, type LucideIcon, Megaphone, Rocket, Smile, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'

const TOKENS = {
  '--cx-bg': '#FFF8E7',
  '--cx-fg': '#111111',
  '--cx-accent': '#FFD23F',
  '--cx-accent-2': '#FF6B9D',
  '--cx-surface': '#FFFFFF',
  '--cx-muted': '#4A4740',
  '--cx-font-display': "'Space Grotesk', system-ui, sans-serif",
  '--cx-font-body': "'Space Grotesk', system-ui, sans-serif",
} as CSSProperties

export const PALETTES = {
  'lemon-pop': {
    name: 'Lemon Pop',
    tokens: {
      '--cx-bg': '#FFF8E7',
      '--cx-fg': '#111111',
      '--cx-accent': '#FFD23F',
      '--cx-accent-2': '#FF6B9D',
      '--cx-surface': '#FFFFFF',
      '--cx-muted': '#4A4740',
    } as CSSProperties,
  },
  bubblegum: {
    name: 'Bubblegum',
    tokens: {
      '--cx-bg': '#FDF2F8',
      '--cx-fg': '#111111',
      '--cx-accent': '#FF7AB8',
      '--cx-accent-2': '#7DD3FC',
      '--cx-surface': '#FFFFFF',
      '--cx-muted': '#4B4448',
    } as CSSProperties,
  },
  'mint-riot': {
    name: 'Mint Riot',
    tokens: {
      '--cx-bg': '#ECFDF3',
      '--cx-fg': '#111111',
      '--cx-accent': '#3DDC97',
      '--cx-accent-2': '#A897FF',
      '--cx-surface': '#FFFFFF',
      '--cx-muted': '#414A45',
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
      className="self-start border-[3px] border-(--cx-fg) bg-(--cx-accent-2) px-[18px] py-[8px] text-[26px] leading-[1.2] font-bold tracking-[0.08em] uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}

function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[116px] leading-[1.02] font-bold tracking-[-0.045em] [&_mark]:bg-(--cx-accent) [&_mark]:px-[10px] [&_mark]:text-(--cx-fg)">
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[80px] leading-[1.06] font-bold tracking-[-0.035em] [&_mark]:bg-(--cx-accent) [&_mark]:px-[8px] [&_mark]:text-(--cx-fg)"
      {...slide}
    >
      {children}
    </h2>
  )
}

function Body({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p className="text-[38px] leading-[1.45] font-medium" {...slide}>
      {children}
    </p>
  )
}

function Card({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[28px] border-[4px] border-(--cx-fg) bg-(--cx-surface) px-[28px] py-[24px] shadow-[10px_10px_0_0_var(--cx-fg)]">
      <span className="flex size-[68px] shrink-0 items-center justify-center border-[3px] border-(--cx-fg) bg-(--cx-accent) text-[34px] leading-none font-bold">
        {n}
      </span>
      <p className="text-[36px] leading-[1.3] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function SwipeCue() {
  return (
    <p className="self-start border-[4px] border-(--cx-fg) bg-(--cx-accent) px-[28px] py-[12px] text-[30px] leading-[1.2] font-bold shadow-[8px_8px_0_0_var(--cx-fg)]">
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
    <div className="flex items-center gap-[28px] self-start border-[4px] border-(--cx-fg) bg-(--cx-surface) p-[28px] pr-[48px] shadow-[10px_10px_0_0_var(--cx-fg)]">
      <div className="flex size-[104px] shrink-0 items-center justify-center border-[3px] border-(--cx-fg) bg-(--cx-accent-2) text-[40px] leading-none font-bold">
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
    <div className="mt-auto flex items-center justify-between border-t-[4px] border-(--cx-fg) pt-[24px] text-[26px] leading-[1.3] font-bold">
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
      <div className="absolute inset-0 bg-(--cx-accent) mix-blend-multiply" />
      <div className="absolute inset-0 bg-(--cx-fg) mix-blend-lighten" />
    </div>
  )
}

function IconCard({
  icon: Icon,
  children,
  ...slide
}: { icon: LucideIcon; children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[44px] border-[4px] border-(--cx-fg) bg-(--cx-surface) p-[44px] shadow-[8px_8px_0_0_var(--cx-fg)]">
      <span className="flex size-[112px] items-center justify-center border-[3px] border-(--cx-fg) bg-(--cx-accent-2)">
        <Icon className="size-[60px]" strokeWidth={2.5} />
      </span>
      <p className="text-[44px] leading-[1.2] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function Quote({ children, by, ...slide }: { children: ReactNode; by: string } & SlideProps) {
  return (
    <figure className="flex flex-col gap-[32px] border-[4px] border-(--cx-fg) bg-(--cx-accent) p-[52px] shadow-[12px_12px_0_0_var(--cx-fg)]">
      <span className="text-[140px] leading-[0.6] font-bold">“</span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[58px] leading-[1.12] font-bold tracking-[-0.03em]"
        {...slide}
      >
        {children}
      </blockquote>
      <figcaption className="text-[28px] leading-[1.3] font-bold">— {by}</figcaption>
    </figure>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[36px]">
      <p className="self-start border-[4px] border-(--cx-fg) bg-(--cx-accent) px-[40px] font-(family-name:--cx-font-display) text-[260px] leading-[1.0] font-bold tracking-[-0.06em] shadow-[12px_12px_0_0_var(--cx-fg)]">
        {value}
      </p>
      <p className="text-[44px] leading-[1.2] font-bold">{label}</p>
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div
      className={cn(
        'flex flex-col gap-[40px] border-[4px] border-(--cx-fg) p-[40px] shadow-[10px_10px_0_0_var(--cx-fg)]',
        kind === 'do' ? 'bg-(--cx-accent)' : 'bg-(--cx-surface)',
      )}
    >
      <p className="flex items-center gap-[10px] self-start border-[3px] border-(--cx-fg) bg-(--cx-surface) px-[14px] py-[6px] text-[26px] leading-[1.2] font-bold uppercase">
        <Icon className="size-[28px]" strokeWidth={3} />
        {kind === 'do' ? 'Yes' : 'Nope'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn('text-[42px] leading-[1.25] font-bold', kind === 'dont' && 'line-through')}
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
    <div className="flex gap-[28px]">
      <div className="flex flex-col items-center">
        <span className="flex size-[72px] shrink-0 items-center justify-center border-[4px] border-(--cx-fg) bg-(--cx-accent) text-[34px] leading-none font-bold">
          {n}
        </span>
        {last ? null : <span className="w-[4px] flex-1 bg-(--cx-fg)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[10px]', !last && 'pb-[56px]')}>
        <p className="text-[48px] leading-[1.15] font-bold tracking-[-0.02em]">{title}</p>
        <p className="text-[40px] leading-[1.35] font-medium" {...slide}>
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
        <Eyebrow>Neo-Brutalist</Eyebrow>
        <Hero>
          Loud ideas, <mark>zero</mark> fluff
        </Hero>
        <Body>
          Thick borders, hard shadows and bright blocks of colour. Built to stop the scroll.
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
          alt="Bold blocks of red and blue paint on a wall"
          className="h-[560px] w-full border-[4px] border-(--cx-fg) shadow-[10px_10px_0_0_var(--cx-fg)]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Unpopular opinion</Eyebrow>
          <Hero>
            Be <mark>loud</mark> on purpose
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
          <Eyebrow>Hot take</Eyebrow>
          <Title>
            Your slides need <mark>less</mark>
          </Title>
        </div>
        <div className="flex flex-col gap-[36px]">
          <Card n="1">Cut every word you can.</Card>
          <Card n="2">Make one thing the hero.</Card>
          <Card n="3">Say it the way you talk.</Card>
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
          alt="A stack of retro cassette tapes"
          className="h-[520px] w-full border-[4px] border-(--cx-fg) shadow-[10px_10px_0_0_var(--cx-fg)]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Throwback</Eyebrow>
          <Title>
            Old ideas, <mark>new</mark> tricks
          </Title>
          <Body>The best formats are remixes of things that already worked.</Body>
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
          <Eyebrow>Cheat sheet</Eyebrow>
          <Title>
            Posts that get <mark>saved</mark>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Flame}>A spicy opinion</IconCard>
          <IconCard icon={Smile}>A real story</IconCard>
          <IconCard icon={Megaphone}>One clear ask</IconCard>
          <IconCard icon={Rocket}>A result people want</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}

function QuoteSlide() {
  return (
    <Frame className="bg-[repeating-linear-gradient(45deg,transparent_0,transparent_28px,color-mix(in_oklab,var(--cx-fg)_6%,transparent)_28px,color-mix(in_oklab,var(--cx-fg)_6%,transparent)_34px)]">
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
        <Eyebrow>Fact of life</Eyebrow>
        <BigStat value="3s" label="is all the time your hook gets." />
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
          <Eyebrow>Glow up</Eyebrow>
          <Title>
            Hooks that <mark>work</mark>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['“Some thoughts”', 'Long intros', 'Vague promises']} />
          <CompareColumn kind="do" items={['A bold claim', 'Straight to it', 'A clear payoff']} />
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
          <Eyebrow>Recipe</Eyebrow>
          <Title>Cook up a post</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Hook">
            Say the surprising thing first.
          </Step>
          <Step n="2" title="Proof">
            Back it with one real example.
          </Step>
          <Step n="3" title="Ask" last>
            Tell people exactly what to do.
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
        <Eyebrow>Your move</Eyebrow>
        <Title>
          Agree? <mark>Repost</mark> it.
        </Title>
        <Body>Follow for one bold, practical idea every week.</Body>
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

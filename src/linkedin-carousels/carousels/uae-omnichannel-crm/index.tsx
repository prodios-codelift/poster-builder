// Theme: condensed-impact

import { cn } from 'cn'
import { ArrowRight, Check, Globe, Inbox, Phone, X, type LucideIcon } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'
import dubaiPhoto from './assets/dubai.jpg'
import gmailLogo from './assets/logos/gmail.svg'
import instagramLogo from './assets/logos/instagram.svg'
import whatsappLogo from './assets/logos/whatsapp.svg'
import phonePhoto from './assets/phone.jpg'

const TOKENS = {
  '--cx-bg': '#3B1FA8',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#FFD23F',
  '--cx-muted': '#D4CCF5',
  '--cx-on-accent': '#1A0F4D',
  '--cx-rule': 'rgba(255, 255, 255, 0.22)',
  '--cx-surface': 'rgba(255, 255, 255, 0.09)',
  '--cx-ring': 'rgba(255, 255, 255, 0.13)',
  '--cx-font-display': "'Oswald', 'Arial Narrow', sans-serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

const AUTHOR = { name: 'Your Name', handle: '@yourhandle' }

const TOTAL = 9

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LinkedInCarouselSlide tokens={TOKENS}>
      <div
        className={cn(
          'relative isolate flex size-full flex-col bg-(--cx-bg) px-[96px] pt-[112px] pb-[72px] font-(family-name:--cx-font-body) text-(--cx-fg)',
          className,
        )}
      >
        <Rings />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </LinkedInCarouselSlide>
  )
}

function Rings() {
  return (
    <div className="pointer-events-none absolute -top-[300px] -right-[300px] size-[760px] rounded-full bg-[repeating-radial-gradient(circle,transparent_0_44px,var(--cx-ring)_44px_50px)]" />
  )
}

function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="self-start rounded-[8px] bg-(--cx-accent) px-[20px] py-[10px] text-[26px] leading-[1.2] font-extrabold tracking-[0.14em] text-(--cx-on-accent) uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}

function Hero({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h1
      className="font-(family-name:--cx-font-display) text-[150px] leading-[1.0] font-bold tracking-[-0.005em] uppercase"
      {...slide}
    >
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[96px] leading-[1.05] font-bold uppercase"
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
    <div className="flex items-baseline gap-[32px] border-t border-(--cx-rule) pt-[32px]">
      <span className="w-[64px] shrink-0 font-(family-name:--cx-font-display) text-[64px] leading-none font-bold text-(--cx-accent)">
        {n}
      </span>
      <p className="text-[42px] leading-[1.35] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}

function SwipeCue() {
  return (
    <div className="flex items-center gap-[20px]">
      <p className="text-[30px] leading-[1.3] font-bold tracking-[0.14em] uppercase">Swipe</p>
      <span className="flex size-[64px] items-center justify-center rounded-full border-[3px] border-(--cx-accent) text-(--cx-accent)">
        <ArrowRight className="size-[32px]" strokeWidth={2.5} />
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
    <div className="flex items-center gap-[32px]">
      <span className="flex size-[120px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) font-(family-name:--cx-font-display) text-[52px] leading-none font-bold text-(--cx-on-accent)">
        {initials}
      </span>
      <div className="flex flex-col gap-[6px]">
        <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.1] font-bold uppercase">
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
    <div className="mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-bold text-(--cx-muted)">
      <span>{AUTHOR.handle}</span>
      <span className="font-(family-name:--cx-font-display) tracking-[0.08em] tabular-nums">
        {pad(page)} / {pad(total)}
      </span>
    </div>
  )
}

function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.25]" />
      <div className="absolute inset-0 bg-(--cx-bg) mix-blend-screen" />
    </div>
  )
}

function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div
      className={cn(
        'flex flex-col gap-[36px] rounded-[24px] p-[40px]',
        kind === 'do' ? 'bg-(--cx-surface)' : 'border-[3px] border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] font-(family-name:--cx-font-display) text-[40px] leading-[1.1] font-bold uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[40px]" strokeWidth={3} />
        {kind === 'do' ? 'Do' : "Don't"}
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

const CHANNELS: { label: string; logo?: string; icon?: LucideIcon }[] = [
  { label: 'WhatsApp', logo: whatsappLogo },
  { label: 'Instagram', logo: instagramLogo },
  { label: 'Email', logo: gmailLogo },
  { label: 'Calls', icon: Phone },
  { label: 'Web chat', icon: Globe },
]

function ChannelTile({ label, logo, icon: Icon }: (typeof CHANNELS)[number]) {
  return (
    <div className="flex flex-col items-center gap-[16px]">
      <span className="flex size-[112px] items-center justify-center rounded-[28px] bg-(--cx-fg) text-(--cx-bg)">
        {logo ? (
          <img src={logo} alt="" width={64} height={64} className="size-[64px]" />
        ) : (
          Icon && <Icon className="size-[56px]" strokeWidth={2.25} />
        )}
      </span>
      <p className="text-[26px] leading-[1.2] font-bold">{label}</p>
    </div>
  )
}

/** Tile centres on the 888 px, 5-column, 20 px-gap grid. */
const TILE_X = [80.8, 262.4, 444, 625.6, 807.2]
const CURVE_H = 220

/**
 * The merge illustration: five channel tiles, each feeding a bezier curve that
 * bends into the centre and lands on the single inbox below.
 */
function MergeDiagram() {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-5 gap-[20px]">
        {CHANNELS.map((channel) => (
          <ChannelTile key={channel.label} {...channel} />
        ))}
      </div>
      <svg
        viewBox={`0 0 888 ${CURVE_H}`}
        className="h-[220px] w-full fill-none stroke-(--cx-fg)"
        aria-hidden
      >
        {TILE_X.map((x) => (
          <path
            key={x}
            d={`M ${x} 16 C ${x} ${CURVE_H * 0.62}, 444 ${CURVE_H * 0.38}, 444 ${CURVE_H}`}
            strokeWidth={4}
            strokeLinecap="round"
          />
        ))}
        {TILE_X.map((x) => (
          <circle key={x} cx={x} cy={16} r={8} className="fill-(--cx-fg)" />
        ))}
      </svg>
      <div className="flex items-center justify-center gap-[28px] rounded-[24px] bg-(--cx-accent) px-[40px] py-[36px] text-(--cx-on-accent)">
        <Inbox className="size-[64px]" strokeWidth={2.25} />
        <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.1] font-bold uppercase">
          One inbox
        </p>
      </div>
    </div>
  )
}

function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>AI-native CRM</Eyebrow>
        <Hero>Your next deal is in an unread DM</Hero>
        <Body>One AI-native CRM that merges every channel your UAE customers use.</Body>
        <SwipeCue />
      </div>
      <Footer page={1} total={TOTAL} />
    </Frame>
  )
}

function Channels() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[64px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The channels</Eyebrow>
          <Title>Where your customers already are</Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="1">WhatsApp, day and night</Point>
          <Point n="2">Instagram DMs and comments</Point>
          <Point n="3">Calls to your sales line</Point>
          <Point n="4">Emails from the website</Point>
        </div>
      </div>
      <Footer page={2} total={TOTAL} />
    </Frame>
  )
}

function TheCost() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[56px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The cost</Eyebrow>
          <Title>Where deals quietly die</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Make them repeat', 'Chase leads from memory', 'Leave leads unowned']}
          />
          <CompareColumn
            kind="do"
            items={['One shared timeline', 'Automatic reminders', 'An owner per lead']}
          />
        </div>
      </div>
      <Footer page={3} total={TOTAL} />
    </Frame>
  )
}

function OnePlace() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[48px]">
        <Photo
          src={dubaiPhoto}
          alt="The Dubai skyline at night"
          className="h-[520px] w-full rounded-[24px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The shift</Eyebrow>
          <Title>One place for it all</Title>
          <Body>Every channel feeds one customer story.</Body>
        </div>
      </div>
      <Footer page={4} total={TOTAL} />
    </Frame>
  )
}

function UnifiedInbox() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[48px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Unified inbox</Eyebrow>
          <Title>Stop switching apps</Title>
        </div>
        <MergeDiagram />
        <Body>No DM, call or email left unanswered.</Body>
      </div>
      <Footer page={5} total={TOTAL} />
    </Frame>
  )
}

function AiLayer() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[64px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The AI layer</Eyebrow>
          <Title>AI that reads the whole story</Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="1">Summarises every thread</Point>
          <Point n="2">Drafts the next reply</Point>
          <Point n="3">Reminds you to follow up</Point>
        </div>
      </div>
      <Footer page={6} total={TOTAL} />
    </Frame>
  )
}

function NeverMiss() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[48px]">
        <Photo
          src={phonePhoto}
          alt="A customer holding a phone"
          className="h-[520px] w-full rounded-[24px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Never miss</Eyebrow>
          <Title>No message left behind</Title>
          <Body>Every lead gets an owner and a reminder.</Body>
        </div>
      </div>
      <Footer page={7} total={TOTAL} />
    </Frame>
  )
}

function Recap() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[64px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The recap</Eyebrow>
          <Title>What merging gives you</Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="1">One inbox for every channel</Point>
          <Point n="2">One record per customer</Point>
          <Point n="3">One AI that sees it all</Point>
          <Point n="4">One team, nothing missed</Point>
        </div>
      </div>
      <Footer page={8} total={TOTAL} />
    </Frame>
  )
}

function Closer() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Before you go</Eyebrow>
        <Title>Never miss another customer</Title>
        <Body>Follow for more on AI-native CRM built for the Gulf.</Body>
        <AuthorCard />
      </div>
      <Footer page={9} total={TOTAL} />
    </Frame>
  )
}

export const slides = [
  Cover,
  Channels,
  TheCost,
  OnePlace,
  UnifiedInbox,
  AiLayer,
  NeverMiss,
  Recap,
  Closer,
]

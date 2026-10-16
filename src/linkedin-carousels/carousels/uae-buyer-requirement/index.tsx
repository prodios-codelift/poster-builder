// Theme: torn-paper

import { cn } from 'cn'
import { ArrowRight } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import buyerPhoto from './assets/buyer.jpg'
import inventoryPhoto from './assets/inventory.jpg'

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

const AUTHOR = { name: 'Prodios Labs', handle: '@prodioslabs' }
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

function SwipeCue() {
  return (
    <p className="flex items-center gap-[16px] text-[30px] leading-[1.3] font-extrabold tracking-[0.12em] uppercase">
      Swipe
      <ArrowRight className="size-[40px] text-(--cx-accent)" strokeWidth={3} />
    </p>
  )
}

function Footer({ page }: { page: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-bold text-(--cx-muted)">
      <span>
        {AUTHOR.name} · {AUTHOR.handle}
      </span>
      <span className="tabular-nums">{pad(page)} / 08</span>
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

function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[36px]">
        <Eyebrow>AI-native CRM · UAE</Eyebrow>
        <Scrap>
          <Hero>Match the brief. While it’s fresh.</Hero>
        </Scrap>
        <Body>Propose the right inventory the moment a buyer requirement is captured.</Body>
        <SwipeCue />
      </div>
      <Footer page={1} />
    </Frame>
  )
}

function BuyerBrief() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[36px]">
        <Scrap className="p-[20px]">
          <Photo
            src={buyerPhoto}
            alt="A couple considering a home together"
            className="h-[340px] w-full"
          />
        </Scrap>
        <Eyebrow>The moment</Eyebrow>
        <Title>A buyer describes a life.</Title>
        <Body>
          Area. Budget. Bedrooms. Move-in date. The details arrive in conversation, not a perfect
          form.
        </Body>
      </div>
      <Footer page={2} />
    </Frame>
  )
}

function CaptureTheBrief() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[36px]">
        <Eyebrow>Capture intent</Eyebrow>
        <Title>Turn the conversation into criteria.</Title>
        <Scrap>
          <p className="text-[40px] leading-[1.4] font-bold">
            Location · budget · beds · timing · must-haves
          </p>
        </Scrap>
        <Body>
          Keep the buyer’s priorities attached to the contact, wherever the conversation started.
        </Body>
      </div>
      <Footer page={3} />
    </Frame>
  )
}

function MatchInventory() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[36px]">
        <Scrap className="p-[20px]">
          <Photo
            src={inventoryPhoto}
            alt="A Dubai apartment interior representing available inventory"
            className="h-[350px] w-full"
          />
        </Scrap>
        <Eyebrow>At capture</Eyebrow>
        <Title>Put matching inventory on the table.</Title>
        <Body>
          The CRM checks the brief against available properties and surfaces relevant options
          immediately.
        </Body>
      </div>
      <Footer page={4} />
    </Frame>
  )
}

function ExplainTheMatch() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[36px]">
        <Eyebrow>Make it useful</Eyebrow>
        <Title>Show why each option fits.</Title>
        <Scrap tilt="right">
          <p className="text-[40px] leading-[1.4] font-bold">
            Fits the area and budget. Two bedrooms. Available on time.
          </p>
        </Scrap>
        <Body>
          Surface the match and any gaps, so the agent can judge the shortlist with the buyer.
        </Body>
      </div>
      <Footer page={5} />
    </Frame>
  )
}

function ChooseTheNextMove() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[36px]">
        <Eyebrow>From match to action</Eyebrow>
        <Title>Let the agent move it forward.</Title>
        <Scrap>
          <p className="text-[40px] leading-[1.4] font-bold">
            Shortlist · share · arrange a viewing
          </p>
        </Scrap>
        <Body>
          Relevant options are ready inside the buyer’s workflow, with context for the next
          conversation.
        </Body>
      </div>
      <Footer page={6} />
    </Frame>
  )
}

function KeepTheBriefLive() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[36px]">
        <Eyebrow>Keep it current</Eyebrow>
        <Title>When priorities change, match again.</Title>
        <Body>
          Update the requirement once. Refresh the options without rebuilding the search from
          scratch.
        </Body>
      </div>
      <Footer page={7} />
    </Frame>
  )
}

function Closer() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[36px]">
        <Eyebrow>Build the next move</Eyebrow>
        <Title>Make every brief actionable.</Title>
        <Body>Explore AI-native CRM for property teams in the UAE.</Body>
        <Scrap tilt="none" className="self-start px-[36px] py-[28px]">
          <p className="text-[38px] leading-[1.3] font-extrabold">[Prodios Labs link]</p>
        </Scrap>
        <AuthorCard />
      </div>
      <Footer page={8} />
    </Frame>
  )
}

export const slides = [
  Cover,
  BuyerBrief,
  CaptureTheBrief,
  MatchInventory,
  ExplainTheMatch,
  ChooseTheNextMove,
  KeepTheBriefLive,
  Closer,
]

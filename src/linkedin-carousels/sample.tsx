import { LinkedInCarouselSlide } from './linkedin-carousel-slide'

function SlideOne() {
  return (
    <LinkedInCarouselSlide className="flex flex-col justify-center gap-6 p-20">
      <p className="text-2xl font-medium tracking-wide text-neutral-500 uppercase">
        Sample carousel
      </p>
      <h1 className="text-7xl leading-tight font-bold tracking-tight">
        Build LinkedIn carousels in code
      </h1>
    </LinkedInCarouselSlide>
  )
}

function SlideTwo() {
  return (
    <LinkedInCarouselSlide className="flex flex-col justify-center gap-8 bg-neutral-950 p-20 text-white">
      <h2 className="text-6xl leading-tight font-bold tracking-tight">
        Each slide is a React component
      </h2>
      <p className="max-w-xl text-3xl leading-snug text-neutral-300">
        Wrap content in LinkedInCarouselSlide so every frame stays 1080×1350.
      </p>
    </LinkedInCarouselSlide>
  )
}

function SlideThree() {
  return (
    <LinkedInCarouselSlide className="flex flex-col justify-between bg-amber-50 p-20">
      <h2 className="text-6xl leading-tight font-bold tracking-tight text-neutral-900">
        Preview, page, export later
      </h2>
      <p className="text-3xl font-medium text-neutral-600">Slide 3 of 3</p>
    </LinkedInCarouselSlide>
  )
}

export const sampleSlides = [SlideOne, SlideTwo, SlideThree]

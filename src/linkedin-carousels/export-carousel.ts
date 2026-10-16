import { jsPDF } from 'jspdf'
import JSZip from 'jszip'
import { domToBlob } from 'modern-screenshot'
import { createElement, type FC } from 'react'
import { createRoot, type Root } from 'react-dom/client'

import { CAROUSEL_HEIGHT, CAROUSEL_WIDTH } from './dimensions'
import type { LinkedInCarousel } from './types'

function toSlug(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'carousel'
  )
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

async function waitForImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll('img'))
  await Promise.all(
    images.map((image) => {
      if (image.complete) {
        return image.decode().catch(() => undefined)
      }
      return new Promise<void>((resolve) => {
        image.addEventListener('load', () => resolve(), { once: true })
        image.addEventListener('error', () => resolve(), { once: true })
      }).then(() => image.decode().catch(() => undefined))
    }),
  )
}

function waitForFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

async function captureSlide(Slide: FC): Promise<Blob> {
  const host = document.createElement('div')
  host.style.cssText = [
    'position:fixed',
    'left:-10000px',
    'top:0',
    `width:${CAROUSEL_WIDTH}px`,
    `height:${CAROUSEL_HEIGHT}px`,
    'overflow:hidden',
    'pointer-events:none',
  ].join(';')
  document.body.appendChild(host)

  let root: Root | null = createRoot(host)
  try {
    root.render(createElement(Slide))
    await document.fonts.ready
    await waitForImages(host)
    await waitForFrame()

    const blob = await domToBlob(host, {
      width: CAROUSEL_WIDTH,
      height: CAROUSEL_HEIGHT,
      scale: 1,
      type: 'image/png',
    })

    if (!blob) {
      throw new Error('Failed to capture slide')
    }

    return blob
  } finally {
    root?.unmount()
    root = null
    host.remove()
  }
}

async function captureAllSlides(carousel: LinkedInCarousel): Promise<Blob[]> {
  const blobs: Blob[] = []
  for (const Slide of carousel.slides) {
    blobs.push(await captureSlide(Slide))
  }
  return blobs
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read blob'))
    reader.readAsDataURL(blob)
  })
}

export async function exportCarouselAsPdf(carousel: LinkedInCarousel) {
  const slug = toSlug(carousel.name)
  const blobs = await captureAllSlides(carousel)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [CAROUSEL_WIDTH, CAROUSEL_HEIGHT],
    hotfixes: ['px_scaling'],
  })

  for (let index = 0; index < blobs.length; index += 1) {
    if (index > 0) {
      pdf.addPage([CAROUSEL_WIDTH, CAROUSEL_HEIGHT], 'portrait')
    }
    const dataUrl = await blobToDataUrl(blobs[index]!)
    pdf.addImage(dataUrl, 'PNG', 0, 0, CAROUSEL_WIDTH, CAROUSEL_HEIGHT)
  }

  pdf.save(`${slug}.pdf`)
}

export async function exportCarouselAsImages(carousel: LinkedInCarousel) {
  const slug = toSlug(carousel.name)
  const blobs = await captureAllSlides(carousel)
  const zip = new JSZip()

  for (let index = 0; index < blobs.length; index += 1) {
    const padded = String(index + 1).padStart(2, '0')
    zip.file(`${slug}-${padded}.png`, blobs[index]!)
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(zipBlob, `${slug}.zip`)
}

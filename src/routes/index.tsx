import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { InstagramIcon, LinkedInIcon } from '@/components/ui/icons'

export const Route = createFileRoute('/')({
  component: Home,
})

type FormatCard = {
  title: string
  description: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  to?: '/linkedin-carousel'
}

const formats: FormatCard[] = [
  {
    title: 'LinkedIn carousel',
    description: 'Create a multi-slide post.',
    icon: LinkedInIcon,
    to: '/linkedin-carousel',
  },
  {
    title: 'LinkedIn post',
    description: 'Create a single-image post.',
    icon: LinkedInIcon,
  },
  {
    title: 'Instagram post',
    description: 'Create a post for your feed.',
    icon: InstagramIcon,
  },
]

function FormatCardItem({ title, description, icon: Icon, to }: FormatCard) {
  const card = (
    <Card className="h-full [--card-spacing:--spacing(6)]">
      <CardHeader className="flex-1 gap-2">
        <Icon className="mb-4 size-8" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-between gap-2">
        {to ? (
          <>
            <span>Get started</span>
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </>
        ) : (
          <span className="text-muted-foreground">Coming soon</span>
        )}
      </CardFooter>
    </Card>
  )

  if (to) {
    return (
      <Link
        to={to}
        className="block rounded-xl outline-none transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {card}
      </Link>
    )
  }

  return card
}

function Home() {
  return (
    <main className="mx-auto flex min-h-svh max-w-4xl flex-col justify-center gap-8 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium tracking-tight">Poster builder</h1>
        <p className="text-muted-foreground">Choose a format to get started.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {formats.map((format) => (
          <FormatCardItem key={format.title} {...format} />
        ))}
      </div>
    </main>
  )
}

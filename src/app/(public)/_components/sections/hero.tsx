import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { BgGradient } from "@/components/common/icons"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarsGroup,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function Hero() {
  const AVATARS = [
    {
      src: "https://github.com/shadcn.png",
      alt: "Avatar 1",
    },
    {
      src: "https://github.com/shadcn.png",
      alt: "Avatar 2",
    },
    {
      src: "https://github.com/shadcn.png",
      alt: "Avatar 3",
    },
  ]

  return (
    <main className="container relative flex min-h-[90vh] flex-col items-center gap-6 text-balance bg-background p-6 text-center text-primary">
      <BgGradient />

      <div className="z-10 mt-10 flex flex-col items-center gap-8 px-2 md:mt-32 md:px-0">
        {/* avatars */}
        <div className="inline-flex items-center gap-4 px-6 py-3 outline outline-secondary">
          <AvatarsGroup>
            {AVATARS.map((avatar) => (
              <Avatar className="size-5" key={avatar.alt}>
                <AvatarImage alt={avatar.alt} src={avatar.src} />
                <AvatarFallback>{avatar.alt}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarsGroup>

          <p className="font-medium text-secondary text-xs">
            Trusted by ~6,900+ users
          </p>
        </div>

        {/* title */}
        <h1 className="max-w-5xl font-bold text-4xl md:text-6xl">
          Trackzy helps you manage your money — so you can save more,
          <div className="-rotate-3 inline-block bg-primary px-2">
            <span className="font-extrabold text-secondary italic underline underline-offset-8">
              and worry less.
            </span>
          </div>
        </h1>

        {/* description */}
        <p className="max-w-5xl text-balance">
          No spreadsheets. No guesswork. Just simple tools to manage your money,
          build habits, and hit your financial goals.
        </p>

        {/* cta */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg">See How It Works</Button>

          <Button asChild size="lg" variant="secondary">
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

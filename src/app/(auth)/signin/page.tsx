import { DoorOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SigninPage() {
  return (
    <>
      <div className="flex w-full min-w-sm max-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md">
        <h1 className="flex items-center gap-2 font-semibold text-xl">
          <DoorOpen className="size-6" />
          Sign in
        </h1>

        <Input className="text-sm" placeholder="Email" required type="email" />

        <Input
          className="text-sm"
          placeholder="Password"
          required
          type="password"
        />

        <Button className="w-full" type="submit">
          Sign in
        </Button>
      </div>

      <div className="flex justify-center gap-1 text-muted-foreground text-sm">
        <p>Need an account?</p>
        <Link
          className="font-medium text-primary hover:underline"
          href="/signup"
        >
          Sign up
        </Link>
      </div>
    </>
  )
}

import { DoorClosed } from "lucide-react"
import Link from "next/link"
import { SignupForm } from "./_components/signup-form"

export default function SignupPage() {
  return (
    <>
      <div className="flex w-full min-w-sm max-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md">
        <h1 className="flex items-center gap-2 font-semibold text-xl">
          <DoorClosed className="size-6" />
          Sign up
        </h1>

        <SignupForm />
      </div>

      <div className="flex justify-center gap-1 text-muted-foreground text-sm">
        <p>Already have an account?</p>
        <Link
          className="font-medium text-primary hover:underline"
          href="/signin"
        >
          Sign in
        </Link>
      </div>
    </>
  )
}

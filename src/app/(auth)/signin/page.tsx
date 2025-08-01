import { DoorOpen } from "lucide-react"
import Link from "next/link"
import { SigninForm } from "../_components/signin-form"

export default function SigninPage() {
  return (
    <>
      <div className="flex w-full min-w-sm max-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md">
        <h1 className="flex items-center gap-2 font-semibold text-xl">
          <DoorOpen className="size-6" />
          Sign in
        </h1>

        <SigninForm />
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

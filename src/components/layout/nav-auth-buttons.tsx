import { DoorClosed, DoorOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

export default function NavAuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/signup">
          <DoorClosed className="size-4" />
          Sign up
        </Link>
      </Button>

      <Button asChild size="sm" variant="secondary">
        <Link href="/signin">
          <DoorOpen className="size-4" />
          Sign in
        </Link>
      </Button>
    </div>
  )
}

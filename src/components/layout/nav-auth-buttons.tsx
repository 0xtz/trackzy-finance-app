import { DoorClosed } from "lucide-react";
import { Button } from "../ui/button";

export default function NavAuthButtons() {
  return (
    <Button size="sm" variant="outline">
      <DoorClosed className="size-4" />
      Sign in
    </Button>
  );
}

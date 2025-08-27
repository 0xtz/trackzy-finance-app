import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "../ui/button";

export default function DateRangePicker() {
  return (
    <Button disabled size="sm" variant="outline">
      <Calendar className="size-4" />
      {formatDate(new Date(), "MM/yyyy")}
    </Button>
  );
}

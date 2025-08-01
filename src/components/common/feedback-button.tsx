"use client";

import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { APP_CONFIG } from "@/lib/config";

export default function FeedbackButton() {
  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline">
            <MessageCircle className="size-4" /> Feedback
          </Button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-72">
          <h2 className="mb-2 font-semibold text-sm">
            Send us feedback (beta)
          </h2>

          <form className="space-y-3">
            <Textarea
              aria-label="Send feedback"
              id="feedback"
              placeholder={`How can we improve ${APP_CONFIG.name}?`}
            />

            <div className="flex flex-col sm:flex-row sm:justify-end">
              <Button
                onClick={(e) => {
                  e.preventDefault();

                  toast.message("Not implemented yet :(");
                }}
                size="sm"
                variant="outline"
              >
                Send feedback
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}

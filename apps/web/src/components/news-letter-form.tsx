import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { LoaderCircle } from "lucide-react";
import Form from "next/form";
import { useFormStatus } from "react-dom";

import { newsletterSubmission } from "../action/newsletter-submission";

export function NewsLetterForm({ className }: { className?: string }) {
  return (
    <Form
      className={cn(
        "flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2",
        className,
      )}
      action={newsletterSubmission}
    >
      <div className="flex bg-zinc-200 items-center border dark:border-zinc-50 rounded-2xl p-2 drop-shadow-lg md:w-96 justify-between pl-4">
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email address"
          className="rounded-e-none border-e-0 focus-visible:ring-0 outline-none bg-transparent w-full placeholder:text-zinc-600 text-zinc-600"
        />
        <SubscribeNewsletterButton />
      </div>
    </Form>
  );
}

function SubscribeNewsletterButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending}
      className="rounded-lg shrink-0 px-4 py-2 dark:bg-black dark:text-white"
      aria-label={pending ? "Subscribing..." : "Subscribe to newsletter"}
    >
      <span className="flex items-center justify-center gap-2">
        {pending ? (
          <>
            <LoaderCircle
              className="animate-spin text-black"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="text-base font-medium">Subscribing...</span>
          </>
        ) : (
          <span className="text-base font-medium">Subscribe</span>
        )}
      </span>
    </Button>
  );
}

import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { MessageSquare, X } from "lucide-react";
import { AssistantPanel } from "@/components/case-detail";
import { AiNotice } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const params = useParams({ strict: false });
  const caseId = (params as any).caseId; // Extract caseId if on a case page

  const assistantContent = (
    <div className="flex h-full flex-col p-4 md:p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="font-display text-lg font-medium text-foreground">AI Case Assistant</h2>
          <p className="text-sm text-muted-foreground">
            {caseId ? "Answers grounded in the current matter." : "General guidance and procedures."}
          </p>
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="size-5" />
          </Button>
        )}
      </div>

      <AiNotice />

      <div className="mt-4 flex-1 overflow-hidden rounded-lg border border-border">
        <AssistantPanel
          key={caseId ?? "general"}
          {...(caseId ? { caseId } : {})}
          audience="citizen"
          suggestions={[
            "What does my case mean in simple terms?",
            "What documents should I arrange before the first hearing?",
            "How long does a matter like this usually take?",
            "What should I ask an advocate at the first consultation?",
          ]}
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="fixed right-4 bottom-4 z-50 size-14 rounded-full shadow-lg"
            aria-label="Open AI Assistant"
          >
            <MessageSquare className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] p-0 sm:max-w-none" closeIcon={false}>
          <SheetTitle className="sr-only">AI Case Assistant</SheetTitle>
          {assistantContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed right-6 bottom-6 z-50 size-14 rounded-full shadow-xl transition-transform hover:scale-105"
          aria-label="Open AI Assistant"
        >
          {open ? <X className="size-6" /> : <MessageSquare className="size-6" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={16}
        className="h-[600px] w-[400px] p-0 shadow-2xl"
        onInteractOutside={() => setOpen(false)}
      >
        {assistantContent}
      </PopoverContent>
    </Popover>
  );
}

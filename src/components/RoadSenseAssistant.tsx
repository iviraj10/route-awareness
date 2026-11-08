import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoadSenseLogo } from "@/components/RoadSenseLogo";
import { answerQuestion, suggestedQuestions } from "@/lib/assistant-faq";

type Msg = { from: "bot" | "user"; text: string };

const greeting: Msg = {
  from: "bot",
  text: "Hi! I answer predefined questions about RoadSense, its Mumbai study dataset and road safety. Pick a topic or type a question.",
};

export function RoadSenseAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text }, { from: "bot", text: answerQuestion(text) }]);
    setInput("");
  };

  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <div className="fixed right-4 bottom-4 z-[1100] flex flex-col items-end gap-3">
      {open && (
        <section
          role="dialog"
          aria-label="RoadSense Assistant"
          onKeyDown={(e) => e.key === "Escape" && close()}
          className="rs-sheet-in border-border bg-surface shadow-card flex h-[min(520px,calc(100dvh-6rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border"
        >
          <header className="border-border flex items-center gap-2.5 border-b px-4 py-3">
            <RoadSenseLogo className="size-7" />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold">RoadSense Assistant</h2>
              <p className="text-muted-foreground text-xs">Predefined answers · not live AI</p>
            </div>
            <Button variant="ghost" size="icon" onClick={close} aria-label="Close assistant">
              <X className="size-4" />
            </Button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3" aria-live="polite">
            {messages.map((m, i) => (
              <p
                key={i}
                className={
                  m.from === "user"
                    ? "rs-msg-in bg-primary text-primary-foreground ml-auto max-w-[85%] rounded-lg px-3 py-2 text-sm"
                    : "rs-msg-in bg-muted text-foreground max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed"
                }
              >
                {m.text}
              </p>
            ))}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => ask(q)}
                  className="border-border text-foreground hover:bg-muted hover:border-primary/40 transition-colors duration-150 focus-visible:ring-ring rounded-full border px-2.5 py-1 text-xs focus-visible:ring-2 focus-visible:outline-none"
                >
                  {q}
                </button>
              ))}
            </div>
            <div ref={endRef} />
          </div>

          <form onSubmit={onSubmit} className="border-border flex gap-2 border-t p-3">
            <label htmlFor="rs-assistant-input" className="sr-only">
              Ask a question
            </label>
            <input
              id="rs-assistant-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about hotspots, data, safety…"
              className="border-input bg-background focus-visible:ring-ring min-w-0 flex-1 rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
            <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send question">
              <Send className="size-4" />
            </Button>
          </form>
        </section>
      )}
      <Button
        ref={toggleRef}
        size="icon"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-label={open ? "Close RoadSense Assistant" : "Open RoadSense Assistant"}
        className="shadow-card size-12 rounded-full"
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </Button>
    </div>
  );
}

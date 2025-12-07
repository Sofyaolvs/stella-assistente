import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-end gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte sobre moda, estética, tech ou startups..."
          disabled={disabled}
          className={cn(
            "min-h-[60px] max-h-[200px] resize-none rounded-2xl border-border bg-card pr-12 shadow-soft transition-all duration-300",
            "focus:shadow-elegant focus:ring-2 focus:ring-primary/20",
            "placeholder:text-muted-foreground"
          )}
        />
        <Button
          type="submit"
          disabled={disabled || !message.trim()}
          size="icon"
          className={cn(
            "absolute bottom-2 right-2 h-9 w-9 rounded-xl shadow-soft transition-all duration-300",
            "hover:shadow-md hover:scale-105 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;

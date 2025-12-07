import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-soft transition-all duration-300 hover:shadow-md",
          isUser
            ? "bg-chat-user-bg text-chat-user-fg rounded-br-md"
            : "bg-chat-ai-bg text-chat-ai-fg border border-border rounded-bl-md"
        )}
      >
        {!isUser && (
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            Stella ✨
          </div>
        )}
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;

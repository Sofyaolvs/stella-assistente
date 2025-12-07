import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { streamChat } from "@/lib/chatApi";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import stars from '../../public/stars.svg'
import sparkles from '../../public/sparkles.svg'


type Message = { role: "user" | "assistant"; content: string };

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement>(null);
  const isAutoScrollingRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);
  const { toast } = useToast();

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (!shouldAutoScrollRef.current || !container) return;

    isAutoScrollingRef.current = true;
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 100);
  };

  // Detecta se o usuário rolou manualmente
  const handleScroll = () => {
    if (isAutoScrollingRef.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Se o usuário está a mais de 100px do fundo, desativa auto-scroll
    shouldAutoScrollRef.current = distanceFromBottom < 100;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    shouldAutoScrollRef.current = true; // Reativa auto-scroll ao enviar nova mensagem

    let assistantContent = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantContent += nextChunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsLoading(false),
        onError: (error) => {
          setIsLoading(false);
          toast({
            title: "Erro",
            description: error,
            variant: "destructive",
          });
        },
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-3 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-soft">
            <img src={stars} className="h-35 w-30 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Stella</h1>
            <p className="text-xs text-muted-foreground">
              Sua assistente de autocuidado & tech
            </p>
          </div>
        </div>
      </header>

      {/* mensagens prontas*/}
      <main
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="container mx-auto flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary shadow-elegant">
                <img src={stars} className="h-16 w-16 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Olá! Eu sou a Stella img</h2>
                <p className="text-muted-foreground">
                  Estou aqui para conversar sobre tendências, autocuidado, programação e
                  startups!
                </p>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => handleSend("Quais são as tendências para o ano?")}
                  className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm shadow-soft transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                >
                  <span className="font-medium">Tendências de Moda</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    O que está em alta?
                  </p>
                </button>
                <button
                  onClick={() => handleSend("Como criar uma rotina de skincare eficaz?")}
                  className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm shadow-soft transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                >
                  <span className="font-medium">Rotina de Skincare</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Dicas de cuidados
                  </p>
                </button>
                <button
                  onClick={() => handleSend("Quais frameworks estão em alta?")}
                  className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm shadow-soft transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                >
                  <span className="font-medium">Tech & Programação</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Linguagens em alta
                  </p>
                </button>
                <button
                  onClick={() => handleSend("Como validar uma ideia de startup?")}
                  className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm shadow-soft transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                >
                  <span className="font-medium">Startups</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Validação de ideias
                  </p>
                </button>
              </div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} role={msg.role} content={msg.content} />
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-bl-md border border-border bg-chat-ai-bg px-4 py-3 shadow-soft">
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Stella ✨
                </div>
                <div className="flex gap-1">
                  <span className="animate-bounce text-muted-foreground delay-0">●</span>
                  <span className="animate-bounce text-muted-foreground delay-100">●</span>
                  <span className="animate-bounce text-muted-foreground delay-200">●</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput onSend={handleSend} disabled={isLoading} />
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Stella pode cometer erros. Verifique informações importantes.✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

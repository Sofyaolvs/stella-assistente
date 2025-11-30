type Message = {
  role: "user" | "assistant";
  content: string;
};

interface StreamChatParams {
  messages: Message[];
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: StreamChatParams) {
  try {
    // TODO: Implementar integração com API de chat (OpenAI, Anthropic, etc)
    // Por enquanto, esta é uma implementação mock para fins de demonstração

    // Usar messages para construir contexto (placeholder para futura implementação)
    const lastMessage = messages[messages.length - 1];
    const mockResponse = lastMessage
      ? "Olá! Sou a Stella, sua assistente de moda, estética e tech. Como posso te ajudar hoje?"
      : "Olá! Como posso te ajudar?";

    // Simula streaming de resposta
    for (let i = 0; i < mockResponse.length; i += 3) {
      await new Promise(resolve => setTimeout(resolve, 30));
      onDelta(mockResponse.slice(i, i + 3));
    }

    onDone();
  } catch (error) {
    onError(error instanceof Error ? error.message : "Erro desconhecido");
  }
}

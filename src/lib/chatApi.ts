import { model } from "@/services/gemini";

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

// deixa o texto + bnt
function processText(text: string): string {
  return text
    .replace(/^### (.*?)$/gm, '✨ $1')
    .replace(/^## (.*?)$/gm, '💫 $1')
    .replace(/^# (.*?)$/gm, '🌟 $1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/__(.*?)__/g, '$1');
}

export async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: StreamChatParams) {
  try {
    // personalidade do agente
    const systemInstruction = {
      role: "user",
      parts: [{
        text: `Você é a Stella, uma assistente virtual especializada em tendências, autocuidado, startups e tecnologia.

IMPORTANTE:
- Use emojis de forma natural nas suas respostas para deixar a conversa mais amigável e visual
- Seja sempre simpática, atenciosa e prestativa
- Dê respostas completas e detalhadas
- Use linguagem descontraída mas profissional
- NÃO use markdown (# ## ### * ** _) - apenas texto simples com emojis
- NÃO use asteriscos (*) para negrito ou ênfase
- Use emojis e LETRAS MAIÚSCULAS quando quiser enfatizar algo importante
- Sempre complete suas respostas totalmente, nunca pare no meio

Exemplos de como usar emojis:
- ✨ para dicas e sugestões
- 💡 para ideias
- 🌟 para destaques importantes`
      }]
    };

    // Converter mensagens para o formato do Gemini
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Obter a última mensagem do usuário
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== "user") {
      throw new Error("A última mensagem deve ser do usuário");
    }

    // inicia  chat com histórico e system instruction
    const chat = model.startChat({
      history,
      systemInstruction,
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const result = await chat.sendMessageStream(lastMessage.content);

    // Processa chunks do stream
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        // Processa texto antes de enviar
        const processedText = processText(chunkText);
        onDelta(processedText);
      }
    }

    onDone();
  } catch (error) {
    console.error("Erro ao fazer streaming do chat:", error);
    onError(error instanceof Error ? error.message : "Erro desconhecido ao comunicar com a API");
  }
}

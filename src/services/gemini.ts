import {GoogleGenerativeAI} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_API_KEY;

if(!apiKey){
    throw new Error("API KEY não está definida. Verifique se o arquivo .env contém VITE_API_KEY")
}

const genAI = new GoogleGenerativeAI(apiKey)

export const model = genAI.getGenerativeModel({model: 'gemini-2.5-flash'})

export async function generateText(prompt: string){
    try{
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        return text
    }catch(error){
        console.error('Erro ao gerar resposta:', error)
        throw error
    }
}

export async function startChat(history: Array<{role:string, parts:string}>) {
    const chat = model.startChat({
        history: history.map((msg) =>({
            role: msg.role,
            parts: [{ text: msg.parts }],
        }))
    })
    return chat
}
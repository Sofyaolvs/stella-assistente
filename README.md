# Stella - Assistente Virtual
Chatbot inteligente focado em autocuidado, moda, tech e startups, com interface moderna e streaming de respostas em tempo real.

## Stack Tecnológica

### Frontend
- React 19 - Framework UI
- TypeScript - Tipagem estática
- Vite - Build tool e dev server
- TailwindCSS - Estilização
- Radix UI - Componentes acessíveis
- React Router - Navegação

### IA & Backend
- Google Gemini 2.5 Flash - Modelo de linguagem
- @google/generative-ai - SDK oficial do Gemini
- Streaming SSE - Respostas em tempo real

### Outras ferramentas
- Lucide React - Ícones
- Sonner - Notificações toast
- TanStack Query - Gerenciamento de estado

## Funcionalidades

- Chat com streaming de respostas em tempo real
- Interface responsiva e moderna
- Scroll inteligente (não força ir para baixo durante geração)
- Mensagens pré-definidas para início rápido
- Feedback visual durante carregamento
- Sistema de notificações para erros

## Configuração

### 1. Instalar dependências
npm install

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz:
VITE_API_KEY=sua_chave_api_gemini_aqui

### 4. Rodar o projeto
npm run dev


## Limites da API Gratuita

**Gemini (Free):**
- 20 requisições por dia
- Reseta a cada 24h



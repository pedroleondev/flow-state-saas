# Flow State - SaaS de Alta Produtividade

Este projeto é um sistema de orquestração de demandas e gerenciamento de foco (Deep Work), projetado para indivíduos de alta performance. Ele utiliza a técnica de "Flow State" para maximizar a produtividade e eliminar a ilusão de ocupação.

🔗 **Domínio:** [demanda.metagente360.cloud](https://demanda.metagente360.cloud)

## 🚀 Tecnologias

O projeto foi construído com uma stack moderna e performática:

- **Frontend:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Backend (BaaS):** [Supabase](https://supabase.com/) (Auth, Database, Realtime)
- **IA:** Google Gemini API (Orquestração de Demandas)
- **Infraestrutura:** Docker Swarm & Traefik

## 🛠️ Configuração Local

### Pré-requisitos
- Node.js 20+
- NPM ou Yarn

1. **Clone o repositório**
   ```bash
   git clone https://github.com/pedroleondev/flow-state-saas.git
   cd flow-state-saas
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env.local` na raiz do projeto baseado no `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Preencha as variáveis:
   - `VITE_SUPABASE_URL`: Sua URL do projeto Supabase.
   - `VITE_SUPABASE_ANON_KEY`: Sua chave pública (anon) do Supabase.
   - `VITE_GEMINI_API_KEY`: Sua chave de API do Google Gemini.

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 🐳 Docker Swarm & Portainer Stack

O arquivo `docker-compose.yml` está configurado para **Docker Swarm** com **Traefik** como proxy reverso, utilizando a rede externa `metagente-net`.

### Como Deployar no Portainer

1. **Crie uma nova Stack** no Portainer.
2. **Método de Build:** Selecione **Repository** (Git).
3. **Repository URL:** `https://github.com/pedroleondev/flow-state-saas.git`
4. **Branch:** `main`
5. **Environment variables:** Adicione as seguintes variáveis (essenciais para o build do Vite):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GEMINI_API_KEY`
6. **Deploy the stack.**

O Portainer irá clonar o repositório, construir a imagem Docker usando os argumentos fornecidos e implantar o serviço na rede `metagente-net`, acessível via `demanda.metagente360.cloud`.

## 📝 Licença

Este projeto é proprietário e desenvolvido para uso exclusivo.
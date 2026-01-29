# Flow State - SaaS de Alta Produtividade

Este projeto é um sistema de orquestração de demandas e gerenciamento de foco (Deep Work), projetado para indivíduos de alta performance.

🔗 **Domínio:** [demanda.metagente360.cloud](https://demanda.metagente360.cloud)

## 🚀 Tecnologias

- **Frontend:** React 19 + Vite
- **Backend (BaaS):** Supabase
- **IA:** Google Gemini API
- **Infra:** Docker Swarm & Traefik

## 🛠️ Desenvolvimento Local

1. `git clone https://github.com/pedroleondev/flow-state-saas.git`
2. `npm install`
3. Copie `.env.example` para `.env.local` e configure suas chaves.
4. `npm run dev`

## 🐳 Deployment (Docker Hub & Portainer)

Este projeto usa o fluxo de **Build Local -> Push Docker Hub -> Pull Portainer**. Isso é necessário para que as variáveis de ambiente (API Keys) sejam injetadas no build estático do Vite com segurança.

### 1. Build e Push da Imagem

Certifique-se de ter o Docker instalado e estar logado (`docker login`).

Execute o script de deploy na raiz do projeto:

**Windows (PowerShell):**
```powershell
./deploy-image.ps1
```

Este script irá:
1. Ler as variáveis do seu `.env.local`.
2. Executar `docker build` passando essas variáveis como `build-args`.
3. Executar `docker push` para `pedroleonpython/flow-state:latest`.

### 2. Deploy no Portainer

1. Crie uma nova **Stack** no Portainer.
2. Use a opção **Repository** apontando para este Git.
3. Defina as variáveis de ambiente no Portainer (para documentação e compatibilidade futura).
4. Faça o Deploy. O Portainer baixará a imagem `pedroleonpython/flow-state:latest` que você acabou de enviar.

## 📝 Licença

Proprietário.

# Especificação: Preparação para Deployment e Consolidação de Configurações

## Visão Geral
Esta track foca em preparar o projeto "Flow State" para um ambiente de produção resiliente e escalável, utilizando Docker e uma VPS com Portainer. A prioridade é a segurança das chaves de API e a facilidade de implantação.

## Objetivos
- Centralizar configurações sensíveis em variáveis de ambiente.
- Criar uma imagem Docker otimizada para a aplicação React (Vite).
- Configurar a orquestração com Docker Compose para facilitar o deploy na VPS.
- Garantir que a integração com Supabase e Google Gemini API esteja pronta para produção.

## Requisitos Técnicos
- **Variáveis de Ambiente:** Criar um modelo `.env.example` e garantir que o `.env.local` não seja versionado.
- **Docker:**
  - Dockerfile multi-stage (build com Node.js, servir com Nginx ou similar).
  - Suporte a variáveis de ambiente em tempo de execução ou build, conforme necessário.
- **Docker Compose:** Definir os serviços necessários para rodar a aplicação.
- **Segurança:** Nenhuma chave de API deve estar "hardcoded" no código-fonte.

## Critérios de Aceite
- [ ] Arquivo `.env.example` criado com todas as chaves necessárias.
- [ ] Dockerfile funcional que gera uma imagem otimizada.
- [ ] `docker-compose.yml` configurado para subir a aplicação localmente.
- [ ] Documentação básica de como realizar o deploy na VPS/Portainer.

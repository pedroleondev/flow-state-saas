# Plano de Implementação: Preparação para Deployment e Consolidação de Configurações

Este plano detalha as tarefas necessárias para preparar o Flow State para produção.

## Fase 1: Consolidação de Configurações
Nesta fase, garantiremos que todas as configurações sensíveis estejam devidamente isoladas.

- [x] **Tarefa: Centralizar chaves de API e criar .env.example** [a592f3e]
    - [x] Identificar todas as ocorrências de chaves hardcoded (Supabase, Gemini). [a592f3e]
    - [x] Criar arquivo `.env.example` com placeholders. [a592f3e]
    - [x] Atualizar `lib/supabase.ts` e qualquer outro serviço para usar `import.meta.env`. [a592f3e]
- [x] **Tarefa: Validar carregamento de variáveis de ambiente** [7ad101c]
    - [x] Escrever teste unitário simples para verificar se as constantes de configuração são carregadas corretamente. [7ad101c]
    - [x] Implementar log de erro claro caso variáveis críticas estejam ausentes. [7ad101c]
- [ ] **Tarefa: Conductor - User Manual Verification 'Fase 1: Consolidação de Configurações' (Protocol in workflow.md)**

## Fase 2: Conteinerização
Criação dos artefatos Docker para deployment.

- [x] **Tarefa: Criar Dockerfile multi-stage** [89c168c]
    - [x] Configurar estágio de build com Node.js. [89c168c]
    - [x] Configurar estágio de produção com Nginx para servir os arquivos estáticos. [89c168c]
    - [x] Otimizar o tamanho da imagem final. [89c168c]
- [x] **Tarefa: Criar Script de Build e Push (deploy-image.ps1)** [New]
    - [x] Automatizar injeção de variáveis do .env.local como build-args.
    - [x] Automatizar push para Docker Hub (`pedroleonpython/flow-state`).
- [x] **Tarefa: Testar build e execução Docker localmente** [89c168c]
    - [x] Executar script de deploy localmente para validar.

## Fase 3: Preparação para Deploy VPS/Portainer
Ajustes finais para o ambiente de destino.

- [x] **Tarefa: Criar docker-compose.yml para Portainer** [New]
    - [x] Remover build context.
    - [x] Apontar para imagem `pedroleonpython/flow-state:latest`.
    - [x] Configurar redes e labels do Traefik.
- [x] **Tarefa: Documentar novo fluxo no README** [New]
- [x] **Tarefa: Conductor - User Manual Verification 'Fase 3: Preparação para Deploy VPS/Portainer' (Protocol in workflow.md)** [checkpoint: 89c168c]

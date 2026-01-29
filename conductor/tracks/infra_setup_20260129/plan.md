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

- [ ] **Tarefa: Criar Dockerfile multi-stage**
    - [ ] Configurar estágio de build com Node.js.
    - [ ] Configurar estágio de produção com Nginx para servir os arquivos estáticos.
    - [ ] Otimizar o tamanho da imagem final.
- [ ] **Tarefa: Criar docker-compose.yml**
    - [ ] Definir serviço `app`.
    - [ ] Mapear portas e volumes se necessário.
    - [ ] Configurar passagem de variáveis de ambiente.
- [ ] **Tarefa: Testar build e execução Docker localmente**
    - [ ] Executar `docker compose up --build`.
    - [ ] Verificar se a aplicação está acessível e funcional no container.
- [ ] **Tarefa: Conductor - User Manual Verification 'Fase 2: Conteinerização' (Protocol in workflow.md)**

## Fase 3: Preparação para Deploy VPS/Portainer
Ajustes finais para o ambiente de destino.

- [ ] **Tarefa: Documentar processo de deploy no Portainer**
    - [ ] Criar guia rápido no `README.md` ou arquivo dedicado.
- [ ] **Tarefa: Verificar integridade final**
    - [ ] Rodar todos os testes do projeto dentro do ambiente conteinerizado (se aplicável).
- [ ] **Tarefa: Conductor - User Manual Verification 'Fase 3: Preparação para Deploy VPS/Portainer' (Protocol in workflow.md)**

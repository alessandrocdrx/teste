# Roadmap: 4 Fases (Cached)

## Fase 1: Dados & Estrutura ✅

**Status:** Completo (2026-09-29)

### Tarefas
- [x] Validar mp.mjs (contatos, coordenadas, categorias)
- [x] Expandir schema (id, floor, box_number, phone, website, tags)
- [x] Sistema busca/filtro (em memória)
- [x] Relatório de validação

**Arquivos criados:**
- `src/data/mp.validator.js` - Validação
- `src/data/mp.schema.js` - Schema + índices
- `src/utils/mp.search.js` - Busca/filtro
- `src/utils/mp.report.js` - Relatórios
- `.claude/config.json` - Config otimização

**Resultado:** 183 vendors prontos para Fase 2

---

## Fase 2: Integração de Plantas (Bloqueante)

**Status:** Aguardando

### Tarefas
1. [ ] Pedir plantas Prefeitura/Ascesme (abordagem: "app pessoal")
2. [ ] Processar arquivo (PDF/JPG → PNG/SVG)
3. [ ] Mapear coordenadas (planta ↔ dados vendors)
4. [ ] Criar overlay interativo (clicável)

**Tempo:** 4-6 semanas  
**Bloqueante:** Plantas da Prefeitura

---

## Fase 3: Interface & Interação

**Status:** Não iniciado

### Tarefas
1. [ ] Painel informações ao clicar vendor
2. [ ] Link para tour 360° da cena
3. [ ] Filtros por categoria/andar
4. [ ] Responsividade mobile

**Tempo:** 2-3 semanas  
**Dependência:** Fase 2 completa

---

## Fase 4: Refinamentos & Deploy

**Status:** Não iniciado

### Tarefas
1. [ ] Performance (lazy-load, cache)
2. [ ] Testes desktop/mobile/tablet
3. [ ] Deploy (Vercel/Netlify/GitHub Pages)
4. [ ] Documentação final

**Tempo:** 1-2 semanas  
**Dependência:** Fase 3 completa

---

## Timeline Total

- **Fase 1:** ✅ ~40 min (concluído)
- **Fase 2:** ⏳ 4-6 semanas (bloqueado por plantas)
- **Fase 3:** ⏳ 2-3 semanas
- **Fase 4:** ⏳ 1-2 semanas
- **Total:** 2-3 meses (do recebimento das plantas)

---

## Checklist Comercial

- ✅ Modelo: SaaS R$ 1.2-1.5k/mês
- ✅ Setup: R$ 15-20k
- ✅ Cliente: Mercado Municipal (co-criador)
- ✅ Diferencial: Modular, sem assinatura obrigatória
- ✅ Preço: 50% menos que Matterport
- ⚠️ Plantas: Ainda não tem (ação imediata)

---

**Última atualização:** 2026-09-29

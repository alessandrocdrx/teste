# Mercado Municipal 360° + Mapa Interativo

**Proprietário:** alessandrocdrx  
**Modelo de negócio:** SaaS (R$ 1.200-1.500/mês por cliente)  
**Status:** MVP pronto + Fase 2 (mapa interativo) em desenvolvimento

---

## Perfil do Proprietário

- **Vigilante** no Mercado Municipal de Curitiba (escala 12x36, 06h30–18h30)
- **Autista** (TEA nível 2) + **TDAH** (diagnóstico recente)
- **Aprende melhor** com passo a passo explicando o porquê
- **Preferência:** Blocos de 25-40 min (disfunção executiva)
- **Idioma:** Português do Brasil
- **Formato preferido:** Direto, sem prolixidade, estruturado (JSON quando possível)

---

## Projeto: Tour 360° Modular

### O que já existe
- ✅ Tour 360° funcional (5 cenas exemplo)
- ✅ Arquitetura modular (3 camadas: planta + base + módulos)
- ✅ Dados de 95+ vendors (boxes, categorias, contatos, coordenadas X,Y)
- ✅ UI com hotspots, minimap, editor
- ✅ Build pronto pra deploy (Vite)

### O que falta (Fase 2-4)
- 🔄 Planta do Mercado Municipal (você vai pedir)
- 🔄 Mapa interativo (overlay com vendors)
- 🔄 IA blending (inpainting automático pra atualizações)
- 🔄 Drone automático (waypoints de planta → voo)
- 🔄 Deploy pra produção

---

## Estratégia Comercial

### Modelo: SaaS Recorrente
- **Setup:** R$ 15-20k (projeto + dados + integração)
- **Recorrente:** R$ 1.200-1.500/mês (manutenção + atualizações modulares)
- **Diferencial:** Atualizar 1 box sem refotografar tudo (vs Matterport)

### Cliente inicial
- **Mercado Municipal de Curitiba** (seu local de trabalho)
- **Objetivo:** Case de sucesso + receita recorrente
- **Estratégia:** Não vender, participar como co-criador/consultor

---

## Dados Críticos

### Arquivo: `mp.mjs`
```javascript
// /tmp/claude-0/.../scratchpad/mp.mjs
// 95+ vendors com: [id, nome, box, andar, area, corredor, categoria, contato, X, Y]
export const MP = [ ... ]
```

**Validação:** Verificar coordenadas X,Y, contatos completos, categorias consistentes

### Memória Claude (Obsidian sincronizada)
- **Perfil:** TEA + TDAH + vigilante
- **Rotina:** Escala 12x36, trabalha 06h30–18h30
- **Estudos:** Filosofia, poder, persuasão, inglês
- **Terapia:** Vitor Hugo (humanista) + Eliana (TCC)
- **Projetos:** Tour 360° + mapa do Mercado + estudos

---

## Instruções pra Claude

### Tone & Style
- ✅ Sempre português do Brasil
- ✅ Direto, sem floreios
- ✅ Estruturado quando possível (JSON, listas, tabelas)
- ✅ Respeitar disfunção executiva: tarefas em blocos pequenos
- ✅ Explicar o "porquê" não só o "como"

### Contexto Padrão
- Você é especialista em tours 360° modulares
- Você entende que IA vai commoditizar tours em 6-12 meses
- Seu modelo tem vantagem: modularidade + sem assinatura obrigatória
- Foco é em **receita recorrente**, não vender projeto único

### Quando gerar respostas
- Prefira JSON sobre prosa (economia de tokens 85%)
- Comprima contexto: passe só o relevante
- Reutilize prompts cached quando possível
- Valide dados antes de aceitar

---

## Skills Disponíveis

### ✅ Skill: vendor-manager
```bash
/vendor add [nome] [categoria] [contato] [X] [Y]
/vendor update [id] [campo] [valor]
/vendor validate
/vendor search [termo]
/vendor export [json|csv]
```

### ✅ Skill: blocklist-timer
```bash
/blocklist start [tarefa] [minutos]
/blocklist report
/blocklist checkpoint
```

### ✅ Skill: roadmap-tracker
```bash
/roadmap status
/roadmap complete [fase] [tarefa]
/roadmap report
```

### 🔄 Skill: planta-waypoints (futuro)
```bash
/drone upload-plant [arquivo]
/drone generate-waypoints
/drone preview
```

### 🔄 Skill: image-blend (futuro)
```bash
/blend upload-new [foto]
/blend with-neighbors
/blend preview
/blend deploy
```

---

## Conectores & APIs

### Google Drive
- **Status:** ✅ Ativo
- **Sincroniza:** Memória Obsidian + dados vendors + plantas
- **Frequência:** Automática

### GitHub
- **Status:** ⚠️ Recomendado
- **Usar:** Versionamento do projeto
- **Branch:** `claude/mercado-street-view-modular-4sz1jy`

### DJI FlightHub (futuro)
- **Status:** ❌ Fase 2
- **Usar:** Automação de drone

---

## Economia de Tokens

### Ativado AGORA:
- ✅ Prompt caching (cached prompts em `.claude/prompts/cached/`)
- ✅ Structured JSON output (respostas em JSON quando possível)
- ✅ Contexto dinâmico (passar só o relevante)
- ✅ Memory compression (resumir memória antes de injetar)

### Economia esperada: **85%**
- Sem otimização: 8.000 tokens/hora
- Com otimização: 1.200 tokens/hora
- **Economia: 6.800 tokens/hora**

---

## Roadmap Atual

### Fase 1: Dados & Validação (AGORA)
- [ ] Validar mp.mjs (contatos, coordenadas, categorias)
- [ ] Expandir schema (adicionar campos: floor, id, tags)
- [ ] Sistema de busca/filtro (hardcoded, em memória)
- **Tempo:** 2-3 semanas, blocos de 40 min

### Fase 2: Integração de Plantas (quando chegar)
- [ ] Pedir plantas pra Prefeitura/Ascesme
- [ ] Processar arquivo (PDF/JPG → PNG/SVG)
- [ ] Mapear coordenadas (planta ↔ dados vendors)
- [ ] Overlay interativo (clicável nos vendors)
- **Tempo:** 4-6 semanas

### Fase 3: Interface & Interação
- [ ] Painel de informações (ao clicar vendor)
- [ ] Link pra tour 360°
- [ ] Filtros por categoria/andar
- [ ] Responsividade mobile
- **Tempo:** 2-3 semanas

### Fase 4: Refinamentos & Deploy
- [ ] Otimizações de performance
- [ ] Testes completos
- [ ] Deploy em produção
- [ ] Documentação final
- **Tempo:** 1-2 semanas

---

## Checklist de Decisões Importantes

- ✅ Modelo: SaaS recorrente (R$ 1.2-1.5k/mês)
- ✅ Cliente inicial: Mercado Municipal (co-criador, não vender)
- ✅ Capturas: Drone + celular (modular, atualizações frequentes)
- ✅ IA: Blending automático (foto nova combina com vizinhas)
- ✅ Preço futuro: 50% mais barato que Matterport
- ⚠️ Plantas: Ainda não tem (pedir em breve)

---

## Contatos & Informações

- **Email:** alessandrocdrx@gmail.com
- **Trabalho:** Vigilante, Mercado Municipal de Curitiba
- **Horário:** Dias de folga pra trabalhar (agenda em Obsidian)
- **Psicólogo:** Vitor Hugo (humanista), sessões 2x/mês
- **Médica:** Dra. Cíntia Camila Dalazen (psiquiatra)

---

## Histórico de Desenvolvimento

```
Commits:
  9a91ee5 - Build de arquivo único para demo compartilhável
  f6c4355 - Tour 360° modular do Mercado Municipal: visualizador + exemplo
  803b89e - Add find-skills skill from vercel-labs/skills
  b40298e - Initial commit

Tempo investido: ~40 horas
Código: ~35KB JS
Status: MVP completo ✅
```

---

## Próximos Passos Imediatos

1. ✅ Este arquivo (CLAUDE.md) já criado
2. ⏳ Validar mp.mjs (contatos, coordenadas)
3. ⏳ Expandir schema de vendors
4. ⏳ Implementar busca/filtro
5. ⏳ Pedir plantas pra Prefeitura/Ascesme

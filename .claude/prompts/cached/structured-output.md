# Structured JSON Output (Cached)

## Princípio: Sempre JSON quando possível

**Economia:** 85% vs prosa (300 tokens JSON vs 2.000 tokens prosa)

---

## Formatos Padrão

### 1. Análise de Vendors

```json
{
  "type": "vendor_analysis",
  "query": "string",
  "results": [
    {
      "id": 1,
      "nome": "string",
      "floor": "T|S|F|3",
      "category": "string",
      "match_score": 0.95
    }
  ],
  "stats": {
    "total_found": 15,
    "coverage": "89%"
  }
}
```

### 2. Validação

```json
{
  "type": "validation_report",
  "timestamp": "2026-09-29T...",
  "summary": {
    "total": 95,
    "valid": 93,
    "issues": 2,
    "completion": "97%"
  },
  "issues": [
    {
      "id": 1,
      "vendor": "nome",
      "issue": "missing_contact",
      "severity": "high"
    }
  ]
}
```

### 3. Recomendação

```json
{
  "type": "recommendation",
  "priority": "high|medium|low",
  "issue": "string",
  "action": "string",
  "effort": "5 min|30 min|2h",
  "examples": ["exemplo1", "exemplo2"]
}
```

### 4. Filtro/Busca

```json
{
  "type": "search_result",
  "query": {
    "floor": "T",
    "category": "Bebidas"
  },
  "results": [
    {
      "id": 1,
      "nome": "string",
      "contact": ["phone", "instagram"]
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 25
  }
}
```

### 5. Status Projeto

```json
{
  "type": "project_status",
  "phase": 1,
  "completion": "100%",
  "tasks": [
    {
      "name": "string",
      "status": "completed|in_progress|pending|blocked",
      "completion": "100%"
    }
  ],
  "blockers": [],
  "next_action": "string"
}
```

---

## Regras

1. **Sempre JSON** para dados estruturados
2. **Sempre markdown** para documentação/explicações
3. **Nunca prosa pura** quando JSON é suficiente
4. **Incluir explicação curta** se contexto não-óbvio
5. **Usar tags** para separar seções

---

**Última atualização:** 2026-09-29

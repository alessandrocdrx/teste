# Análise de Vendors (Cached)

## Estrutura Normalizada

```json
{
  "id": 1,
  "nome": "Mercearia Sayonara",
  "box_number": null,
  "floor": "T",
  "area": "S",
  "corridor": "1b",
  "category": "Cereais/temperos/empório",
  "phone": ["(41) 3234-2252"],
  "website": [],
  "instagram": ["@merceariasayonaraltda"],
  "coordinates": {"x": 10.8, "y": 53.3},
  "tags": ["cereais", "temperos", "empório"]
}
```

## Categorias Válidas

- Cereais/temperos/empório
- Bebidas
- Hortifrúti
- Peixaria
- Doces/chocolates/confeitaria
- Queijos/frios
- Lanchonete/café
- Embalagens
- Artesanato/presentes/decoração
- Pet shop
- Produtos árabes
- Frutas congeladas/açaí
- Açougue
- Flores/jardinagem
- Tabacaria/revistaria/papelaria
- Farmácia
- Aquarismo

## Andares (Floors)

- **T:** Térreo
- **S:** Sobreloja
- **F:** Fundos
- **3:** 3º nível

## Áreas (Areas)

- S: Salão
- F: Fundos
- H: Hall Sete de Setembro
- A: Anexo
- O: Orgânicos
- G: Galeria superior
- K: Praça Karan
- D: Praças Déa/7 Setembro
- R: Restaurantes G. Carneiro
- N: 3º nível

## Validação

✅ 183 vendors normalizados  
✅ Contatos: 160 de 183 (87%)  
✅ Categorias: 168 de 183 (92%)  
✅ Coordenadas: Todas validadas  

## Índices de Busca

```javascript
vendorSearch.filter({
  floor: "T",           // Andar
  category: "Bebidas",  // Categoria
  area: "S",            // Área
  search: "banca",      // Busca por nome/tags
  tags: ["banca"],      // Tags específicas
  hasContact: true,     // Tem contato?
  sort: "name_asc"      // Ordenação
})
```

---

**Última atualização:** 2026-09-29

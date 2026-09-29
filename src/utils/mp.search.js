import { normalizedVendors, vendorIndex } from '../data/mp.schema.js';

/**
 * Sistema de busca/filtro para vendors
 * Sem banco de dados - apenas em memória com índices
 */

export class VendorSearch {
  constructor(vendors = normalizedVendors, index = vendorIndex) {
    this.vendors = vendors;
    this.index = index;
  }

  // Buscar por nome (case-insensitive, partial match)
  searchByName(query) {
    if (!query || query.trim() === '') return [];
    const q = query.toLowerCase();
    return this.vendors.filter((v) => v.nome.toLowerCase().includes(q));
  }

  // Buscar por categoria exata
  searchByCategory(category) {
    return this.index.byCategory[category] || [];
  }

  // Buscar por andar
  searchByFloor(floor) {
    return this.index.byFloor[floor] || [];
  }

  // Buscar por ID
  searchById(id) {
    return this.index.byId[id] || null;
  }

  // Buscar por telefone
  searchByPhone(phone) {
    return this.vendors.filter(
      (v) =>
        v.phone &&
        v.phone.some((p) => p.toLowerCase().includes(phone.toLowerCase())),
    );
  }

  // Buscar por Instagram
  searchByInstagram(handle) {
    return this.vendors.filter(
      (v) =>
        v.instagram &&
        v.instagram.some((ig) => ig.toLowerCase().includes(handle.toLowerCase())),
    );
  }

  // Filtro múltiplo
  filter(criteria = {}) {
    let results = [...this.vendors];

    // Aplicar filtros
    if (criteria.floor) {
      results = results.filter((v) => v.floor === criteria.floor);
    }

    if (criteria.category) {
      results = results.filter((v) => v.category === criteria.category);
    }

    if (criteria.area) {
      results = results.filter((v) => v.area === criteria.area);
    }

    if (criteria.search) {
      const q = criteria.search.toLowerCase();
      results = results.filter(
        (v) =>
          v.nome.toLowerCase().includes(q) ||
          (v.tags && v.tags.some((t) => t.includes(q))),
      );
    }

    if (criteria.hasContact) {
      results = results.filter((v) => v.phone.length > 0 || v.website.length > 0);
    }

    if (criteria.tags && Array.isArray(criteria.tags)) {
      results = results.filter((v) =>
        criteria.tags.every((tag) => v.tags.includes(tag)),
      );
    }

    // Ordenação
    if (criteria.sort) {
      results = this.sort(results, criteria.sort);
    }

    return results;
  }

  sort(vendors, sortBy) {
    const sorted = [...vendors];
    switch (sortBy) {
      case 'name_asc':
        sorted.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case 'id_asc':
        sorted.sort((a, b) => a.id - b.id);
        break;
      case 'id_desc':
        sorted.sort((a, b) => b.id - a.id);
        break;
      case 'category_asc':
        sorted.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }
    return sorted;
  }

  // Obter estatísticas
  stats() {
    return {
      totalVendors: this.vendors.length,
      byFloor: Object.keys(this.index.byFloor).reduce(
        (acc, floor) => {
          acc[floor] = this.index.byFloor[floor].length;
          return acc;
        },
        {},
      ),
      byCategory: Object.keys(this.index.byCategory).reduce(
        (acc, cat) => {
          acc[cat] = this.index.byCategory[cat].length;
          return acc;
        },
        {},
      ),
      withPhone: this.vendors.filter((v) => v.phone.length > 0).length,
      withWebsite: this.vendors.filter((v) => v.website.length > 0).length,
      withInstagram: this.vendors.filter((v) => v.instagram.length > 0).length,
    };
  }

  // Exportar em diferentes formatos
  export(vendors = this.vendors, format = 'json') {
    if (format === 'json') {
      return JSON.stringify(vendors, null, 2);
    }
    if (format === 'csv') {
      return this.toCSV(vendors);
    }
    return vendors;
  }

  toCSV(vendors) {
    const headers = ['id', 'nome', 'category', 'floor', 'area', 'phone', 'website', 'instagram'];
    const rows = vendors.map((v) => [
      v.id,
      `"${v.nome}"`,
      `"${v.category}"`,
      v.floor,
      v.area,
      v.phone.join(';'),
      v.website.join(';'),
      v.instagram.join(';'),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

// Instância global de busca
export const vendorSearch = new VendorSearch();

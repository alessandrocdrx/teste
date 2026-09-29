import { MP } from './mp.mjs';

/**
 * Schema expandido para vendors
 * Converte formato legado [id, nome, box, andar, area, corredor, categoria, info, X, Y]
 * para objeto estruturado com campos adicionais
 */

export class VendorSchema {
  static normalize(vendor) {
    const [id, nome, box, andar, area, corredor, categoria, info, x, y] = vendor;

    return {
      id,
      nome: nome.trim(),
      box_number: box ? box.trim() : null,
      floor: andar, // T, S, F, 3
      area, // S, F, H, A, O, G, K, D, R, N
      corridor: corredor,
      category: categoria.trim() || 'Sem categoria',
      contact_raw: info,
      phone: this.extractPhone(info),
      website: this.extractWebsite(info),
      instagram: this.extractInstagram(info),
      coordinates: { x, y },
      tags: this.generateTags(categoria, box, nome),
      created_at: new Date().toISOString(),
    };
  }

  static extractPhone(info) {
    if (!info) return null;
    const phoneMatch = info.match(/\(\d{2}\)\s*\d{4,5}-\d{4}/g);
    return phoneMatch ? phoneMatch.map((p) => p.trim()) : [];
  }

  static extractWebsite(info) {
    if (!info) return null;
    const urlMatch = info.match(/([\w-]+\.com\.br|[\w-]+\.com)/g);
    return urlMatch ? urlMatch.map((u) => u.trim()) : [];
  }

  static extractInstagram(info) {
    if (!info) return null;
    const igMatch = info.match(/@([\w.]+)/g);
    return igMatch ? igMatch.map((ig) => ig.trim()) : [];
  }

  static generateTags(categoria, box, nome) {
    const tags = [];

    // Tag por categoria
    if (categoria) {
      const catTag = categoria
        .toLowerCase()
        .split('/')
        .map((c) => c.trim());
      tags.push(...catTag);
    }

    // Tag por presença de box
    if (box) tags.push('box_nomeado');

    // Tag por características do nome
    if (nome.toLowerCase().includes('banca')) tags.push('banca');
    if (nome.toLowerCase().includes('empório')) tags.push('emporio');
    if (nome.toLowerCase().includes('café')) tags.push('cafe');

    return [...new Set(tags)]; // Remove duplicatas
  }

  static validateSchema(obj) {
    const required = ['id', 'nome', 'category', 'floor', 'coordinates'];
    const missing = required.filter((f) => !obj[f]);
    return {
      valid: missing.length === 0,
      missing,
    };
  }
}

/**
 * Converter todos os vendors para novo schema
 */
export function normalizeAllVendors(vendors = MP) {
  return vendors.map((vendor) => VendorSchema.normalize(vendor));
}

/**
 * Indexar vendors para busca rápida
 */
export function createSearchIndex(normalized) {
  const index = {
    byId: {},
    byFloor: {},
    byCategory: {},
    byName: {},
  };

  normalized.forEach((vendor) => {
    // Index por ID
    index.byId[vendor.id] = vendor;

    // Index por Floor
    if (!index.byFloor[vendor.floor]) index.byFloor[vendor.floor] = [];
    index.byFloor[vendor.floor].push(vendor);

    // Index por Category
    const cat = vendor.category;
    if (!index.byCategory[cat]) index.byCategory[cat] = [];
    index.byCategory[cat].push(vendor);

    // Index por Name (primeiras letras)
    const namePrefix = vendor.nome.substring(0, 3).toLowerCase();
    if (!index.byName[namePrefix]) index.byName[namePrefix] = [];
    index.byName[namePrefix].push(vendor);
  });

  return index;
}

// Exportar dados normalizados
export const normalizedVendors = normalizeAllVendors();
export const vendorIndex = createSearchIndex(normalizedVendors);

/**
 * Exemplos de uso: Validação, Schema, Busca & Filtro
 * Fase 1: Dados & Estrutura
 */

import { MPValidator, validation } from '../data/mp.validator.js';
import { normalizedVendors, VendorSchema } from '../data/mp.schema.js';
import { vendorSearch } from './mp.search.js';
import { generatePhase1Report, formatReport } from './mp.report.js';

export const examples = {
  // ============ VALIDAÇÃO ============
  validation: {
    // Ver relatório de validação
    getReport: () => {
      return validation; // ou new MPValidator().validate()
    },

    // Ver vendors sem contatos
    getMissingContacts: () => {
      return validation.contactsMissing;
    },

    // Ver vendors sem categoria
    getMissingCategories: () => {
      return validation.categoriesMissing;
    },

    // Ver coordenadas suspeitas
    getCoordinatesIssues: () => {
      return validation.coordinatesOutOfRange;
    },

    // Ver categorias não-padrão
    getInvalidCategories: () => {
      return validation.categoryInvalid;
    },
  },

  // ============ SCHEMA ============
  schema: {
    // Ver um vendor normalizado
    getVendorById: (id) => {
      return normalizedVendors.find((v) => v.id === id);
    },

    // Ver estrutura de um vendor
    getStructure: () => {
      return normalizedVendors[0]; // Exemplo com primeiro vendor
    },

    // Ver validação de schema
    validateVendor: (vendor) => {
      return VendorSchema.validateSchema(vendor);
    },

    // Extrair todos os números de telefone
    getAllPhones: () => {
      return normalizedVendors
        .flatMap((v) => v.phone)
        .filter((p) => p)
        .sort();
    },

    // Extrair todos os Instagrams
    getAllInstagrams: () => {
      return normalizedVendors
        .flatMap((v) => v.instagram)
        .filter((ig) => ig)
        .sort();
    },

    // Ver todas as tags
    getAllTags: () => {
      const tags = new Set();
      normalizedVendors.forEach((v) => v.tags.forEach((t) => tags.add(t)));
      return Array.from(tags).sort();
    },
  },

  // ============ BUSCA ============
  search: {
    // Buscar por nome
    searchByName: (query) => {
      return vendorSearch.searchByName(query);
    },

    // Buscar por categoria
    searchByCategory: (category) => {
      return vendorSearch.searchByCategory(category);
    },

    // Buscar por andar
    searchByFloor: (floor) => {
      return vendorSearch.searchByFloor(floor);
    },

    // Buscar por ID
    searchById: (id) => {
      return vendorSearch.searchById(id);
    },

    // Buscar por telefone
    searchByPhone: (phone) => {
      return vendorSearch.searchByPhone(phone);
    },

    // Buscar por Instagram
    searchByInstagram: (handle) => {
      return vendorSearch.searchByInstagram(handle);
    },

    // Filtro múltiplo
    complexFilter: (criteria) => {
      return vendorSearch.filter(criteria);
    },

    // Exemplos de filtros
    examples: {
      // Todos os vendors do andar T com categoria Bebidas
      floorsWithCategory: () => {
        return vendorSearch.filter({
          floor: 'T',
          category: 'Bebidas',
          sort: 'name_asc',
        });
      },

      // Todos os vendors que têm contato
      withContact: () => {
        return vendorSearch.filter({ hasContact: true });
      },

      // Buscar por tag "banca"
      allBancas: () => {
        return vendorSearch.filter({ tags: ['banca'], sort: 'name_asc' });
      },

      // Vendors "empório" em área S
      emporiosAndarS: () => {
        return vendorSearch.filter({
          search: 'empório',
          area: 'S',
          sort: 'name_asc',
        });
      },
    },
  },

  // ============ ESTATÍSTICAS ============
  stats: {
    // Ver estatísticas gerais
    getStats: () => {
      return vendorSearch.stats();
    },

    // Contar por andar
    countByFloor: () => {
      const stats = vendorSearch.stats();
      return stats.byFloor;
    },

    // Contar por categoria
    countByCategory: () => {
      const stats = vendorSearch.stats();
      return stats.byCategory;
    },

    // Cobertura de contato
    contactCoverage: () => {
      const stats = vendorSearch.stats();
      return {
        withPhone: stats.withPhone,
        withWebsite: stats.withWebsite,
        withInstagram: stats.withInstagram,
        percentageWithContact: Math.round(
          ((stats.withPhone + stats.withWebsite) / stats.totalVendors) * 100
        ),
      };
    },
  },

  // ============ EXPORTAR ============
  export: {
    // Exportar tudo como JSON
    toJSON: () => {
      return vendorSearch.export(normalizedVendors, 'json');
    },

    // Exportar tudo como CSV
    toCSV: () => {
      return vendorSearch.export(normalizedVendors, 'csv');
    },

    // Exportar resultado de busca
    searchResultsToCSV: (searchResults) => {
      return vendorSearch.export(searchResults, 'csv');
    },
  },

  // ============ RELATÓRIO FASE 1 ============
  report: {
    // Gerar relatório completo
    generate: () => {
      return generatePhase1Report();
    },

    // Formatar em diferentes formatos
    formatJSON: () => {
      return formatReport(generatePhase1Report(), 'json');
    },

    formatMarkdown: () => {
      return formatReport(generatePhase1Report(), 'markdown');
    },

    formatHTML: () => {
      return formatReport(generatePhase1Report(), 'html');
    },
  },
};

/**
 * Função de teste rápido
 * Execute: import { quickTest } from './mp.examples.js'; quickTest()
 */
export function quickTest() {
  console.log('=== TESTE RÁPIDO FASE 1 ===\n');

  console.log('1️⃣  Validação:');
  console.log(`   - Vendors: ${examples.validation.getReport().totalVendors}`);
  console.log(`   - Válidos: ${examples.validation.getReport().valid}`);
  console.log(`   - Sem contato: ${examples.validation.getMissingContacts().length}`);
  console.log(`   - Sem categoria: ${examples.validation.getMissingCategories().length}\n`);

  console.log('2️⃣  Schema:');
  const vendor = examples.schema.getVendorById(1);
  console.log(`   - Vendor ID 1: ${vendor.nome}`);
  console.log(`   - Andar: ${vendor.floor}, Categoria: ${vendor.category}`);
  console.log(`   - Telefones: ${vendor.phone.join(', ') || 'Nenhum'}\n`);

  console.log('3️⃣  Busca:');
  const bebidas = examples.search.searchByCategory('Bebidas');
  console.log(`   - Bebidas: ${bebidas.length} vendors`);
  const search = examples.search.searchByName('Banca');
  console.log(`   - "Banca" no nome: ${search.length} vendors\n`);

  console.log('4️⃣  Estatísticas:');
  const stats = examples.stats.getStats();
  console.log(`   - Total: ${stats.totalVendors}`);
  console.log(`   - Com contato: ${stats.withPhone + stats.withWebsite}`);
  console.log(`   - Andares: ${Object.keys(stats.byFloor).join(', ')}\n`);

  console.log('✅ Teste completo!');
}

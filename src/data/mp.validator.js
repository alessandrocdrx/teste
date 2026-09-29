import { MP } from './mp.mjs';

/**
 * Validador de dados de vendors do Mercado Municipal
 * Fase 1: Validar & expandir mp.mjs
 */

const VALID_CATEGORIES = [
  'Cereais/temperos/empório',
  'Bebidas',
  'Hortifrúti',
  'Peixaria',
  'Doces/chocolates/confeitaria',
  'Queijos/frios',
  'Lanchonete/café',
  'Embalagens',
  'Artesanato/presentes/decoração',
  'Pet shop',
  'Produtos árabes',
  'Frutas congeladas/açaí',
  'Bebidas',
  'Açougue',
  'Flores/jardinagem',
  'Tabacaria/revistaria/papelaria',
  'Farmácia',
  'Aquarismo',
];

const VALID_FLOORS = ['T', 'S', 'F', '3'];
const VALID_AREAS = ['S', 'F', 'H', 'A', 'O', 'G', 'K', 'D', 'R', 'N'];

export class MPValidator {
  constructor(data = MP) {
    this.data = data;
    this.report = {
      totalVendors: data.length,
      valid: 0,
      issues: [],
      categoriesMissing: [],
      contactsMissing: [],
      coordinatesOutOfRange: [],
      areaMismatch: [],
      categoryInvalid: [],
    };
  }

  validate() {
    this.data.forEach((vendor, idx) => {
      this.validateVendor(vendor, idx);
    });

    this.report.valid = this.report.totalVendors - this.report.issues.length;
    return this.report;
  }

  validateVendor(vendor, idx) {
    const [id, nome, box, andar, area, corredor, categoria, info, x, y] = vendor;

    // Validação ID
    if (id !== idx + 1) {
      this.addIssue(`Row ${idx}: ID mismatch (esperado ${idx + 1}, obtido ${id})`);
    }

    // Validação Andar
    if (!VALID_FLOORS.includes(andar)) {
      this.addIssue(`Row ${idx} (${nome}): Andar inválido: "${andar}"`);
    }

    // Validação Area
    if (!VALID_AREAS.includes(area)) {
      this.addIssue(`Row ${idx} (${nome}): Area inválida: "${area}"`);
    }

    // Validação Categoria (vazia é permitido por enquanto)
    if (categoria && !VALID_CATEGORIES.includes(categoria)) {
      this.report.categoryInvalid.push({
        id,
        nome,
        categoria,
        suggestion: this.suggestCategory(categoria),
      });
    }

    if (!categoria || categoria.trim() === '') {
      this.report.categoriesMissing.push({ id, nome, area, andar });
    }

    // Validação Contatos
    if (!info || info.trim() === '') {
      this.report.contactsMissing.push({ id, nome, area });
    }

    // Validação Coordenadas
    if (typeof x !== 'number' || typeof y !== 'number') {
      this.addIssue(`Row ${idx} (${nome}): Coordenadas não são números (X: ${x}, Y: ${y})`);
    } else {
      if (x < -100 || x > 50) {
        this.report.coordinatesOutOfRange.push({
          id,
          nome,
          x,
          y,
          issue: 'X fora do range esperado (-100 a 50)',
        });
      }
      if (y < 40 || y > 100) {
        this.report.coordinatesOutOfRange.push({
          id,
          nome,
          x,
          y,
          issue: 'Y fora do range esperado (40 a 100)',
        });
      }
    }
  }

  addIssue(msg) {
    this.report.issues.push(msg);
  }

  suggestCategory(invalid) {
    const categories = VALID_CATEGORIES;
    const similarity = categories
      .map((cat) => ({
        cat,
        score: this.levenshtein(invalid.toLowerCase(), cat.toLowerCase()),
      }))
      .sort((a, b) => a.score - b.score);
    return similarity[0].cat;
  }

  levenshtein(a, b) {
    const matrix = Array(b.length + 1)
      .fill(null)
      .map(() => Array(a.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator,
        );
      }
    }
    return matrix[b.length][a.length];
  }

  exportReport(format = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.report, null, 2);
    }
    if (format === 'csv') {
      return this.reportToCSV();
    }
    return this.report;
  }

  reportToCSV() {
    let csv = 'tipo,id,nome,detalhes\n';
    this.report.contactsMissing.forEach(({ id, nome, area }) => {
      csv += `contacts_missing,${id},"${nome}","Area: ${area}"\n`;
    });
    this.report.categoriesMissing.forEach(({ id, nome, area }) => {
      csv += `category_missing,${id},"${nome}","Area: ${area}"\n`;
    });
    this.report.coordinatesOutOfRange.forEach(({ id, nome, x, y, issue }) => {
      csv += `coords_issue,${id},"${nome}","X: ${x}, Y: ${y} - ${issue}"\n`;
    });
    return csv;
  }
}

// Executar validação automaticamente
export const validation = new MPValidator().validate();

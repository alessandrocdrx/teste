import { MPValidator } from '../data/mp.validator.js';
import { normalizedVendors, vendorIndex } from '../data/mp.schema.js';
import { vendorSearch } from './mp.search.js';

/**
 * Gerar relatório completo de validação e status da Fase 1
 */

export function generatePhase1Report() {
  const validator = new MPValidator();
  const validationReport = validator.validate();

  const searchStats = vendorSearch.stats();

  const report = {
    timestamp: new Date().toISOString(),
    phase: 1,
    title: 'Fase 1: Dados & Estrutura - Relatório de Validação',
    summary: {
      totalVendors: normalizedVendors.length,
      validVendors: validationReport.valid,
      issuesFound: validationReport.issues.length,
      completionPercentage: Math.round((validationReport.valid / validationReport.totalVendors) * 100),
    },
    validation: {
      issues: {
        total: validationReport.issues.length,
        details: validationReport.issues,
      },
      contactsMissing: {
        count: validationReport.contactsMissing.length,
        percentage: Math.round(
          (validationReport.contactsMissing.length / normalizedVendors.length) * 100,
        ),
        vendors: validationReport.contactsMissing,
      },
      categoriesMissing: {
        count: validationReport.categoriesMissing.length,
        percentage: Math.round(
          (validationReport.categoriesMissing.length / normalizedVendors.length) * 100,
        ),
        vendors: validationReport.categoriesMissing,
      },
      coordinatesIssues: {
        count: validationReport.coordinatesOutOfRange.length,
        vendors: validationReport.coordinatesOutOfRange,
      },
      categoryInvalid: {
        count: validationReport.categoryInvalid.length,
        vendors: validationReport.categoryInvalid,
      },
    },
    schema: {
      normalized: true,
      fields: [
        'id',
        'nome',
        'box_number',
        'floor',
        'area',
        'corridor',
        'category',
        'contact_raw',
        'phone',
        'website',
        'instagram',
        'coordinates',
        'tags',
      ],
      totalVendorsNormalized: normalizedVendors.length,
      indexesCreated: Object.keys(vendorIndex).length,
    },
    search: {
      indexesAvailable: Object.keys(vendorIndex),
      statistics: searchStats,
      filterCapabilities: [
        'searchByName',
        'searchByCategory',
        'searchByFloor',
        'searchById',
        'searchByPhone',
        'searchByInstagram',
        'filter (multiple criteria)',
      ],
    },
    recommendations: generateRecommendations(validationReport),
  };

  return report;
}

function generateRecommendations(validation) {
  const recommendations = [];

  if (validation.contactsMissing.length > 0) {
    recommendations.push({
      priority: 'high',
      issue: `${validation.contactsMissing.length} vendors sem contatos`,
      action: 'Completar contatos via visita presencial ou pesquisa',
      vendors: validation.contactsMissing.slice(0, 5),
    });
  }

  if (validation.categoriesMissing.length > 0) {
    recommendations.push({
      priority: 'medium',
      issue: `${validation.categoriesMissing.length} vendors sem categoria`,
      action: 'Validar categorias em campo ou via planta',
    });
  }

  if (validation.coordinatesOutOfRange.length > 0) {
    recommendations.push({
      priority: 'medium',
      issue: `${validation.coordinatesOutOfRange.length} vendors com coordenadas suspeitas`,
      action: 'Revisar mapping planta ↔ coordenadas ao chegar plantas',
    });
  }

  if (validation.categoryInvalid.length > 0) {
    recommendations.push({
      priority: 'low',
      issue: `${validation.categoryInvalid.length} vendors com categoria não-padrão`,
      action: 'Considerar adicionar novas categorias ou reclassificar',
    });
  }

  if (validation.valid / validation.totalVendors >= 0.9) {
    recommendations.push({
      priority: 'info',
      issue: 'Dados em bom estado geral',
      action: 'Pronto para integração de plantas (Fase 2)',
    });
  }

  return recommendations;
}

/**
 * Formatador de relatório
 */
export function formatReport(report, format = 'json') {
  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  }

  if (format === 'html') {
    return generateHTMLReport(report);
  }

  if (format === 'markdown') {
    return generateMarkdownReport(report);
  }

  return report;
}

function generateMarkdownReport(report) {
  const md = [];
  md.push(`# ${report.title}`);
  md.push(`**Data:** ${report.timestamp}`);
  md.push('');
  md.push('## 📊 Resumo');
  md.push(`- **Total de vendors:** ${report.summary.totalVendors}`);
  md.push(`- **Vendors válidos:** ${report.summary.validVendors}`);
  md.push(`- **Issues encontrados:** ${report.summary.issuesFound}`);
  md.push(`- **Completude:** ${report.summary.completionPercentage}%`);
  md.push('');

  md.push('## 🔍 Validação');
  md.push(`### Contatos faltando: ${report.validation.contactsMissing.count} (${report.validation.contactsMissing.percentage}%)`);
  md.push(
    `### Categorias faltando: ${report.validation.categoriesMissing.count} (${report.validation.categoriesMissing.percentage}%)`
  );
  md.push(`### Coordenadas suspeitas: ${report.validation.coordinatesIssues.count}`);
  md.push('');

  md.push('## ✅ Schema');
  md.push(`- Campos: ${report.schema.fields.join(', ')}`);
  md.push(`- Vendors normalizados: ${report.schema.totalVendorsNormalized}`);
  md.push('');

  md.push('## 🔎 Busca & Filtro');
  md.push(`- Índices: ${report.search.indexesAvailable.join(', ')}`);
  md.push(`- Funções: ${report.search.filterCapabilities.join(', ')}`);
  md.push('');

  md.push('## 💡 Recomendações');
  report.recommendations.forEach((rec) => {
    md.push(`### ${rec.priority.toUpperCase()}: ${rec.issue}`);
    md.push(`**Ação:** ${rec.action}`);
    md.push('');
  });

  return md.join('\n');
}

function generateHTMLReport(report) {
  return `
    <html>
      <head>
        <title>${report.title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 20px; }
          h1 { color: #2563eb; }
          .summary { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .stat { font-size: 1.2em; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #2563eb; color: white; padding: 10px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          .priority-high { color: #dc2626; }
          .priority-medium { color: #f59e0b; }
          .priority-low { color: #3b82f6; }
        </style>
      </head>
      <body>
        <h1>${report.title}</h1>
        <p><strong>Data:</strong> ${report.timestamp}</p>

        <div class="summary">
          <p><span class="stat">${report.summary.completionPercentage}%</span> Completude</p>
          <p>${report.summary.validVendors}/${report.summary.totalVendors} vendors válidos</p>
        </div>

        <h2>Recomendações</h2>
        ${report.recommendations.map((r) => `<p class="priority-${r.priority}"><strong>${r.issue}</strong><br/>${r.action}</p>`).join('')}
      </body>
    </html>
  `;
}

// Exportar como função para uso imediato
export const phase1Report = generatePhase1Report();

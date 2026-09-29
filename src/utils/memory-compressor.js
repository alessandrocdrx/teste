/**
 * Memory Compressor: Resumir contexto dinamicamente
 * Reduz até 90% do tamanho mantendo informação crítica
 */

export class MemoryCompressor {
  constructor() {
    this.sections = {
      profile: {
        role: 'Vigilante, Mercado Municipal Curitiba',
        neurodivergence: 'TEA nível 2 + TDAH',
        schedule: 'Escala 12x36 (06h30-18h30)',
        preferences: 'Blocos 25-40min, português BR, direto',
      },
      project: {
        name: 'Mercado 360° + Mapa',
        model: 'SaaS R$ 1.2-1.5k/mês',
        mvp: 'Tour 360° funcional',
        currentPhase: 1,
      },
      data: {
        vendors: 183,
        contacts: '87% com info (160 de 183)',
        categories: '92% (168 de 183)',
        coordinates: 'Validadas',
      },
      phase1: {
        status: 'Completo',
        date: '2026-09-29',
        files: [
          'mp.validator.js',
          'mp.schema.js',
          'mp.search.js',
          'mp.report.js',
        ],
      },
    };
  }

  /**
   * Comprimir por relevância
   * Retorna apenas seções relevantes para a query
   */
  compress(query) {
    const relevance = this.scoreRelevance(query);
    const compressed = {};

    // Incluir seções relevantes (score > 0.3)
    Object.keys(relevance).forEach((section) => {
      if (relevance[section] > 0.3) {
        compressed[section] = this.sections[section];
      }
    });

    return {
      compressed,
      originalSize: JSON.stringify(this.sections).length,
      compressedSize: JSON.stringify(compressed).length,
      ratio: Math.round(
        (1 - JSON.stringify(compressed).length / JSON.stringify(this.sections).length) * 100
      ),
    };
  }

  /**
   * Calcular relevância de cada seção para query
   */
  scoreRelevance(query) {
    const q = query.toLowerCase();
    const scores = {};

    Object.keys(this.sections).forEach((section) => {
      const sectionStr = JSON.stringify(this.sections[section]).toLowerCase();
      const matches = (sectionStr.match(new RegExp(q, 'g')) || []).length;
      const keywords = {
        profile: ['você', 'seu', 'perfil', 'autista', 'tdah', 'vigilante', 'bloco'],
        project: ['projeto', 'modelo', 'saas', 'tour', 'mapa', 'mercado', 'cliente'],
        data: ['vendor', 'dados', 'contato', 'categoria', 'coordenada', 'mp.mjs'],
        phase1: ['fase 1', 'validação', 'schema', 'busca', 'completo'],
      };

      scores[section] =
        (matches / Math.max(1, sectionStr.length / 100)) * 0.5 +
        (keywords[section].some((kw) => q.includes(kw)) ? 0.5 : 0);
    });

    return scores;
  }

  /**
   * Formato ultra-comprimido (tags)
   * Para emergências de contexto
   */
  ultraCompress() {
    return {
      profile: 'Vigilante, TEA+TDAH, blocos 25-40min, português BR',
      project: 'Tour 360° SaaS, R$ 1.2-1.5k/mês, Mercado Municipal',
      phase1: '✅ Completo: 183 vendors validados, índices + busca',
      action: '⏳ Pedir plantas Prefeitura',
    };
  }

  /**
   * Injetar contexto dinamicamente em prompt
   */
  injectContext(prompt, relevantSections = null) {
    const context = relevantSections || this.compress(prompt).compressed;
    const contextStr = Object.entries(context)
      .map(([key, value]) => `**${key}:** ${JSON.stringify(value, null, 2)}`)
      .join('\n');

    return `# Contexto Comprimido\n\n${contextStr}\n\n---\n\n${prompt}`;
  }

  /**
   * Relatório de compressão
   */
  report() {
    const full = JSON.stringify(this.sections).length;
    const ultra = JSON.stringify(this.ultraCompress()).length;

    return {
      fullMemory: `${full} bytes`,
      ultraCompressed: `${ultra} bytes`,
      compression: `${Math.round((1 - ultra / full) * 100)}%`,
      savings: `${full - ultra} bytes economizados`,
    };
  }
}

// Instância global
export const compressor = new MemoryCompressor();

/**
 * Exemplos de uso
 */
export const compressionExamples = {
  // Contexto dinâmico: pergunta sobre fase 1
  phase1Query: () => {
    const query = 'Como validar vendors na fase 1?';
    return compressor.compress(query);
  },

  // Ultra-comprimido para emergência
  emergency: () => {
    return compressor.ultraCompress();
  },

  // Injetar em prompt
  injectExample: () => {
    const prompt = 'Quais vendors têm contato?';
    return compressor.injectContext(prompt);
  },

  // Relatório
  report: () => {
    return compressor.report();
  },
};

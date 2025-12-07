/**
 * ESTRATEGA - Agente de Estrategia Empresarial
 *
 * Consultor senior especializado en agronegocios mexicanos.
 * Combina bestsellers de management con experiencia real.
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';

// Cargar el system prompt desde el archivo markdown
const SYSTEM_PROMPT = readFileSync(
  join(__dirname, 'prompt.md'),
  'utf-8'
);

interface EstrategaContext {
  empresaData?: {
    nombre: string;
    hectareas: number;
    empleados: number;
    cultivos: string[];
    facturacionAnual?: number;
  };
  financialData?: any;  // Datos de CFO
  agronomicData?: any;  // Datos de AGROEXPERT
  legalContext?: any;   // Datos de LEGAL
}

interface EstrategaResponse {
  response: string;
  methodology?: string;        // Metodologia utilizada (SMART, OKR, etc.)
  dataRequests?: string[];     // Datos que necesita de otros agentes
  recommendations?: {
    action: string;
    priority: 'high' | 'medium' | 'low';
    timeframe: string;
    expectedROI?: string;
  }[];
  sources?: string[];          // Libros/frameworks citados
}

export class EstrategaAgent {
  private client: Anthropic;
  private conversationHistory: { role: 'user' | 'assistant'; content: string }[] = [];

  constructor() {
    this.client = new Anthropic();
  }

  /**
   * Consultar al Estratega
   */
  async consult(
    question: string,
    context?: EstrategaContext
  ): Promise<EstrategaResponse> {

    // Construir contexto adicional si existe
    let contextMessage = '';
    if (context) {
      contextMessage = this.buildContextMessage(context);
    }

    // Agregar a historial
    this.conversationHistory.push({
      role: 'user',
      content: contextMessage ? `${contextMessage}\n\n${question}` : question
    });

    // Llamar a Claude
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: this.conversationHistory
    });

    // Extraer respuesta
    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    // Agregar a historial
    this.conversationHistory.push({
      role: 'assistant',
      content: assistantMessage
    });

    // Parsear la respuesta para extraer metadata
    return this.parseResponse(assistantMessage);
  }

  /**
   * Construir mensaje de contexto
   */
  private buildContextMessage(context: EstrategaContext): string {
    const parts: string[] = ['[CONTEXTO DISPONIBLE]'];

    if (context.empresaData) {
      parts.push(`
EMPRESA:
- Nombre: ${context.empresaData.nombre}
- Hectareas: ${context.empresaData.hectareas}
- Empleados: ${context.empresaData.empleados}
- Cultivos: ${context.empresaData.cultivos.join(', ')}
${context.empresaData.facturacionAnual ? `- Facturacion anual: $${context.empresaData.facturacionAnual.toLocaleString()} MXN` : ''}
`);
    }

    if (context.financialData) {
      parts.push(`
DATOS FINANCIEROS (de CFO):
${JSON.stringify(context.financialData, null, 2)}
`);
    }

    if (context.agronomicData) {
      parts.push(`
DATOS AGRONOMICOS (de AGROEXPERT):
${JSON.stringify(context.agronomicData, null, 2)}
`);
    }

    if (context.legalContext) {
      parts.push(`
CONTEXTO LEGAL (de LEGAL):
${JSON.stringify(context.legalContext, null, 2)}
`);
    }

    return parts.join('\n');
  }

  /**
   * Parsear respuesta para extraer metadata
   */
  private parseResponse(text: string): EstrategaResponse {
    const response: EstrategaResponse = {
      response: text
    };

    // Detectar metodologias mencionadas
    const methodologies = [
      'SMART', 'OKR', 'Lean', 'Kaizen', 'FODA', 'SWOT',
      'Porter', 'Balanced Scorecard', 'Blue Ocean', 'Hedgehog'
    ];
    const foundMethodologies = methodologies.filter(m =>
      text.toLowerCase().includes(m.toLowerCase())
    );
    if (foundMethodologies.length > 0) {
      response.methodology = foundMethodologies.join(', ');
    }

    // Detectar libros/autores citados
    const authors = [
      'Jim Collins', 'Eric Ries', 'John Doerr', 'Daniel Kahneman',
      'Ben Horowitz', 'Ray Dalio', 'Stephen Covey', 'Porter'
    ];
    const foundSources = authors.filter(a => text.includes(a));
    if (foundSources.length > 0) {
      response.sources = foundSources;
    }

    // Detectar si necesita datos de otros agentes
    const dataRequests: string[] = [];
    if (text.includes('AGROEXPERT') || text.includes('agronomo')) {
      dataRequests.push('AGROEXPERT');
    }
    if (text.includes('CFO') || text.includes('financiero')) {
      dataRequests.push('CFO');
    }
    if (text.includes('LEGAL') || text.includes('abogado')) {
      dataRequests.push('LEGAL');
    }
    if (dataRequests.length > 0) {
      response.dataRequests = dataRequests;
    }

    return response;
  }

  /**
   * Limpiar historial de conversacion
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Analisis estrategico completo (usa todos los frameworks)
   */
  async fullStrategicAnalysis(
    topic: string,
    context: EstrategaContext
  ): Promise<EstrategaResponse> {
    const analysisPrompt = `
Necesito un analisis estrategico completo sobre: ${topic}

Por favor incluye:
1. Analisis FODA
2. Evaluacion con las 5 Fuerzas de Porter (si aplica)
3. Recomendaciones usando el framework SMART
4. Identificacion de "Quick Wins" vs inversiones a largo plazo
5. Riesgos principales y mitigaciones
6. KPIs sugeridos para medir exito

Fundamenta con los bestsellers de management que conoces cuando sea relevante.
`;

    return this.consult(analysisPrompt, context);
  }

  /**
   * Evaluar una oportunidad de inversion
   */
  async evaluateInvestment(
    investment: {
      description: string;
      estimatedCost: number;
      expectedReturn?: number;
      timeframe?: string;
    },
    context: EstrategaContext
  ): Promise<EstrategaResponse> {
    const investmentPrompt = `
Evalua esta oportunidad de inversion:

DESCRIPCION: ${investment.description}
COSTO ESTIMADO: $${investment.estimatedCost.toLocaleString()} MXN
${investment.expectedReturn ? `RETORNO ESPERADO: $${investment.expectedReturn.toLocaleString()} MXN` : ''}
${investment.timeframe ? `PLAZO: ${investment.timeframe}` : ''}

Analiza:
1. ¿Pasa el filtro del Hedgehog Concept de Jim Collins?
2. ¿Cual es el ROI esperado vs benchmarks de industria?
3. ¿Riesgos principales?
4. ¿Alternativas a considerar?
5. Recomendacion final: SI/NO/CONDICIONAL

Si necesitas datos de CFO o AGROEXPERT, indicalo.
`;

    return this.consult(investmentPrompt, context);
  }

  /**
   * Facilitar sesion de planeacion estrategica
   */
  async facilitateStrategicPlanning(
    currentState: string,
    desiredState: string,
    context: EstrategaContext
  ): Promise<EstrategaResponse> {
    const planningPrompt = `
Facilita una sesion de planeacion estrategica:

ESTADO ACTUAL:
${currentState}

ESTADO DESEADO:
${desiredState}

Guiame a traves de:
1. Gap Analysis (brecha entre actual y deseado)
2. Definicion de OKRs para cerrar la brecha
3. Iniciativas clave (usando priorizacion de Eisenhower)
4. Quick wins para generar momentum (concepto Flywheel de Collins)
5. Cronograma sugerido

Recuerda: "La estrategia sin ejecucion es alucinacion."
`;

    return this.consult(planningPrompt, context);
  }
}

// Export singleton instance
export const estrategaAgent = new EstrategaAgent();

// Export types
export type { EstrategaContext, EstrategaResponse };

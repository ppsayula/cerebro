/**
 * CEREBRO - Orquestador Central del Dream Team
 *
 * Recibe consultas del usuario y las rutea al agente apropiado.
 * Coordina respuestas multi-agente cuando es necesario.
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';

// Tipos de agentes disponibles
type AgentType = 'agroexpert' | 'cfo' | 'legal' | 'estratega' | 'multi';

interface ClassificationResult {
  primaryAgent: AgentType;
  secondaryAgents: AgentType[];
  confidence: number;
  reasoning: string;
  intentType: 'query' | 'action' | 'document' | 'alert';
}

interface CerebroResponse {
  response: string;
  agentsUsed: AgentType[];
  processingTime: number;
  metadata?: {
    documentsGenerated?: string[];
    alertsTriggered?: string[];
    dataRequests?: string[];
  };
}

// Cargar prompts de agentes
const AGENT_PROMPTS: Record<AgentType, string> = {
  agroexpert: readFileSync(join(__dirname, '../agents/agroexpert/prompt.md'), 'utf-8'),
  cfo: readFileSync(join(__dirname, '../agents/cfo/prompt.md'), 'utf-8'),
  legal: readFileSync(join(__dirname, '../agents/legal/prompt.md'), 'utf-8'),
  estratega: readFileSync(join(__dirname, '../agents/estratega/prompt.md'), 'utf-8'),
  multi: '' // Multi usa combinacion
};

// System prompt del clasificador
const CLASSIFIER_PROMPT = `
Eres el clasificador de CEREBRO, el sistema de IA para empresas agricolas.

Tu trabajo es analizar la consulta del usuario y determinar:
1. Cual agente principal debe responder
2. Si se necesitan agentes secundarios
3. El tipo de intencion (consulta, accion, documento, alerta)

AGENTES DISPONIBLES:

**AGROEXPERT** - Agronomo Virtual
- Plagas, enfermedades, clima, riego, fertilizacion
- Alertas de heladas, recomendaciones de fumigacion
- Rendimientos, variedades, certificaciones
- Palabras clave: plaga, helada, riego, pH, cultivo, enfermedad, cosecha (agronomica)

**CFO** - Director Financiero Virtual
- Costeo por kg/ha, nominas, presupuestos
- Compras, proveedores, facturas, precios
- ROI, flujo de caja, proyecciones
- Palabras clave: costo, precio, nomina, factura, presupuesto, dinero, pesos, inversion (financiera)

**LEGAL** - Abogado Laboral Virtual
- Contratos, actas administrativas, rescisiones
- LFT, IMSS, finiquitos, demandas
- Faltas, sanciones, procedimiento disciplinario
- Palabras clave: contrato, acta, falta, despido, rescision, empleado (laboral), demanda

**ESTRATEGA** - Consultor Empresarial Virtual
- Decisiones estrategicas, inversiones grandes
- OKRs, SMART, planeacion a largo plazo
- Expansion, diversificacion, valuacion
- Palabras clave: estrategia, invertir, expandir, futuro, decision importante, crecimiento

Responde SOLO en formato JSON:
{
  "primaryAgent": "agroexpert|cfo|legal|estratega",
  "secondaryAgents": ["agente2", "agente3"],
  "confidence": 0.0-1.0,
  "reasoning": "explicacion breve",
  "intentType": "query|action|document|alert"
}

REGLAS:
- Si la consulta mezcla temas, el primario es el MAS relevante
- Si se pide un documento (acta, contrato, finiquito), intentType = "document"
- Si hay urgencia o alerta, intentType = "alert"
- Si se pide hacer algo (generar, crear, calcular), intentType = "action"
- Consultas informativas = "query"
`;

export class Cerebro {
  private client: Anthropic;
  private conversationHistory: { role: 'user' | 'assistant'; content: string }[] = [];

  constructor() {
    this.client = new Anthropic();
  }

  /**
   * Clasificar la consulta para determinar agente(s) apropiado(s)
   */
  private async classifyQuery(query: string): Promise<ClassificationResult> {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: CLASSIFIER_PROMPT,
      messages: [{ role: 'user', content: query }]
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    try {
      // Extraer JSON de la respuesta
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Error parsing classification:', e);
    }

    // Default fallback
    return {
      primaryAgent: 'estratega',
      secondaryAgents: [],
      confidence: 0.5,
      reasoning: 'No se pudo clasificar claramente',
      intentType: 'query'
    };
  }

  /**
   * Consultar a un agente especifico
   */
  private async queryAgent(
    agent: AgentType,
    query: string,
    context?: string
  ): Promise<string> {
    const systemPrompt = AGENT_PROMPTS[agent];

    const messages: { role: 'user' | 'assistant'; content: string }[] = [];

    if (context) {
      messages.push({
        role: 'user',
        content: `[CONTEXTO DE OTROS AGENTES]\n${context}\n\n[CONSULTA DEL USUARIO]\n${query}`
      });
    } else {
      messages.push({ role: 'user', content: query });
    }

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  /**
   * Procesar consulta del usuario
   */
  async process(query: string): Promise<CerebroResponse> {
    const startTime = Date.now();

    // 1. Clasificar la consulta
    const classification = await this.classifyQuery(query);
    console.log('Clasificacion:', classification);

    const agentsUsed: AgentType[] = [classification.primaryAgent];
    let finalResponse = '';

    // 2. Si necesita multiples agentes, consultar en secuencia
    if (classification.secondaryAgents.length > 0) {
      // Primero obtener contexto de agentes secundarios
      let context = '';

      for (const secondaryAgent of classification.secondaryAgents) {
        const secondaryResponse = await this.queryAgent(
          secondaryAgent as AgentType,
          query
        );
        context += `\n[Respuesta de ${secondaryAgent.toUpperCase()}]:\n${secondaryResponse}\n`;
        agentsUsed.push(secondaryAgent as AgentType);
      }

      // Luego consultar agente primario con el contexto
      finalResponse = await this.queryAgent(
        classification.primaryAgent,
        query,
        context
      );
    } else {
      // Solo un agente necesario
      finalResponse = await this.queryAgent(classification.primaryAgent, query);
    }

    // 3. Agregar al historial
    this.conversationHistory.push({ role: 'user', content: query });
    this.conversationHistory.push({ role: 'assistant', content: finalResponse });

    const processingTime = Date.now() - startTime;

    return {
      response: finalResponse,
      agentsUsed,
      processingTime,
      metadata: {
        documentsGenerated: classification.intentType === 'document' ? ['pending'] : undefined,
        alertsTriggered: classification.intentType === 'alert' ? ['pending'] : undefined
      }
    };
  }

  /**
   * Consulta directa a un agente especifico (bypass clasificador)
   */
  async askAgent(agent: AgentType, query: string): Promise<string> {
    return this.queryAgent(agent, query);
  }

  /**
   * Obtener historial de conversacion
   */
  getHistory() {
    return this.conversationHistory;
  }

  /**
   * Limpiar historial
   */
  clearHistory() {
    this.conversationHistory = [];
  }
}

// Singleton instance
export const cerebro = new Cerebro();

// CLI para pruebas rapidas
if (require.main === module) {
  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n🧠 CEREBRO - Dream Team Multiagente');
  console.log('Escribe tu consulta (o "salir" para terminar)\n');

  const askQuestion = () => {
    rl.question('Tu: ', async (query: string) => {
      if (query.toLowerCase() === 'salir') {
        console.log('\nHasta luego!');
        rl.close();
        return;
      }

      try {
        const response = await cerebro.process(query);
        console.log(`\n🤖 CEREBRO (via ${response.agentsUsed.join(' + ')}):`);
        console.log(response.response);
        console.log(`\n[Tiempo: ${response.processingTime}ms]\n`);
      } catch (error) {
        console.error('Error:', error);
      }

      askQuestion();
    });
  };

  askQuestion();
}

/**
 * Test Script: 10 Preguntas para ESTRATEGA
 *
 * Demuestra las capacidades del agente con metodologias y bestsellers cargados.
 */

import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';

const client = new Anthropic();

// Cargar el prompt de ESTRATEGA
const ESTRATEGA_PROMPT = readFileSync(join(__dirname, 'agents/estratega/prompt.md'), 'utf-8');

// Las 10 preguntas de prueba
const PREGUNTAS = [
  // 1. OKRs
  "Quiero implementar OKRs en mi empresa de berries. Dame un ejemplo concreto para el proximo trimestre.",

  // 2. Teoria de Restricciones
  "Mi cuello de botella es el empaque. Tengo 20 cortadores pero solo 2 empacadoras. Como aplico la Teoria de Restricciones?",

  // 3. Porter y competencia
  "Driscoll's quiere comprarme toda mi produccion pero a precio bajo. Como analizo esta situacion con Porter?",

  // 4. Decision de inversion (DCF/VPN)
  "Tengo $2 millones para invertir. Puedo comprar 5 hectareas de tierra o rentar 15 hectareas. Como decido?",

  // 5. Negociacion (Never Split the Difference)
  "Un comprador me ofrece $4 USD/kg cuando el mercado esta a $6. Como negocio mejor precio?",

  // 6. Lean y productividad
  "Mis cortadores producen 70 kg/jornal pero el benchmark es 100. Que metodologia uso para mejorar?",

  // 7. Gestion del cambio (Kotter)
  "Quiero implementar tecnologia IoT pero mis mayordomos son de la vieja escuela. Como gestiono este cambio?",

  // 8. Blue Ocean Strategy
  "Todos venden frambuesa convencional a USA. Como creo un oceano azul?",

  // 9. Antifragile y riesgos
  "La helada me pego fuerte este ano. Como hago mi negocio mas antifragil para el futuro?",

  // 10. Planeacion estrategica integral
  "Es diciembre y quiero hacer la planeacion 2026. Que metodologias me recomiendas y en que orden?"
];

async function preguntarEstrategia(pregunta: string, numero: number): Promise<string> {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`PREGUNTA ${numero}: ${pregunta}`);
  console.log('='.repeat(80));

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: ESTRATEGA_PROMPT,
    messages: [{ role: 'user', content: pregunta }]
  });

  const respuesta = response.content[0].type === 'text' ? response.content[0].text : '';

  console.log('\nRESPUESTA DE ESTRATEGA:');
  console.log('-'.repeat(80));
  console.log(respuesta);
  console.log('-'.repeat(80));

  return respuesta;
}

async function main() {
  console.log('\n');
  console.log('*'.repeat(80));
  console.log('*  TEST DE ESTRATEGA - 10 PREGUNTAS CON METODOLOGIAS Y BESTSELLERS         *');
  console.log('*'.repeat(80));
  console.log('\n');

  const resultados: { pregunta: string; respuesta: string }[] = [];

  for (let i = 0; i < PREGUNTAS.length; i++) {
    const respuesta = await preguntarEstrategia(PREGUNTAS[i], i + 1);
    resultados.push({ pregunta: PREGUNTAS[i], respuesta });

    // Pequena pausa para no saturar la API
    if (i < PREGUNTAS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n');
  console.log('*'.repeat(80));
  console.log('*  RESUMEN: 10 PREGUNTAS COMPLETADAS                                        *');
  console.log('*'.repeat(80));
  console.log('\n');

  // Mostrar metodologias mencionadas
  const metodologiasMencionadas = new Set<string>();
  const librosmencionados = new Set<string>();

  resultados.forEach(r => {
    // Buscar metodologias
    const metodologias = ['OKR', 'SMART', 'Lean', 'Kaizen', 'TOC', 'Six Sigma', 'Porter', 'FODA', 'Canvas',
      'Ansoff', 'BCG', 'PESTEL', 'PDCA', 'Kanban', 'Scrum', 'Pareto', 'OODA', 'Cynefin', 'RACI',
      'DCF', 'VPN', 'TIR', 'Break-Even', 'Design Thinking', 'Kotter', 'Blue Ocean', 'Balanced Scorecard'];
    metodologias.forEach(m => {
      if (r.respuesta.toLowerCase().includes(m.toLowerCase())) {
        metodologiasMencionadas.add(m);
      }
    });

    // Buscar libros/autores
    const autores = ['Collins', 'Goldratt', 'Porter', 'Ries', 'Doerr', 'Kahneman', 'Horowitz', 'Dalio',
      'Covey', 'Kim', 'Mauborgne', 'Wickman', 'Sinek', 'Willink', 'Voss', 'Clear', 'Taleb', 'Drucker', 'Moore'];
    autores.forEach(a => {
      if (r.respuesta.includes(a)) {
        librosmencionados.add(a);
      }
    });
  });

  console.log('Metodologias utilizadas en las respuestas:');
  console.log([...metodologiasMencionadas].join(', '));
  console.log('\nAutores/Libros mencionados:');
  console.log([...librosmencionados].join(', '));
}

main().catch(console.error);

/**
 * CEREBRO - API Server con Streaming + Tool Use
 *
 * Servidor Express con streaming para respuestas en tiempo real
 * Integración con Actas Laborales vía Tool Use
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { join } from 'path';
import { readFileSync } from 'fs';
import Anthropic from '@anthropic-ai/sdk';
import { legalTools, executeLegalTool } from './tools/legal-tools';

const app = express();
const PORT = process.env.PORT || 3000;

// Cliente Anthropic
const anthropic = new Anthropic();

// Cargar prompts de agentes
const AGENT_PROMPTS: Record<string, string> = {
  agroexpert: readFileSync(join(__dirname, 'agents/agroexpert/prompt.md'), 'utf-8'),
  cfo: readFileSync(join(__dirname, 'agents/cfo/prompt.md'), 'utf-8'),
  legal: readFileSync(join(__dirname, 'agents/legal/prompt.md'), 'utf-8'),
  estratega: readFileSync(join(__dirname, 'agents/estratega/prompt.md'), 'utf-8'),
};

// Tools por agente
const AGENT_TOOLS: Record<string, Anthropic.Tool[]> = {
  legal: legalTools,
  // Aquí se pueden agregar tools para otros agentes
};

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (PWA)
app.use(express.static(join(__dirname, '../public')));

/**
 * POST /api/chat/stream
 * Chat con streaming - respuesta en tiempo real
 * Soporta Tool Use para agentes con herramientas (ej: LEGAL)
 */
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { message, agent = 'estratega' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    const validAgents = ['agroexpert', 'cfo', 'legal', 'estratega'];
    const selectedAgent = validAgents.includes(agent) ? agent : 'estratega';
    const hasTools = selectedAgent in AGENT_TOOLS;

    console.log(`[${selectedAgent.toUpperCase()}] Streaming: "${message.substring(0, 50)}..." (tools: ${hasTools})`);

    // Configurar headers para SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Agent', selectedAgent);

    // Enviar evento inicial
    res.write(`data: ${JSON.stringify({ type: 'start', agent: selectedAgent })}\n\n`);

    // Mensajes de conversación
    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: message }];

    // Opciones base
    const baseOptions = {
      model: 'claude-sonnet-4-20250514' as const,
      max_tokens: 2048,
      system: AGENT_PROMPTS[selectedAgent],
    };

    // Si el agente tiene tools, usar loop de tool use
    if (hasTools) {
      await handleToolUseStream(res, baseOptions, messages, selectedAgent);
    } else {
      // Sin tools - streaming simple
      await handleSimpleStream(res, baseOptions, messages);
    }

  } catch (error) {
    console.error('[CEREBRO] Error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Error procesando mensaje',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Error interno' })}\n\n`);
      res.end();
    }
  }
});

// Streaming simple (sin tools)
async function handleSimpleStream(
  res: express.Response,
  options: { model: 'claude-sonnet-4-20250514'; max_tokens: number; system: string },
  messages: Anthropic.MessageParam[]
) {
  const stream = anthropic.messages.stream({
    ...options,
    messages
  });

  stream.on('text', (text) => {
    res.write(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`);
  });

  stream.on('end', () => {
    res.write(`data: ${JSON.stringify({ type: 'end' })}\n\n`);
    res.end();
  });

  stream.on('error', (error) => {
    console.error('[STREAM ERROR]', error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  });
}

// Streaming con Tool Use (para LEGAL y otros agentes con herramientas)
async function handleToolUseStream(
  res: express.Response,
  options: { model: 'claude-sonnet-4-20250514'; max_tokens: number; system: string },
  messages: Anthropic.MessageParam[],
  agentName: string
) {
  const tools = AGENT_TOOLS[agentName];
  let continueLoop = true;

  while (continueLoop) {
    // Crear stream con tools
    const stream = anthropic.messages.stream({
      ...options,
      messages,
      tools
    });

    let currentToolUse: { id: string; name: string; input: string } | null = null;
    let responseContent: Anthropic.ContentBlock[] = [];
    let stopReason: string | null = null;

    // Procesar eventos del stream
    for await (const event of stream) {
      if (event.type === 'content_block_start') {
        if (event.content_block.type === 'text') {
          // Inicio de texto
        } else if (event.content_block.type === 'tool_use') {
          currentToolUse = {
            id: event.content_block.id,
            name: event.content_block.name,
            input: ''
          };
          // Notificar al cliente que se está usando una herramienta
          res.write(`data: ${JSON.stringify({
            type: 'tool_start',
            tool: event.content_block.name
          })}\n\n`);
        }
      } else if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          // Enviar texto al cliente
          res.write(`data: ${JSON.stringify({ type: 'text', content: event.delta.text })}\n\n`);
        } else if (event.delta.type === 'input_json_delta' && currentToolUse) {
          currentToolUse.input += event.delta.partial_json;
        }
      } else if (event.type === 'content_block_stop') {
        if (currentToolUse) {
          // Finalizar tool use block
          responseContent.push({
            type: 'tool_use',
            id: currentToolUse.id,
            name: currentToolUse.name,
            input: JSON.parse(currentToolUse.input || '{}')
          });
          currentToolUse = null;
        }
      } else if (event.type === 'message_delta') {
        stopReason = event.delta.stop_reason;
      }
    }

    // Obtener mensaje final
    const finalMessage = await stream.finalMessage();
    responseContent = finalMessage.content;

    // Verificar si hay tool_use en la respuesta
    const toolUseBlocks = responseContent.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
    );

    if (toolUseBlocks.length > 0 && finalMessage.stop_reason === 'tool_use') {
      // Agregar respuesta del asistente a los mensajes
      messages.push({ role: 'assistant', content: responseContent });

      // Ejecutar cada herramienta
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolBlock of toolUseBlocks) {
        console.log(`[TOOL] Ejecutando: ${toolBlock.name}`);
        res.write(`data: ${JSON.stringify({
          type: 'tool_executing',
          tool: toolBlock.name
        })}\n\n`);

        // Ejecutar la herramienta
        const result = await executeLegalTool(
          toolBlock.name,
          toolBlock.input as Record<string, unknown>
        );

        console.log(`[TOOL] Resultado: ${result.substring(0, 100)}...`);

        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolBlock.id,
          content: result
        });
      }

      // Agregar resultados de herramientas a los mensajes
      messages.push({ role: 'user', content: toolResults });

      // Continuar el loop para que Claude procese los resultados
    } else {
      // No hay más tools que ejecutar, terminar
      continueLoop = false;
    }
  }

  res.write(`data: ${JSON.stringify({ type: 'end' })}\n\n`);
  res.end();
}

/**
 * POST /api/chat
 * Chat sin streaming (fallback)
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, agent = 'estratega' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    const validAgents = ['agroexpert', 'cfo', 'legal', 'estratega'];
    const selectedAgent = validAgents.includes(agent) ? agent : 'estratega';

    console.log(`[${selectedAgent.toUpperCase()}] Procesando: "${message.substring(0, 50)}..."`);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: AGENT_PROMPTS[selectedAgent],
      messages: [{ role: 'user', content: message }]
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    res.json({
      response: text,
      agent: selectedAgent
    });
  } catch (error) {
    console.error('[CEREBRO] Error:', error);
    res.status(500).json({
      error: 'Error procesando mensaje',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    agents: ['agroexpert', 'cfo', 'legal', 'estratega']
  });
});

/**
 * GET /api/agents
 */
app.get('/api/agents', (req, res) => {
  res.json({
    agents: [
      { id: 'agroexpert', name: 'AGROEXPERT', emoji: '🌱', role: 'Agrónomo Virtual' },
      { id: 'cfo', name: 'CFO', emoji: '💰', role: 'Director Financiero' },
      { id: 'legal', name: 'LEGAL', emoji: '⚖️', role: 'Abogado Laboral' },
      { id: 'estratega', name: 'ESTRATEGA', emoji: '📊', role: 'Consultor Senior' }
    ]
  });
});

// Fallback para SPA
app.get('/{*path}', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║   🧠 CEREBRO - Dream Team Multiagente (STREAMING)           ║
║   Servidor: http://localhost:${PORT}                          ║
║   • POST /api/chat/stream - Chat con streaming              ║
║   • POST /api/chat        - Chat sin streaming              ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

export default app;

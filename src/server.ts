/**
 * CEREBRO - API Server
 *
 * Servidor Express que expone la API de CEREBRO para la PWA
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { join } from 'path';
import { Cerebro } from './orchestrator/cerebro';

const app = express();
const PORT = process.env.PORT || 3000;

// Instancia de CEREBRO
const cerebro = new Cerebro();

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());

// Servir archivos estáticos (PWA)
app.use(express.static(join(__dirname, '../public')));

// API Endpoints

/**
 * POST /api/chat
 * Envía un mensaje a CEREBRO y recibe respuesta
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    console.log(`[CEREBRO] Procesando: "${message.substring(0, 50)}..."`);

    const result = await cerebro.process(message);

    console.log(`[CEREBRO] Agentes usados: ${result.agentsUsed.join(', ')}`);

    res.json({
      response: result.response,
      agentsUsed: result.agentsUsed,
      processingTime: result.processingTime,
      metadata: result.metadata
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
 * POST /api/agent/:agent
 * Consulta directa a un agente específico
 */
app.post('/api/agent/:agent', async (req, res) => {
  try {
    const { agent } = req.params;
    const { message } = req.body;

    const validAgents = ['agroexpert', 'cfo', 'legal', 'estratega'];

    if (!validAgents.includes(agent)) {
      return res.status(400).json({
        error: `Agente inválido. Usa: ${validAgents.join(', ')}`
      });
    }

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    console.log(`[${agent.toUpperCase()}] Procesando: "${message.substring(0, 50)}..."`);

    const response = await cerebro.askAgent(agent as any, message);

    res.json({
      response,
      agent
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
 * Health check para Railway
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
 * Lista de agentes disponibles
 */
app.get('/api/agents', (req, res) => {
  res.json({
    agents: [
      {
        id: 'agroexpert',
        name: 'AGROEXPERT',
        role: 'Agrónomo Virtual',
        specialty: 'Plagas, clima, riego, fertilización, cosecha'
      },
      {
        id: 'cfo',
        name: 'CFO',
        role: 'Director Financiero',
        specialty: 'Costeo, nóminas, compras, ROI, presupuestos'
      },
      {
        id: 'legal',
        name: 'LEGAL',
        role: 'Abogado Laboral',
        specialty: 'LFT, contratos, actas, rescisiones, IMSS'
      },
      {
        id: 'estratega',
        name: 'ESTRATEGA',
        role: 'Consultor Senior',
        specialty: 'SMART, OKR, Lean, inversiones, decisiones'
      }
    ]
  });
});

// Fallback para SPA - cualquier ruta sirve index.html (Express 5 syntax)
app.get('/{*path}', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🧠 CEREBRO - Dream Team Multiagente                       ║
║                                                              ║
║   Servidor corriendo en: http://localhost:${PORT}             ║
║                                                              ║
║   Endpoints:                                                 ║
║   • POST /api/chat         - Chat con CEREBRO                ║
║   • POST /api/agent/:name  - Consulta directa a agente       ║
║   • GET  /api/agents       - Lista de agentes                ║
║   • GET  /api/health       - Health check                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

export default app;

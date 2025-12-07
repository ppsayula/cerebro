# CEREBRO - Dream Team Multiagente

> **"El equipo de expertos que toda empresa agricola necesita pero no puede pagar"**

Centro de comando con IA que integra 4 agentes especializados para asesorar PyMES agricolas en Mexico.

**URL Produccion:** https://cerebro-production-8419.up.railway.app

---

## Los 4 Agentes

| Agente | Rol | Especialidad |
|--------|-----|--------------|
| **AGROEXPERT** | Agronomo Virtual | Plagas, clima, riego, fertilizacion, cosecha |
| **CFO** | Director Financiero | Costeo, nominas, compras, ROI, presupuestos |
| **LEGAL** | Abogado Laboral | LFT, contratos, actas, rescisiones, IMSS |
| **ESTRATEGA** | Consultor Senior | SMART, OKR, Lean, inversiones, decisiones |

---

## Funcionalidades

- **Chat con streaming** - Respuestas en tiempo real
- **PWA instalable** - Funciona como app en celular
- **Entrada por voz** - Habla tus consultas (Chrome)
- **Tool Use** - El agente LEGAL puede generar actas conectando con Actas Laborales
- **Preguntas personalizadas** - Cada agente tiene su menu de consultas frecuentes

---

## Inicio Rapido

### Desarrollo Local

```bash
# Instalar dependencias
cd cerebro
npm install

# Configurar API key de Anthropic
# Crear archivo .env con:
ANTHROPIC_API_KEY=sk-ant-...

# Iniciar servidor de desarrollo
npm run dev
# Abre http://localhost:4000
```

### Produccion (Railway)

El proyecto esta desplegado en Railway. Para nuevos deploys:

```bash
git add -A && git commit -m "mensaje" && git push
```

Railway detecta el push y redeploya automaticamente.

Variables de entorno requeridas en Railway:
- `ANTHROPIC_API_KEY` - Tu clave de Anthropic

---

## Estructura del Proyecto

```
cerebro/
├── src/
│   ├── agents/
│   │   ├── agroexpert/prompt.md   # System prompt del agronomo
│   │   ├── cfo/prompt.md          # System prompt del CFO
│   │   ├── legal/prompt.md        # System prompt del abogado
│   │   └── estratega/prompt.md    # System prompt del estratega
│   │
│   ├── tools/
│   │   └── legal-tools.ts         # Tool Use para generar actas
│   │
│   └── server.ts                  # Servidor Express con streaming
│
├── public/
│   ├── index.html                 # UI del chat
│   ├── manifest.json              # Config PWA
│   └── sw.js                      # Service Worker
│
├── Dockerfile                     # Para Railway
├── package.json
├── tsconfig.json
└── README.md
```

---

## Herramientas del Agente LEGAL

El agente LEGAL tiene acceso a estas herramientas via Tool Use:

| Herramienta | Funcion |
|-------------|---------|
| `analizar_incidente` | Detecta faltas en una descripcion |
| `generar_acta` | Crea acta administrativa completa |
| `buscar_faltas` | Busca en catalogo de faltas LFT |
| `obtener_pruebas_recomendadas` | Sugiere evidencias necesarias |
| `listar_actas_recientes` | Muestra historial de actas |
| `exportar_acta` | Genera PDF o Word |

Requiere que Actas Laborales este corriendo en localhost:3000 (o configurar `ACTAS_LABORALES_URL`).

---

## Ejemplos de Consultas

### AGROEXPERT
- "Mis arandanos tienen hojas amarillas"
- "Hay riesgo de helada esta semana?"
- "Que hago contra la Drosophila suzukii?"

### CFO
- "Cuanto me costo el kg de arandano este mes?"
- "Cual es mi costo de nomina semanal?"
- "Calcula el ROI de invertir en 10 hectareas mas"

### LEGAL
- "Hazme un acta para Juan que llego tomado"
- "Genera contrato de temporada para cosecha"
- "Muestrame las actas recientes"

### ESTRATEGA
- "Que libros de estrategia conoces?"
- "Explicame el Hedgehog Concept de Jim Collins"
- "Como aplico la Teoria de Restricciones?"

---

## Stack Tecnologico

- **LLM:** Claude Sonnet 4 (Anthropic)
- **Runtime:** Node.js + TypeScript
- **Frontend:** HTML/CSS/JS vanilla (PWA)
- **Servidor:** Express.js con SSE streaming
- **Deploy:** Railway (Docker)
- **Tool Use:** Integracion con Actas Laborales API

---

## Roadmap

- [x] Chat con 4 agentes especializados
- [x] Streaming de respuestas
- [x] PWA instalable en celular
- [x] Entrada por voz
- [x] Tool Use para agente LEGAL
- [x] Deploy en Railway
- [ ] Conectar CFO con datos reales
- [ ] Conectar AGROEXPERT con sensores
- [ ] Memoria persistente entre sesiones

---

## Fundador

**Jose Fernandez**
- Abogado titulado
- 40 anos de experiencia en agronegocios
- 2 empresas agricolas funcionando (Lola Berries, Bosbes)

---

*Actualizado: 7 Diciembre 2025*

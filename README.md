# CEREBRO - Dream Team Multiagente

> **"El equipo de expertos que toda empresa agricola necesita pero no puede pagar"**

Centro de comando con IA que integra 4 agentes especializados para asesorar PyMES agricolas en Mexico.

---

## Los 4 Agentes

| Agente | Rol | Especialidad |
|--------|-----|--------------|
| **AGROEXPERT** | Agronomo Virtual | Plagas, clima, riego, fertilizacion, cosecha |
| **CFO** | Director Financiero | Costeo, nominas, compras, ROI, presupuestos |
| **LEGAL** | Abogado Laboral | LFT, contratos, actas, rescisiones, IMSS |
| **ESTRATEGA** | Consultor Senior | SMART, OKR, Lean, inversiones, decisiones |

---

## Como Funciona

```
Usuario: "Cuanto me costo la frambuesa y hay riesgo de helada?"

CEREBRO (Clasificador):
├── Detecta: consulta multi-dominio
├── Agente primario: CFO (costos)
└── Agente secundario: AGROEXPERT (helada)

CFO: "Frambuesa noviembre: $3.38/kg, 8% sobre objetivo..."
AGROEXPERT: "Alerta: probabilidad de helada 75% manana 3am..."

CEREBRO (Consolidador):
└── Respuesta unificada al usuario
```

---

## Inicio Rapido

```bash
# Instalar dependencias
cd cerebro
npm install

# Configurar API key de Anthropic
export ANTHROPIC_API_KEY=sk-ant-...

# Iniciar chat interactivo
npm run chat
```

---

## Estructura del Proyecto

```
cerebro/
├── src/
│   ├── agents/
│   │   ├── agroexpert/
│   │   │   └── prompt.md       # System prompt del agronomo
│   │   ├── cfo/
│   │   │   └── prompt.md       # System prompt del CFO
│   │   ├── legal/
│   │   │   └── prompt.md       # System prompt del abogado
│   │   └── estratega/
│   │       ├── prompt.md       # System prompt del estratega
│   │       └── agent.ts        # Implementacion con funciones
│   │
│   ├── orchestrator/
│   │   └── cerebro.ts          # Orquestador central
│   │
│   ├── api/                    # (Futuro) API REST/WebSocket
│   └── knowledge/              # (Futuro) Base de conocimiento
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## Uso Programatico

```typescript
import { cerebro } from './orchestrator/cerebro';

// Consulta automatica (CEREBRO decide el agente)
const response = await cerebro.process("Cuanto le debo a Fertilizantes del Norte?");
console.log(response.response);
console.log('Agentes usados:', response.agentsUsed);

// Consulta directa a un agente especifico
const legal = await cerebro.askAgent('legal', 'Genera acta para Juan Perez por 3 faltas');
console.log(legal);
```

---

## Ejemplos de Consultas

### AGROEXPERT
- "Mis arandanos tienen hojas amarillas"
- "Hay riesgo de helada esta semana?"
- "Que hago contra la Drosophila suzukii?"
- "Cual es el pH optimo para frambuesa?"

### CFO
- "Cuanto me costo el kg de arandano este mes?"
- "Comparame precios de fertilizantes del ultimo ano"
- "Cual es mi costo de nomina semanal?"
- "Calcula el ROI de invertir en 10 hectareas mas"

### LEGAL
- "Juan Perez falto 4 dias sin justificar"
- "Genera contrato de temporada para cosecha"
- "Cuanto seria el finiquito de Maria Lopez?"
- "Se vence el contrato de Pedro en 10 dias"

### ESTRATEGA
- "Deberia invertir en mas hectareas de frambuesa?"
- "Como mejoro la productividad de mi equipo?"
- "Quiero hacer planeacion estrategica para 2026"
- "Evalua si debo diversificar a zarzamora"

---

## Stack Tecnologico

- **LLM:** Claude Sonnet 4 (Anthropic)
- **Runtime:** Node.js + TypeScript
- **Orquestacion:** Clasificador + Router propio

---

## Roadmap

- [x] Crear prompts de los 4 agentes
- [x] Implementar orquestador basico
- [ ] Conectar con AGROAI (datos reales)
- [ ] Conectar con Agro-Compras (facturas)
- [ ] Conectar con Contratos-SaaS (empleados)
- [ ] API REST para integracion
- [ ] Interface web de chat
- [ ] Memoria persistente (Mem0)

---

## Fundador

**Jose Fernandez**
- Abogado titulado
- 40 anos de experiencia en agronegocios
- 2 empresas agricolas funcionando (Lola Berries, Bosbes)

---

*Creado: 6 Diciembre 2025*

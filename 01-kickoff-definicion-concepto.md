# 🧠 CEREBRO - Centro de Comando Unificado con IA Conversacional

**Nombre del Proyecto:** CEREBRO
**Fecha:** Diciembre 2024
**Fundador:** José Fernández Vázquez
**Ubicación:** `c:/Users/Asus/SaaS-Factory-Projects/cerebro/`

> *"Un asistente ejecutivo con IA que tiene acceso a todos tus sistemas y te responde por voz en tiempo real"*

---

## 📋 DECISIONES DEL KICKOFF (1 Dic 2024)

| Pregunta | Respuesta |
|----------|-----------|
| **Nombre** | CEREBRO |
| **Modo de voz** | Push-to-talk (por ahora) |
| **Presupuesto APIs** | Sin límite, lo que cueste |
| **Técnico** | A discreción de Claude |
| **Sistema principal** | AGROAI (datos reales, el más grande) |
| **Timeline AGROAI** | ~1 semana para tenerlo listo |
| **Otras apps** | En proceso de afinar con datos reales |

### Casos de Uso Prioritarios:
1. **Consultas variadas** - información de cualquier sistema
2. **Comandos de acción** - "Hazme un acta administrativa"
3. **Generación de documentos** - actas, contratos, finiquitos

---

## 1. El Dolor (Business Problem) 📉

**¿Qué proceso de negocio está roto, es lento o costoso hoy?**

> Como dueño/gerente de múltiples operaciones agrícolas, tengo **información fragmentada en 6 sistemas diferentes** con **35+ tablas de datos** y **100+ APIs** que no se comunican entre sí:
>
> | Sistema | Datos Disponibles | Estado |
> |---------|------------------|--------|
> | **Agro Compras Inteligentes** | 500+ facturas/mes, 12 tablas, 30+ APIs | ✅ Producción |
> | **Contratos Laborales SaaS** | Empleados, contratos, documentos, 7 tablas | ✅ MVP |
> | **BerryVision (Bucle Agenticol)** | Análisis de cultivos, plagas, 9 tablas + RAG | 🟡 Desarrollo |
> | **AGROAI Multiagentes** | 6 agentes IA, predicciones, clima | 🟡 Desarrollo |
> | **Vision Guard Agro** | Asistencia facial, EPP, detecciones | ⚪ Fase 0 |
> | **Actas Laborales DECISIO** | Generación de actas con IA | ✅ MVP |
>
> **El problema real:**
> - Para saber "¿cuántos empleados vinieron hoy?" → Sistema de Contratos
> - Para saber "¿cuántos kilos cortamos ayer?" → AGROAI/ERP
> - Para generar un acta administrativa → Actas DECISIO
> - Para revisar facturas de un proveedor → Agro Compras
> - Para ver análisis de plagas → BerryVision
> - **NO PUEDO** tener una conversación fluida que cruce todos estos sistemas
> - **PIERDO CONTEXTO** al saltar entre aplicaciones
> - **LAS DECISIONES SE RETRASAN** porque hay que buscar en múltiples lugares

**¿Cuánto cuesta este problema actualmente?**

> - **30-60 minutos diarios** perdidos navegando entre sistemas
> - **Decisiones tardías** por información no consolidada
> - **Dependencia de personal clave** que "sabe dónde está cada cosa"
> - **Imposibilidad de actuar en tiempo real** (ej: empleado problemático requiere acta + finiquito + historial + revisar sus compras asignadas)
> - **Costo estimado:** $15,000-$25,000 USD anuales en ineficiencia

---

## 2. La Solución (The Fix) 🛠️

**En una sola frase, ¿qué hace tu herramienta?**

> **CEREBRO** es un asistente ejecutivo con IA que conecta todos tus sistemas agrícolas, permitiéndote consultar datos, ejecutar acciones y generar documentos mediante **conversación natural en tiempo real** - como hablar con un asistente que tiene acceso instantáneo a todo.

**¿Cuál es el flujo principal (Happy Path)?**

### Escenario 1: Consulta de información cruzada
```
👤 Pepe: "¿Cuántos empleados vinieron hoy a trabajar?"

🧠 CEREBRO: "Hoy asistieron 127 de 145 empleados registrados.
            18 ausencias: 12 faltas injustificadas, 4 permisos, 2 incapacidades.
            ¿Quieres ver el detalle de las faltas?"

👤 Pepe: "Sí, y dime cuántos kilos de frambuesa cortaron ayer"

🧠 CEREBRO: "Las 12 faltas injustificadas son: [lista con nombres]

            Sobre producción: ayer se cortaron 8,450 kg de frambuesa.
            15% arriba del promedio semanal. El sector 3 fue el más productivo."
```

### Escenario 2: Generación de documentos con contexto
```
👤 Pepe: "El empleado Juan Pérez, número 1245, no vino el viernes 14
         ni el sábado 15, hoy llegó borracho y se peleó con un compañero"

🧠 CEREBRO: "Entendido. Juan Pérez García tiene 2 actas previas en su expediente.
            ¿Deseas que genere un acta administrativa por:
            1. Faltas injustificadas (viernes 14 y sábado 15)
            2. Presentarse en estado de ebriedad
            3. Riña con compañero de trabajo?

            Con 3 actas previas, esto podría ameritar rescisión de contrato."

👤 Pepe: "Sí, genera las tres actas y prepara el finiquito"

🧠 CEREBRO: "Generando documentos...
            ✅ Acta por faltas injustificadas - Lista
            ✅ Acta por estado de ebriedad - Lista
            ✅ Acta por riña laboral - Lista
            ✅ Cálculo de finiquito: $18,450 MXN (antigüedad 1.5 años)

            Los documentos están listos para tu revisión. ¿Los envío por email?"
```

### Escenario 3: Cambio de contexto fluido
```
👤 Pepe: "Espera, antes de eso, ¿cuánto le debemos a Fertilizantes del Norte?"

🧠 CEREBRO: "Con Fertilizantes del Norte tienes:
            - 3 facturas pendientes: $45,230 MXN total
            - Última compra: 15 de noviembre, 2 ton de urea
            - Histórico 12 meses: $380,000 MXN (5% más que año anterior)
            - Alerta: El precio de urea subió 12% vs promedio"

👤 Pepe: "Ok, ahora sí envía los documentos del empleado"

🧠 CEREBRO: "Enviando a tu correo y al de RH...
            ✅ Documentos enviados. ¿Algo más?"
```

---

## 3. El Usuario (Target Role) 👔

**¿Quién va a usar esto específicamente?**

> ### Usuario Principal:
> **José "Pepe" Fernández** - Dueño/Director General
> - Maneja Lola Berries + Bosbes Berries + DECISIO
> - Siempre en movimiento entre oficina y campo
> - Prefiere hablar que escribir cuando tiene las manos ocupadas
> - Necesita respuestas instantáneas, no navegar menús
> - Toma 50+ decisiones operativas diarias
>
> ### Usuarios Secundarios (Fase 2):
> | Rol | Sistemas que consulta | Acciones típicas |
> |-----|----------------------|------------------|
> | Gerente Operaciones | AGROAI, BerryVision | Producción, alertas |
> | Contador | Agro Compras, Contratos | Facturas, nómina |
> | Supervisor Campo | BerryVision, VisionGuard | Asistencia, cultivos |
> | RH | Contratos, Actas | Empleados, documentos |

---

## 4. Los Datos (Input/Output) 💾

### Ecosistema de Datos Disponible

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CEREBRO - DATOS DISPONIBLES                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📊 AGRO COMPRAS INTELIGENTES (30+ APIs, 12 tablas)                 │
│  ├── suppliers (proveedores): RFC, contacto, tags                   │
│  ├── invoices (facturas): monto, status, OCR confidence             │
│  ├── invoice_items (líneas): producto, cantidad, precio             │
│  ├── products (catálogo): código, categoría, unidad                 │
│  ├── price_history (histórico): tendencias, variaciones             │
│  ├── expense_categories (clasificación): jerarquía gastos           │
│  ├── budgets (presupuestos): asignado vs gastado                    │
│  ├── financial_alerts (alertas): anomalías, spikes                  │
│  ├── companies (multi-empresa): Lola, Bosbes                        │
│  └── departments (centros costo): producción, admin                 │
│                                                                      │
│  👥 CONTRATOS LABORALES (20+ APIs, 7 tablas)                        │
│  ├── employees (empleados): datos completos, RFC, CURP, NSS         │
│  ├── contracts (contratos): tipo, salario, vigencia                 │
│  ├── seasons (temporadas): cultivo, fechas, personal                │
│  ├── documents (documentos): INE, actas, contratos PDF              │
│  └── tenants (empresas): configuración multi-tenant                 │
│                                                                      │
│  🌱 BERRYVISION (15+ APIs, 9 tablas + RAG)                          │
│  ├── farms (fincas): ubicación geoespacial, área                    │
│  ├── sectors (sectores): cultivo, variedad, plantas                 │
│  ├── analyses (análisis): IA vision, enfermedades, plagas           │
│  ├── alerts (alertas): severidad, recomendaciones                   │
│  ├── knowledge_documents (RAG): base conocimiento agrícola          │
│  └── PostGIS: consultas geoespaciales, mapas de calor               │
│                                                                      │
│  📝 ACTAS LABORALES DECISIO                                         │
│  ├── Generación automática con Claude AI                            │
│  ├── Tipos: faltas, ebriedad, daño, conducta, rescisión             │
│  └── Fundamentos legales LFT México                                 │
│                                                                      │
│  🤖 AGROAI MULTIAGENTES (6 agentes especializados)                  │
│  ├── Climate Agent: predicción heladas, clima                       │
│  ├── Harvest Agent: optimización cosecha                            │
│  ├── Phytosanitary Agent: fumigaciones, compliance orgánico         │
│  ├── HR Agent: nómina predictiva                                    │
│  ├── Finance Agent: ROI, análisis financiero                        │
│  └── Orchestrator: coordinación central                             │
│                                                                      │
│  👁️ VISION GUARD (conceptual)                                       │
│  ├── detections: asistencia facial, EPP                             │
│  ├── violations: objetos prohibidos, incumplimientos                │
│  └── vehicles: control vehicular, placas                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Consultas Que CEREBRO Puede Responder

| Categoría | Ejemplos de Preguntas |
|-----------|----------------------|
| **Personal** | ¿Cuántos vinieron hoy? ¿Quién faltó? ¿Cuántas actas tiene Juan? |
| **Producción** | ¿Cuántos kilos cortamos? ¿Cómo va el sector 3? ¿Qué plagas hay? |
| **Finanzas** | ¿Cuánto gastamos en fertilizantes? ¿Facturas pendientes? ¿Presupuesto? |
| **Proveedores** | ¿Cuánto le debemos a X? ¿Histórico de precios? ¿Mejor precio? |
| **Documentos** | Genera acta por falta. Prepara finiquito. Contrato de temporada. |
| **Alertas** | ¿Hay alertas críticas? ¿Plagas detectadas? ¿Precios anómalos? |
| **Cultivos** | ¿Salud del cultivo? ¿Fenología actual? ¿Recomendaciones? |

---

## 5. El Éxito (KPIs) 🎯

**¿Qué resultado medible define el éxito del MVP?**

> ### KPIs Funcionales:
> | Métrica | Objetivo MVP | Cómo se mide |
> |---------|-------------|--------------|
> | Sistemas conectados | ≥4 (Compras, Contratos, Actas, BerryVision) | Checklist |
> | Latencia voz-respuesta | <3 segundos | Timestamp logs |
> | Precisión intención | >95% | Feedback usuario |
> | Contexto conversación | ≥15 turnos | Session tracking |
> | Consultas multi-sistema | Funcional | Test E2E |
>
> ### KPIs de Negocio:
> | Métrica | Objetivo | Impacto |
> |---------|----------|---------|
> | Tiempo buscando info | 30min → 5min diario | 25 min/día ahorrados |
> | Generación documentos | 15min → 2min | 13 min/documento |
> | Adopción diaria | 14 días consecutivos | Producto útil |
> | Decisiones aceleradas | Cualitativo | Feedback |

---

## 6. Arquitectura Propuesta 🏗️

### Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            🧠 CEREBRO                                    │
│                     Centro de Comando Unificado                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    CAPA DE PRESENTACIÓN                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐   │ │
│  │  │   Web App    │  │   Desktop    │  │    Mobile (Fase 2)     │   │ │
│  │  │  (Next.js)   │  │  (Electron)  │  │   (React Native)       │   │ │
│  │  └──────────────┘  └──────────────┘  └────────────────────────┘   │ │
│  │                          │                                          │ │
│  │  ┌─────────────────────────────────────────────────────────────┐   │ │
│  │  │              💬 INTERFAZ CONVERSACIONAL                      │   │ │
│  │  │  • Chat con voz (push-to-talk)                               │   │ │
│  │  │  • Historial visual de conversación                          │   │ │
│  │  │  • Cards/widgets de datos relevantes                         │   │ │
│  │  │  • Notificaciones y alertas proactivas                       │   │ │
│  │  └─────────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                  │                                       │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    🎙️ CAPA DE VOZ EN TIEMPO REAL                   │ │
│  │                                                                     │ │
│  │  ┌─────────────────────┐         ┌─────────────────────────────┐  │ │
│  │  │  🔴 OpenAI Realtime │         │   🔊 ElevenLabs Streaming   │  │ │
│  │  │      API            │         │      (Español Natural)       │  │ │
│  │  │  • WebSocket native │    OR   │   • 23 idiomas              │  │ │
│  │  │  • Function calling │         │   • Voces personalizables    │  │ │
│  │  │  • <300ms latencia  │         │   • Streaming real-time      │  │ │
│  │  └─────────────────────┘         └─────────────────────────────┘  │ │
│  │                                                                     │ │
│  │  ALTERNATIVAS EVALUADAS:                                           │ │
│  │  • Deepgram Nova-3: 54% mejor WER, español nativo, $0.0077/min    │ │
│  │  • LiveKit Agents: WebRTC, código abierto, multi-plataforma       │ │
│  │  • Vapi.ai: Plataforma completa, $0.05/min, enterprise-ready      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                  │                                       │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │               🧠 CEREBRO IA - ORQUESTADOR CENTRAL                  │ │
│  │                                                                     │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │                   Claude 3.5 Sonnet                           │ │ │
│  │  │                                                               │ │ │
│  │  │  • Function Calling para cada sistema conectado               │ │ │
│  │  │  • Contexto largo (200K tokens)                               │ │ │
│  │  │  • Razonamiento multi-paso                                    │ │ │
│  │  │  • Generación de documentos legales                           │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  │                           │                                        │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │                   🧠 Mem0 - Memoria Persistente               │ │ │
│  │  │                                                               │ │ │
│  │  │  • Memoria corto plazo: contexto de sesión                   │ │ │
│  │  │  • Memoria largo plazo: preferencias, historial              │ │ │
│  │  │  • 26% mejor precisión vs full-context                        │ │ │
│  │  │  • 91% menor latencia, 90% menos tokens                       │ │ │
│  │  │  • Integración nativa: LangGraph, CrewAI                      │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  │                           │                                        │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │              🔗 MCP - Model Context Protocol                  │ │ │
│  │  │                    (Anthropic Standard)                       │ │ │
│  │  │                                                               │ │ │
│  │  │  • Estándar abierto para conectar IA con herramientas        │ │ │
│  │  │  • "USB-C para aplicaciones de IA"                            │ │ │
│  │  │  • Adoptado por OpenAI, Google, Zed, Sourcegraph             │ │ │
│  │  │  • SDKs: Python, TypeScript, Java, C#                         │ │ │
│  │  │  • Servidores pre-construidos: Postgres, Slack, GitHub       │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                  │                                       │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                 🔌 CAPA DE CONECTORES (MCP Servers)                │ │
│  │                                                                     │ │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐  │ │
│  │  │   compras  │ │ contratos  │ │  berries   │ │     actas      │  │ │
│  │  │   server   │ │   server   │ │   server   │ │    server      │  │ │
│  │  │            │ │            │ │            │ │                │  │ │
│  │  │ • facturas │ │ • empleado │ │ • análisis │ │ • generar      │  │ │
│  │  │ • proveed  │ │ • contrato │ │ • alertas  │ │ • tipos        │  │ │
│  │  │ • precios  │ │ • document │ │ • cultivos │ │ • historial    │  │ │
│  │  │ • alertas  │ │ • temporada│ │ • RAG      │ │                │  │ │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────────┘  │ │
│  │                                                                     │ │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────────────────────┐ │ │
│  │  │   agroai   │ │  vision    │ │          erp_legacy            │ │ │
│  │  │   server   │ │   server   │ │           server               │ │ │
│  │  │            │ │            │ │                                │ │ │
│  │  │ • agentes  │ │ • asistenc │ │ • MySQL bridge                 │ │ │
│  │  │ • clima    │ │ • EPP      │ │ • producción                   │ │ │
│  │  │ • cosecha  │ │ • detectio │ │ • nómina histórica             │ │ │
│  │  └────────────┘ └────────────┘ └────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                  │                                       │
└──────────────────────────────────┼───────────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  AGRO COMPRAS   │      │   CONTRATOS     │      │   BERRYVISION   │
│  INTELIGENTES   │      │   LABORALES     │      │  (Bucle Agent)  │
│                 │      │                 │      │                 │
│  Supabase       │      │  Supabase       │      │  Supabase       │
│  PostgreSQL     │      │  PostgreSQL     │      │  + PostGIS      │
│  30+ APIs       │      │  20+ APIs       │      │  + pgvector     │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                         │                         │
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│     AGROAI      │      │  VISION GUARD   │      │  ACTAS/DECISIO  │
│  MULTIAGENTES   │      │     AGRO        │      │                 │
│                 │      │                 │      │                 │
│  6 Agentes IA   │      │  FastAPI        │      │  Claude AI      │
│  LangGraph      │      │  OpenCV/YOLO    │      │  Generador      │
│  Supabase       │      │  PostgreSQL     │      │  PDF            │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

---

## 7. Stack Tecnológico Propuesto 💻

### Stack Principal (Investigación Completada)

| Capa | Tecnología | Por qué | Alternativas |
|------|------------|---------|--------------|
| **Frontend** | Next.js 14 + React | Consistente con proyectos | - |
| **UI** | shadcn/ui + Tailwind | Rápido, bonito | Radix UI |
| **Voice STT** | **OpenAI Realtime API** | WebSocket nativo, <300ms, function calling | Deepgram Nova-3, Whisper |
| **Voice TTS** | **ElevenLabs Streaming** | Voces naturales español, emociones | Cartesia, Fish Audio |
| **IA Central** | **Claude 3.5 Sonnet** | 200K contexto, function calling, docs legales | GPT-4o |
| **Memoria** | **Mem0** | 26% mejor precisión, 90% menos tokens | LangChain Memory |
| **Conectores** | **MCP (Model Context Protocol)** | Estándar Anthropic, adoptado industria | Custom APIs |
| **Orquestación** | **LangGraph** | Grafos de estado, flujos complejos | CrewAI, AutoGen |
| **Base Datos** | Supabase PostgreSQL | Ya en uso, pgvector, PostGIS | - |
| **Hosting** | Vercel + Railway | Edge functions, workers | AWS |

### Tecnologías Clave Descubiertas en Investigación

#### 🔴 OpenAI Realtime API (RECOMENDADO para MVP)
- **Qué es:** API de voz en tiempo real speech-to-speech
- **Ventajas:**
  - WebSocket nativo, latencia <300ms
  - Function calling integrado
  - Maneja interrupciones automáticamente
  - Soporte MCP servers
- **Costo:** ~$0.06/min audio
- **Ideal para:** MVP rápido con calidad enterprise

#### 🧠 Mem0 - Memoria Persistente para IA
- **Qué es:** Capa de memoria universal para agentes IA
- **Ventajas:**
  - 26% mejor precisión vs full-context
  - 91% menor latencia
  - 90% ahorro en tokens
  - Integración nativa con LangGraph, CrewAI
- **Por qué:** CEREBRO necesita recordar contexto entre sesiones
- **Funding:** $24M Serie A (validación de mercado)

#### 🔗 MCP - Model Context Protocol
- **Qué es:** Estándar abierto de Anthropic para conectar IA con herramientas
- **Ventajas:**
  - "USB-C para IA" - conexión estandarizada
  - Adoptado por OpenAI, Google, Zed
  - SDKs en Python, TypeScript, Java
  - Servidores pre-construidos (Postgres, Slack, GitHub)
- **Por qué:** Cada sistema (Compras, Contratos, etc.) será un MCP Server

#### 🎙️ Alternativas de Voz Evaluadas

| Opción | Latencia | Español | Costo | Ventaja |
|--------|----------|---------|-------|---------|
| **OpenAI Realtime** | <300ms | ✅ | $0.06/min | Todo-en-uno |
| **Deepgram Nova-3** | <200ms | ✅ Nativo | $0.0077/min | Más barato, mejor WER |
| **Vapi.ai** | <600ms | ✅ 100+ | $0.05/min | Platform completa |
| **LiveKit Agents** | Variable | ✅ | Open source | Control total |
| **ElevenLabs** | ~500ms | ✅ | $0.30/min | Mejor calidad voz |

**Recomendación:** Empezar con **OpenAI Realtime API** para MVP (simplicidad), migrar a **Deepgram + ElevenLabs** para producción (costo/calidad).

---

## 8. Fases de Implementación 📅

### FASE 1: MVP Core (3 semanas)

**Objetivo:** Conversación funcional con AGROAI + 1 sistema

| Semana | Entregables |
|--------|-------------|
| **1** | Setup: Next.js + OpenAI Realtime + UI básica chat |
| **2** | MCP Server: AGROAI (sistema principal con datos reales) |
| **3** | MCP Server: Agro Compras (consultas facturas, proveedores) |

**Criterio de éxito:**
- Preguntar "¿cuánto le debo a Fertilizantes del Norte?" → Respuesta correcta por voz

### FASE 2: Documentos + Memoria (2 semanas)

| Semana | Entregables |
|--------|-------------|
| **4** | Integrar Mem0 para contexto persistente |
| **5** | MCP Server: Actas (generación con Claude) |

**Criterio de éxito:**
- "Genera acta para empleado Juan Pérez por falta" → PDF generado

### FASE 3: Multi-Sistema + BerryVision (2 semanas)

| Semana | Entregables |
|--------|-------------|
| **6** | MCP Server: Contratos + BerryVision |
| **7** | Dashboard visual, alertas proactivas |

**Criterio de éxito:**
- "¿Hay alertas de plagas hoy?" → Respuesta con datos de BerryVision

### FASE 4: Optimización + Expansión (Ongoing)

- Refinar prompts y flujos
- Agregar Vision Guard
- App móvil
- Multi-usuario con permisos

---

## 9. Riesgos y Mitigaciones ⚠️

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Latencia alta voz | Media | Alto | OpenAI Realtime (<300ms garantizado) |
| Imprecisión español agrícola | Media | Alto | Fine-tuning vocabulario, RAG con términos |
| Costo APIs escala | Media | Medio | Deepgram ($0.0077/min) en producción |
| Complejidad multi-sistema | Alta | Alto | MCP estandariza conectores |
| Memoria contexto | Media | Alto | Mem0 resuelve (90% menos tokens) |
| Dependencia single provider | Media | Medio | Arquitectura modular (swap providers) |

---

## 10. Estimación de Costos 💰

### Costos Operativos MVP (estimados)

| Componente | Uso Estimado | Costo/mes |
|------------|--------------|-----------|
| OpenAI Realtime | 60 min/día × 30 = 1,800 min | ~$108 |
| Claude 3.5 Sonnet | 100K tokens/día | ~$90 |
| Mem0 | Plan Pro | ~$50 |
| Supabase | Ya existente | $0 |
| ElevenLabs (upgrade) | 500 min/mes | ~$99 |
| Vercel Pro | Ya existente | $0 |
| **Total MVP** | | **~$350/mes** |

### ROI Esperado

- Ahorro tiempo: 25 min/día × $50/hora = **$625/mes** mínimo
- Decisiones más rápidas: **Incalculable** pero significativo
- **Payback:** Mes 1

---

## 11. Preguntas Resueltas

### ✅ Resueltas por Investigación

| Pregunta | Respuesta |
|----------|-----------|
| ¿Mejor tech para voz real-time? | OpenAI Realtime API (MVP), Deepgram+ElevenLabs (prod) |
| ¿Cómo mantener memoria? | Mem0 - estándar de industria |
| ¿Cómo conectar sistemas? | MCP - Model Context Protocol |
| ¿Qué datos tenemos? | 35+ tablas, 100+ APIs mapeadas |
| ¿Framework de agentes? | LangGraph (control) o CrewAI (simplicidad) |

### ✅ Resueltas en Kickoff (1 Dic 2024)

| Pregunta | Respuesta de Pepe |
|----------|-------------------|
| **Nombre** | CEREBRO |
| **Consultas diarias** | Variadas + comandos como "hazme un acta administrativa" |
| **Modo de voz** | Push-to-talk (por ahora) |
| **Técnico** | A discreción de Claude |
| **Presupuesto APIs** | Sin límite, lo que cueste |
| **Sistema principal** | AGROAI - tiene datos reales, es el más grande |
| **Estado AGROAI** | En modificación, ~1 semana para estar listo |
| **Otras apps** | En proceso de afinar con datos reales |

---

## 12. Fuentes de Investigación 📚

### Voz y Real-Time AI
- [OpenAI Realtime API](https://openai.com/index/introducing-the-realtime-api/) - Documentación oficial
- [Deepgram Nova-3](https://deepgram.com/learn/introducing-nova-3-speech-to-text-api) - 54% mejor WER
- [Vapi.ai](https://vapi.ai/) - Platform de voice agents
- [LiveKit Agents](https://github.com/livekit/agents) - Framework open source

### Memoria y Contexto
- [Mem0](https://mem0.ai/) - Capa de memoria para IA ($24M funding)
- [LangChain Memory](https://www.analyticsvidhya.com/blog/2024/11/langchain-memory/) - Técnicas de memoria

### Orquestación de Agentes
- [LangGraph vs CrewAI vs AutoGen](https://medium.com/@vikaskumarsingh_60821/battle-of-ai-agent-frameworks-langgraph-vs-autogen-vs-crewai-3c7bf5c18979) - Comparativa
- [Analytics Vidhya - Top 7 Frameworks](https://www.analyticsvidhya.com/blog/2024/07/ai-agent-frameworks/)

### MCP y Conectores
- [Anthropic MCP](https://www.anthropic.com/news/model-context-protocol) - Anuncio oficial
- [MCP Documentation](https://docs.anthropic.com/en/docs/mcp)

### TTS Alternativas
- [ElevenLabs Alternatives](https://cartesia.ai/learn/top-elevenlabs-alternatives) - Comparativa 2025
- [Cartesia](https://cartesia.ai/) - 36/50 veces preferida sobre ElevenLabs

---

## 13. Próximos Pasos 🚀

### Ahora (Pepe - ~1 semana)
- [ ] Terminar de afinar AGROAI con datos reales
- [ ] Afinar otras apps conforme sea necesario

### Cuando AGROAI esté listo (Claude)
- [ ] **Semana 1-2:** Setup base + MCP Server AGROAI
- [ ] **Semana 3:** MCP Server Actas + Agro Compras
- [ ] **Semana 4:** Mem0 + BerryVision + Dashboard

### Trigger para comenzar
**Pepe avisa cuando AGROAI esté listo → Arrancamos desarrollo**

---

*Documento de kickoff completado el 1 de diciembre 2024.*
*Investigación de tecnologías: ✅ Completada*
*Mapeo de datos existentes: ✅ Completado (35+ tablas, 100+ APIs)*
*Decisiones del fundador: ✅ Documentadas*

**Estado: LISTO PARA COMENZAR cuando AGROAI esté preparado.**

/**
 * Herramientas para el Agente LEGAL
 * Integración con Actas Laborales (localhost:3000)
 */

import Anthropic from '@anthropic-ai/sdk';

const ACTAS_API = process.env.ACTAS_LABORALES_URL || 'http://localhost:3000';
const EMPRESA_ID = process.env.EMPRESA_ID || '1';

// Definición de tools para Claude
export const legalTools: Anthropic.Tool[] = [
  {
    name: 'analizar_incidente',
    description: 'Analiza un incidente laboral y detecta las faltas cometidas. Usa esto cuando el usuario describe una situación y quieres saber qué faltas aplican antes de generar un acta.',
    input_schema: {
      type: 'object' as const,
      properties: {
        descripcion_hechos: {
          type: 'string',
          description: 'Descripción completa del incidente (qué pasó, quién, cuándo, dónde)'
        }
      },
      required: ['descripcion_hechos']
    }
  },
  {
    name: 'generar_acta',
    description: 'Genera un acta administrativa completa. Usa esto cuando tengas todos los datos necesarios: nombre del trabajador, descripción de los hechos, fecha, lugar, y personal involucrado.',
    input_schema: {
      type: 'object' as const,
      properties: {
        trabajador_nombre: {
          type: 'string',
          description: 'Nombre completo del trabajador'
        },
        trabajador_puesto: {
          type: 'string',
          description: 'Puesto del trabajador (ej: Operario, Supervisor)'
        },
        trabajador_area: {
          type: 'string',
          description: 'Área donde trabaja (ej: Producción, Almacén, Empaque)'
        },
        descripcion_hechos: {
          type: 'string',
          description: 'Descripción detallada de los hechos'
        },
        fecha_hechos: {
          type: 'string',
          description: 'Fecha de los hechos en formato YYYY-MM-DD. Si no se especifica, usar fecha actual.'
        },
        hora_hechos: {
          type: 'string',
          description: 'Hora aproximada de los hechos (ej: 14:30). Opcional.'
        },
        lugar_hechos: {
          type: 'string',
          description: 'Lugar específico donde ocurrieron los hechos'
        },
        guardar: {
          type: 'boolean',
          description: 'Si guardar el acta en la base de datos (true) o solo previsualizarla (false)'
        }
      },
      required: ['trabajador_nombre', 'descripcion_hechos']
    }
  },
  {
    name: 'buscar_faltas',
    description: 'Busca en el catálogo de faltas laborales por palabra clave. Útil para encontrar el artículo de la LFT aplicable.',
    input_schema: {
      type: 'object' as const,
      properties: {
        keyword: {
          type: 'string',
          description: 'Palabra clave para buscar (ej: robo, ebriedad, faltas, desobediencia)'
        }
      },
      required: ['keyword']
    }
  },
  {
    name: 'obtener_pruebas_recomendadas',
    description: 'Obtiene las pruebas/evidencias recomendadas para sustentar un acta según el tipo de falta.',
    input_schema: {
      type: 'object' as const,
      properties: {
        descripcion_hechos: {
          type: 'string',
          description: 'Descripción del incidente para detectar qué tipo de pruebas necesita'
        }
      },
      required: ['descripcion_hechos']
    }
  },
  {
    name: 'listar_actas_recientes',
    description: 'Lista las actas recientes de la empresa. Útil para ver el historial o buscar actas anteriores de un trabajador.',
    input_schema: {
      type: 'object' as const,
      properties: {
        trabajador_nombre: {
          type: 'string',
          description: 'Filtrar por nombre del trabajador (opcional)'
        },
        limite: {
          type: 'number',
          description: 'Número máximo de actas a mostrar (default: 10)'
        }
      },
      required: []
    }
  },
  {
    name: 'exportar_acta',
    description: 'Exporta un acta existente a PDF o Word y devuelve el link de descarga.',
    input_schema: {
      type: 'object' as const,
      properties: {
        acta_id: {
          type: 'number',
          description: 'ID del acta a exportar'
        },
        formato: {
          type: 'string',
          enum: ['pdf', 'word'],
          description: 'Formato de exportación: pdf o word'
        }
      },
      required: ['acta_id', 'formato']
    }
  }
];

// Ejecutar herramientas
export async function executeLegalTool(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<string> {
  try {
    switch (toolName) {
      case 'analizar_incidente':
        return await analizarIncidente(toolInput.descripcion_hechos as string);

      case 'generar_acta':
        return await generarActa(toolInput);

      case 'buscar_faltas':
        return await buscarFaltas(toolInput.keyword as string);

      case 'obtener_pruebas_recomendadas':
        return await obtenerPruebas(toolInput.descripcion_hechos as string);

      case 'listar_actas_recientes':
        return await listarActas(
          toolInput.trabajador_nombre as string | undefined,
          toolInput.limite as number | undefined
        );

      case 'exportar_acta':
        return await exportarActa(
          toolInput.acta_id as number,
          toolInput.formato as 'pdf' | 'word'
        );

      default:
        return `Error: Herramienta "${toolName}" no reconocida`;
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`[TOOL ERROR] ${toolName}:`, msg);
    return `Error ejecutando ${toolName}: ${msg}`;
  }
}

// Implementaciones
async function analizarIncidente(descripcion: string): Promise<string> {
  const res = await fetch(`${ACTAS_API}/api/chat/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: descripcion })
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();

  // Formatear respuesta para el agente
  let resultado = `**Análisis del Incidente**\n\n`;

  if (data.faltas_detectadas && data.faltas_detectadas.length > 0) {
    resultado += `**Faltas detectadas (${data.faltas_detectadas.length}):**\n`;
    for (const falta of data.faltas_detectadas) {
      resultado += `- ${falta.nombre} (${falta.categoria}) - Art. ${falta.articulo_lft}\n`;
      resultado += `  Gravedad: ${falta.gravedad} | Sanción sugerida: ${falta.sancion_sugerida}\n`;
    }
  } else {
    resultado += `No se detectaron faltas específicas en la descripción.\n`;
  }

  if (data.sancion_recomendada) {
    resultado += `\n**Sanción recomendada:** ${data.sancion_recomendada}\n`;
  }

  return resultado;
}

async function generarActa(input: Record<string, unknown>): Promise<string> {
  const hoy = new Date().toISOString().split('T')[0];

  const payload = {
    empresa_id: parseInt(EMPRESA_ID),
    trabajador_nombre: input.trabajador_nombre,
    trabajador_puesto: input.trabajador_puesto || 'Operario',
    trabajador_area: input.trabajador_area || 'Producción',
    descripcion_hechos: input.descripcion_hechos,
    fecha_hechos: input.fecha_hechos || hoy,
    hora_hechos: input.hora_hechos || '08:00',
    lugar_hechos: input.lugar_hechos || 'Instalaciones de la empresa',
    // Personal por defecto (se puede configurar)
    jefe_nombre: 'Supervisor de Área',
    jefe_puesto: 'Supervisor',
    rh_nombre: 'Recursos Humanos',
    representante_nombre: 'Representante Sindical',
    testigo1_nombre: 'Testigo 1',
    testigo1_puesto: 'Colaborador',
    testigo2_nombre: 'Testigo 2',
    testigo2_puesto: 'Colaborador',
    guardar_en_db: input.guardar !== false,
    estado_inicial: 'borrador'
  };

  const res = await fetch(`${ACTAS_API}/api/actas/analizar-multifalta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error generando acta: ${error}`);
  }

  const data = await res.json();

  let resultado = `**Acta Generada Exitosamente**\n\n`;
  resultado += `📄 **Folio:** ${data.acta?.folio || 'N/A'}\n`;
  resultado += `👤 **Trabajador:** ${input.trabajador_nombre}\n`;
  resultado += `⚠️ **Tipo:** ${data.tipo_acta || data.sancion_recomendada}\n`;

  if (data.faltas_detectadas && data.faltas_detectadas.length > 0) {
    resultado += `\n**Faltas incluidas (${data.faltas_detectadas.length}):**\n`;
    for (const falta of data.faltas_detectadas) {
      resultado += `- ${falta.nombre}\n`;
    }
  }

  if (data.acta?.id) {
    resultado += `\n**ID del acta:** ${data.acta.id}\n`;
    resultado += `Puedes exportarla a PDF o Word usando el ID.\n`;
  }

  return resultado;
}

async function buscarFaltas(keyword: string): Promise<string> {
  const res = await fetch(`${ACTAS_API}/api/faltas/buscar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword, limit: 5 })
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();

  if (!data.faltas || data.faltas.length === 0) {
    return `No se encontraron faltas con la palabra "${keyword}"`;
  }

  let resultado = `**Faltas encontradas para "${keyword}":**\n\n`;
  for (const falta of data.faltas) {
    resultado += `**${falta.nombre}**\n`;
    resultado += `- Categoría: ${falta.categoria}\n`;
    resultado += `- Artículo LFT: ${falta.articulo_lft}\n`;
    resultado += `- Gravedad: ${falta.gravedad}\n`;
    resultado += `- Sanción: ${falta.sancion_sugerida}\n\n`;
  }

  return resultado;
}

async function obtenerPruebas(descripcion: string): Promise<string> {
  const res = await fetch(`${ACTAS_API}/api/actas/pruebas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descripcion_hechos: descripcion })
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();

  let resultado = `**Pruebas Recomendadas**\n\n`;

  if (data.categorias_detectadas?.length > 0) {
    resultado += `Categorías detectadas: ${data.categorias_detectadas.join(', ')}\n\n`;
  }

  if (data.pruebas_esenciales?.length > 0) {
    resultado += `**Pruebas ESENCIALES (obligatorias):**\n`;
    for (const p of data.pruebas_esenciales) {
      resultado += `- ${p.nombre}: ${p.descripcion}\n`;
    }
    resultado += '\n';
  }

  if (data.pruebas_recomendadas?.length > 0) {
    resultado += `**Pruebas recomendadas:**\n`;
    for (const p of data.pruebas_recomendadas) {
      resultado += `- ${p.nombre}\n`;
    }
  }

  return resultado;
}

async function listarActas(
  trabajadorNombre?: string,
  limite?: number
): Promise<string> {
  const params = new URLSearchParams({
    empresa_id: EMPRESA_ID,
    limit: String(limite || 10)
  });

  if (trabajadorNombre) {
    params.append('trabajador_nombre', trabajadorNombre);
  }

  const res = await fetch(`${ACTAS_API}/api/actas?${params}`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();

  if (!data.actas || data.actas.length === 0) {
    return trabajadorNombre
      ? `No se encontraron actas para "${trabajadorNombre}"`
      : 'No hay actas registradas';
  }

  let resultado = `**Actas Recientes (${data.actas.length}):**\n\n`;

  for (const acta of data.actas) {
    resultado += `📄 **${acta.folio}** - ${acta.trabajador_nombre}\n`;
    resultado += `   Tipo: ${acta.tipo_acta} | Estado: ${acta.estado}\n`;
    resultado += `   Fecha: ${acta.fecha_hechos} | ID: ${acta.id}\n\n`;
  }

  return resultado;
}

async function exportarActa(
  actaId: number,
  formato: 'pdf' | 'word'
): Promise<string> {
  const endpoint = formato === 'pdf'
    ? `/api/exportar/pdf/${actaId}`
    : `/api/exportar/word/${actaId}`;

  const res = await fetch(`${ACTAS_API}${endpoint}`);

  if (!res.ok) {
    throw new Error(`Error exportando: ${res.status}`);
  }

  const data = await res.json();

  if (data.url) {
    return `**Documento exportado:**\n📥 [Descargar ${formato.toUpperCase()}](${data.url})\n\nFolio: ${data.folio || 'N/A'}`;
  }

  return `Acta ${actaId} exportada a ${formato}`;
}

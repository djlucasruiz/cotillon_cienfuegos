import { NextRequest, NextResponse } from "next/server"

// Código postal de origen: Concordia, Entre Ríos
const CP_ORIGEN = "3200"

// Tabla de tarifas estimadas por zona basada en distancia desde Concordia
// Usamos la API de código postal del gobierno argentino para obtener la provincia
// y calculamos el costo según zonas postales argentinas

const TARIFAS_POR_ZONA: Record<string, { nombre: string; base: number; porKg: number }> = {
  // Zona 1: Entre Ríos (misma provincia)
  "E": { nombre: "Entre Ríos", base: 1800, porKg: 120 },
  // Zona 2: Litoral cercano
  "S": { nombre: "Santa Fe", base: 2400, porKg: 150 },
  "W": { nombre: "Corrientes", base: 2400, porKg: 150 },
  "N": { nombre: "Misiones", base: 3200, porKg: 180 },
  // Zona 3: Centro
  "X": { nombre: "Córdoba", base: 3000, porKg: 160 },
  "B": { nombre: "Buenos Aires (Pcia)", base: 3200, porKg: 170 },
  "C": { nombre: "CABA", base: 3400, porKg: 175 },
  // Zona 4: Norte
  "T": { nombre: "Tucumán", base: 4200, porKg: 200 },
  "K": { nombre: "Catamarca", base: 4500, porKg: 210 },
  "A": { nombre: "Salta", base: 4800, porKg: 220 },
  "G": { nombre: "Santiago del Estero", base: 4200, porKg: 200 },
  "H": { nombre: "Chaco", base: 4000, porKg: 195 },
  "P": { nombre: "Formosa", base: 4800, porKg: 220 },
  "Y": { nombre: "Jujuy", base: 5000, porKg: 230 },
  // Zona 5: Cuyo
  "D": { nombre: "San Luis", base: 4000, porKg: 195 },
  "J": { nombre: "San Juan", base: 4500, porKg: 210 },
  "M": { nombre: "Mendoza", base: 4500, porKg: 210 },
  // Zona 6: Patagonia
  "Q": { nombre: "Neuquén", base: 5500, porKg: 250 },
  "R": { nombre: "Río Negro", base: 5800, porKg: 260 },
  "U": { nombre: "Chubut", base: 6200, porKg: 280 },
  "Z": { nombre: "Santa Cruz", base: 7000, porKg: 320 },
  "V": { nombre: "Tierra del Fuego", base: 8500, porKg: 380 },
  "F": { nombre: "La Rioja", base: 4200, porKg: 200 },
  "L": { nombre: "La Pampa", base: 4000, porKg: 195 },
}

// Mapa CP → código de provincia
// Los primeros 1-2 dígitos del CP argentino determinan la región
function getZoneFromCP(cp: string): string | null {
  const n = parseInt(cp, 10)
  if (isNaN(n)) return null

  // Entre Ríos: 3100-3299, 3220-3299, 3300-3399 (aproximado)
  if ((n >= 3100 && n <= 3499)) return "E"
  // Corrientes: 3400-3799
  if (n >= 3400 && n <= 3799) return "W"
  // Misiones: 3300-3399, 3380-3399
  if (n >= 3300 && n < 3400) return "N"
  // Chaco: 3500-3799 (parte)
  if (n >= 3500 && n <= 3700) return "H"
  // Formosa: 3600
  if (n >= 3600 && n <= 3699) return "P"
  // Santa Fe: 2000-2499, 3000-3099
  if ((n >= 2000 && n <= 2499) || (n >= 3000 && n <= 3099)) return "S"
  // Córdoba: 5000-5999
  if (n >= 5000 && n <= 5999) return "X"
  // CABA: 1000-1499
  if (n >= 1000 && n <= 1499) return "C"
  // Buenos Aires pcia: 1500-1999, 6000-8499
  if ((n >= 1500 && n <= 1999) || (n >= 6000 && n <= 8499)) return "B"
  // Santiago del Estero: 4200-4299
  if (n >= 4200 && n <= 4299) return "G"
  // Tucumán: 4000-4199
  if (n >= 4000 && n <= 4199) return "T"
  // Catamarca: 4700-4799
  if (n >= 4700 && n <= 4799) return "K"
  // Salta: 4400-4499
  if (n >= 4400 && n <= 4499) return "A"
  // Jujuy: 4600-4699
  if (n >= 4600 && n <= 4699) return "Y"
  // San Luis: 5700-5799
  if (n >= 5700 && n <= 5799) return "D"
  // San Juan: 5400-5499
  if (n >= 5400 && n <= 5499) return "J"
  // Mendoza: 5500-5599
  if (n >= 5500 && n <= 5599) return "M"
  // La Rioja: 5300-5399
  if (n >= 5300 && n <= 5399) return "F"
  // La Pampa: 6300-6499
  if (n >= 6300 && n <= 6499) return "L"
  // Neuquén: 8300-8399
  if (n >= 8300 && n <= 8399) return "Q"
  // Río Negro: 8400-8499, 8500-8599
  if (n >= 8400 && n <= 8599) return "R"
  // Chubut: 9000-9199
  if (n >= 9000 && n <= 9199) return "U"
  // Santa Cruz: 9200-9399
  if (n >= 9200 && n <= 9399) return "Z"
  // Tierra del Fuego: 9400-9499
  if (n >= 9400 && n <= 9499) return "V"

  return null
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cp = (searchParams.get("cp") ?? "").trim().replace(/\D/g, "")
  const pesoStr = searchParams.get("peso") ?? "0.5"
  const peso = Math.max(0.5, parseFloat(pesoStr))

  if (!cp || cp.length < 4 || cp.length > 5) {
    return NextResponse.json({ error: "Código postal inválido" }, { status: 400 })
  }

  const zone = getZoneFromCP(cp)
  if (!zone) {
    return NextResponse.json({ error: "Código postal no reconocido" }, { status: 404 })
  }

  const tarifa = TARIFAS_POR_ZONA[zone]
  if (!tarifa) {
    return NextResponse.json({ error: "Zona no disponible" }, { status: 404 })
  }

  // Es envío local en Entre Ríos
  const esMismaProvincia = zone === "E"

  // Calcular costo
  const costo = tarifa.base + Math.ceil(peso) * tarifa.porKg
  // Redondear a múltiplos de 50
  const costoFinal = Math.ceil(costo / 50) * 50

  // Tiempo estimado de entrega en días hábiles
  const diasEstimados =
    zone === "E" ? "2-3" :
    ["S", "W", "X", "B", "C"].includes(zone) ? "3-5" :
    ["N", "H", "P", "T", "K", "A", "G", "Y", "D", "J", "M", "F", "L"].includes(zone) ? "5-7" :
    "7-12"

  return NextResponse.json({
    cp,
    zona: zone,
    provincia: tarifa.nombre,
    esMismaProvincia,
    costo: costoFinal,
    diasEstimados,
    peso,
    cpOrigen: CP_ORIGEN,
    localidadOrigen: "Concordia, Entre Ríos",
  })
}

import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN

  if (!token) {
    console.log("[v0] INSTAGRAM_ACCESS_TOKEN no está configurado")
    return NextResponse.json(
      { error: "Token de Instagram no configurado. Agregalo en Settings > Vars." },
      { status: 500 }
    )
  }

  try {
    const apiUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${token}`

    console.log("[v0] Llamando a Instagram API...")
    const res = await fetch(apiUrl, { cache: "no-store" })

    const raw = await res.text()
    console.log("[v0] Status:", res.status)
    console.log("[v0] Respuesta:", raw.slice(0, 300))

    let data: { data?: Array<{
      id: string
      caption?: string
      media_type: string
      media_url: string
      permalink: string
      timestamp: string
    }>; error?: { message: string; code: number } }

    try {
      data = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: "Respuesta inválida de Instagram" }, { status: 502 })
    }

    if (!res.ok || data.error) {
      const msg = data.error?.message ?? `Error HTTP ${res.status}`
      console.log("[v0] Error de Instagram:", msg)
      return NextResponse.json({ error: msg }, { status: 502 })
    }

    const posts = (data.data ?? [])
      .filter((p) => p.media_type === "IMAGE" || p.media_type === "CAROUSEL_ALBUM")
      .map((p) => ({
        id: p.id,
        caption: p.caption ?? "",
        mediaUrl: p.media_url,
        permalink: p.permalink,
        timestamp: p.timestamp,
      }))

    console.log("[v0] Posts obtenidos:", posts.length)
    return NextResponse.json({ posts })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.log("[v0] Excepción:", msg)
    return NextResponse.json({ error: `Error de conexión: ${msg}` }, { status: 500 })
  }
}

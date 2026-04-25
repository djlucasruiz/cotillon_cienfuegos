import { NextResponse } from "next/server"

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN

  if (!token) {
    return NextResponse.json({
      status: "ERROR",
      problema: "La variable de entorno INSTAGRAM_ACCESS_TOKEN no está configurada.",
      solucion: "Ir a Settings > Vars en v0 y agregar la variable INSTAGRAM_ACCESS_TOKEN con el token.",
    })
  }

  // Intentar llamar a la API de Instagram
  try {
    const res = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${token}`
    )
    const data = await res.json()

    if (data.error) {
      return NextResponse.json({
        status: "ERROR",
        token_encontrado: true,
        token_preview: token.slice(0, 20) + "...",
        error_instagram: data.error,
        codigo: data.error.code,
        mensaje: data.error.message,
        solucion:
          data.error.code === 190
            ? "El token expiró. Necesitás generar uno nuevo desde Meta Developer Console."
            : "Revisar permisos del token en Meta Developer Console.",
      })
    }

    // Token válido - ahora traer los posts
    const mediaRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,timestamp&limit=6&access_token=${token}`
    )
    const mediaData = await mediaRes.json()

    return NextResponse.json({
      status: "OK",
      usuario: data.username,
      id: data.id,
      token_preview: token.slice(0, 20) + "...",
      cantidad_posts: mediaData.data?.length ?? 0,
      primer_post: mediaData.data?.[0] ?? null,
    })
  } catch (err) {
    return NextResponse.json({
      status: "ERROR",
      problema: "Error de red al conectar con Instagram",
      detalle: String(err),
    })
  }
}

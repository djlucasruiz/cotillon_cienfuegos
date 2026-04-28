"use client"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselImage {
  id: string
  image_url: string
  title?: string
  subtitle?: string
}

export function Carousel() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/carousel")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setImages(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % images.length)
  }, [images.length])

  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length)

  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(next, 3500)
    return () => clearInterval(interval)
  }, [images.length, next])

  if (loading) return (
    <div className="w-full h-[500px] rounded-3xl animate-pulse" style={{ backgroundColor: "oklch(0.9 0 0)" }} />
  )

  if (images.length === 0) return (
    <div className="w-full h-[500px] rounded-3xl flex items-center justify-center" style={{ backgroundColor: "oklch(0.93 0.05 90)" }}>
      <p className="text-sm" style={{ color: "oklch(0.5 0 0)" }}>Sin imágenes cargadas</p>
    </div>
  )

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl" style={{ height: "500px" }}>
      {/* Images */}
      {images.map((img, i) => (
        <div
          key={img.id}
          className="absolute inset-0 transition-all duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, transform: i === current ? "scale(1)" : "scale(1.05)" }}
        >
          <img
            src={img.image_url}
            alt={img.title || "Novedad"}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          {(img.title || img.subtitle) && (
            <div
              className="absolute bottom-0 left-0 right-0 p-6"
              style={{ background: "linear-gradient(to top, oklch(0 0 0 / 0.7), transparent)" }}
            >
              {img.title && <p className="text-white font-extrabold text-2xl">{img.title}</p>}
              {img.subtitle && <p className="text-white/80 text-sm mt-1">{img.subtitle}</p>}
            </div>
          )}
        </div>
      ))}

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: "oklch(1 0 0 / 0.8)", color: "oklch(0.2 0 0)" }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: "oklch(1 0 0 / 0.8)", color: "oklch(0.2 0 0)" }}
          >
            <ChevronRight size={20} />
          </button>
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  backgroundColor: i === current ? "oklch(1 0 0)" : "oklch(1 0 0 / 0.5)"
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

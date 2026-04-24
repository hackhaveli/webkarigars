"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  vx: number
  vy: number
  opacity: number
  opacityDir: number
  baseY: number
  drift: number
}

export function GoldParticles({ density = 60 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0

    const resize = () => {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    const init = () => {
      particlesRef.current = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        baseY: Math.random() * height,
        size: Math.random() * 1.6 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.25 - 0.05,
        opacity: Math.random() * 0.6 + 0.2,
        opacityDir: Math.random() > 0.5 ? 1 : -1,
        drift: Math.random() * Math.PI * 2,
      }))
    }

    resize()
    init()

    const onResize = () => {
      resize()
      init()
    }
    window.addEventListener("resize", onResize)

    let t = 0
    const render = () => {
      t += 0.01
      ctx.clearRect(0, 0, width, height)

      particlesRef.current.forEach((p) => {
        p.drift += 0.008
        p.x += p.vx + Math.sin(p.drift) * 0.25
        p.y += p.vy

        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        p.opacity += 0.005 * p.opacityDir
        if (p.opacity > 0.8) p.opacityDir = -1
        if (p.opacity < 0.15) p.opacityDir = 1

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
        gradient.addColorStop(0, `rgba(230, 199, 122, ${p.opacity})`)
        gradient.addColorStop(0.4, `rgba(201, 169, 97, ${p.opacity * 0.4})`)
        gradient.addColorStop(1, "rgba(201, 169, 97, 0)")

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = `rgba(245, 241, 232, ${p.opacity})`
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2)
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener("resize", onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}

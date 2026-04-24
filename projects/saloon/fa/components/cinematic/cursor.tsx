"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function Cursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const trailX = useMotionValue(-100)
  const trailY = useMotionValue(-100)

  const springX = useSpring(cursorX, { damping: 30, stiffness: 400, mass: 0.2 })
  const springY = useSpring(cursorY, { damping: 30, stiffness: 400, mass: 0.2 })
  const trailSpringX = useSpring(trailX, { damping: 25, stiffness: 150, mass: 0.5 })
  const trailSpringY = useSpring(trailY, { damping: 25, stiffness: 150, mass: 0.5 })

  const [variant, setVariant] = useState<"default" | "hover" | "text">("default")
  const [visible, setVisible] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches
    if (isTouch) return

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      trailX.set(e.clientX)
      trailY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("[data-cursor='hover']") || target.closest("button") || target.closest("a")) {
        setVariant("hover")
      } else if (target.closest("[data-cursor='text']")) {
        setVariant("text")
      } else {
        setVariant("default")
      }
    }

    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseover", over)
    document.documentElement.addEventListener("mouseleave", leave)
    document.documentElement.addEventListener("mouseenter", enter)

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseover", over)
      document.documentElement.removeEventListener("mouseleave", leave)
      document.documentElement.removeEventListener("mouseenter", enter)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [cursorX, cursorY, trailX, trailY, visible])

  return (
    <>
      {/* Trailing outer ring */}
      <motion.div
        className="custom-cursor pointer-events-none fixed left-0 top-0 z-[90] hidden md:block"
        style={{
          x: trailSpringX,
          y: trailSpringY,
          opacity: visible ? 1 : 0,
        }}
      >
        <motion.div
          className="rounded-full border border-[#c9a961]/50"
          animate={{
            width: variant === "hover" ? 64 : variant === "text" ? 8 : 32,
            height: variant === "hover" ? 64 : variant === "text" ? 48 : 32,
            x: variant === "hover" ? -32 : variant === "text" ? -4 : -16,
            y: variant === "hover" ? -32 : variant === "text" ? -24 : -16,
            borderColor:
              variant === "hover" ? "rgba(230, 199, 122, 0.8)" : "rgba(201, 169, 97, 0.5)",
          }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="custom-cursor pointer-events-none fixed left-0 top-0 z-[91] hidden md:block"
        style={{
          x: springX,
          y: springY,
          opacity: visible ? 1 : 0,
        }}
      >
        <motion.div
          className="rounded-full bg-[#e6c77a]"
          animate={{
            width: variant === "hover" ? 4 : 4,
            height: variant === "hover" ? 4 : 4,
            x: -2,
            y: -2,
            boxShadow:
              variant === "hover"
                ? "0 0 16px rgba(230, 199, 122, 0.8)"
                : "0 0 8px rgba(201, 169, 97, 0.5)",
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  )
}

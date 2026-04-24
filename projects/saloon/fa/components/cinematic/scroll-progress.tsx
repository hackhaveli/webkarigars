"use client"

import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useBrand } from "@/lib/brand-context"

export function ScrollProgress() {
  const brandName = useBrand()
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { damping: 30, stiffness: 200 })
  const display = useTransform(scrollYProgress, (v) =>
    String(Math.round(v * 100)).padStart(3, "0"),
  )

  return (
    <div className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
      <motion.div className="font-mono text-[9px] uppercase tracking-luxury text-[#c9a961]/70">
        <motion.span>{display}</motion.span>
      </motion.div>
      <div className="relative h-40 w-px overflow-hidden bg-[#c9a961]/15">
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute inset-0 bg-gradient-to-b from-[#c9a961] to-[#8a7340]"
        />
      </div>
      <motion.div className="font-mono text-[9px] uppercase tracking-luxury text-[#8a8072]">
        {brandName}
      </motion.div>
    </div>
  )
}

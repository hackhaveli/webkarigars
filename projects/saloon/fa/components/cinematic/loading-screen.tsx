"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useBrand } from "@/lib/brand-context"

export function LoadingScreen() {
  const brandName = useBrand()
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 2200
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setProgress(p)
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => setVisible(false), 400)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060606]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
        >
          {/* Radial gold glow behind logo */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(201,169,97,0.15) 0%, rgba(201,169,97,0.04) 40%, transparent 70%)",
              filter: "blur(40px)",
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 1.1, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex items-baseline gap-5 font-serif text-[#f5f1e8]"
          >
            <span className="text-4xl md:text-6xl tracking-wide">{brandName}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 font-sans text-[10px] uppercase tracking-luxury text-[#8a8072] md:text-[11px]"
          >
            Fine Jewellery · Est. 2019
          </motion.div>

          {/* Progress line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-16 left-1/2 h-px w-[200px] -translate-x-1/2 overflow-hidden bg-[#c9a961]/15"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[#c9a961] to-transparent"
              style={{ width: `${progress * 100}%` }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[#8a8072]"
          >
            {String(Math.round(progress * 100)).padStart(3, "0")}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

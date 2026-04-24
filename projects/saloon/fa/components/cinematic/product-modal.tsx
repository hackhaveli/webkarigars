"use client"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useEffect } from "react"
import type { Product } from "./collection"
import { useBrand } from "@/lib/brand-context"

export function ProductModal({
  product,
  onClose,
}: {
  product: Product | null
  onClose: () => void
}) {
  const brandName = useBrand()
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [product])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#060606]/90 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-4 grid w-full max-w-[1200px] grid-cols-1 gap-0 border border-[#c9a961]/20 bg-[#0a0a0a] md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              data-cursor="hover"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center border border-[#c9a961]/30 bg-[#0a0a0a]/80 text-[#e6c77a] transition-all hover:border-[#c9a961] hover:text-[#f5f1e8]"
              aria-label="Close"
            >
              <span className="relative block h-4 w-4">
                <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
                <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
              </span>
            </button>

            {/* Image */}
            <motion.div
              className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/30 to-transparent" />
            </motion.div>

            {/* Details */}
            <div className="flex flex-col justify-between gap-10 p-8 md:p-14">
              <div className="space-y-6">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="font-sans text-[10px] uppercase tracking-luxury text-[#c9a961]"
                >
                  {product.kind}
                </motion.p>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="font-serif text-5xl italic text-[#f5f1e8] md:text-7xl"
                >
                  {product.name}
                </motion.h3>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="h-px w-16 origin-left bg-[#c9a961]"
                />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.8 }}
                  className="font-sans text-sm leading-[1.8] text-[#8a8072] md:text-base"
                >
                  {product.description}
                </motion.p>

                {/* Specs */}
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="mt-8 space-y-3 border-t border-[#c9a961]/10 pt-6 font-sans text-xs"
                >
                  {[
                    ["Metal", "18kt Champagne Gold"],
                    ["Stones", "Hand-selected Brilliants · VS+"],
                    ["Origin", "Hand-finished · Mumbai Atelier"],
                    ["Lead time", "4 — 6 weeks bespoke"],
                  ].map(([k, v]) => (
                    <li key={k} className="flex justify-between gap-4">
                      <span className="uppercase tracking-[0.15em] text-[#8a8072]">{k}</span>
                      <span className="text-[#e8e2d0]">{v}</span>
                    </li>
                  ))}
                </motion.ul>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href={`https://wa.me/919999999999?text=${encodeURIComponent(
                    `Hello ${brandName} — I would like a private viewing of ${product.name} (${product.kind}).`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="btn-luxury group inline-flex flex-1 items-center justify-center gap-3 bg-[#c9a961] px-8 py-4 font-sans text-[10px] uppercase tracking-luxury text-[#0a0a0a] transition-all hover:bg-[#e6c77a]"
                >
                  Enquire on WhatsApp
                  <span className="inline-block h-px w-5 bg-[#0a0a0a] transition-all group-hover:w-7" />
                </a>
                <button
                  onClick={onClose}
                  data-cursor="hover"
                  className="inline-flex items-center justify-center gap-3 border border-[#c9a961]/40 px-8 py-4 font-sans text-[10px] uppercase tracking-luxury text-[#e6c77a] transition-all hover:border-[#c9a961] hover:text-[#f5f1e8]"
                >
                  Close
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

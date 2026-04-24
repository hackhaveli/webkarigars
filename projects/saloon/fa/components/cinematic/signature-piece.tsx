"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
import { GoldParticles } from "./gold-particles"
import { useBrand } from "@/lib/brand-context"

export function SignaturePiece() {
  const brandName = useBrand()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const rotate = useTransform(scrollYProgress, [0, 1], [-12, 12])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.95])
  const imageY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"])
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const labelOpacity = useTransform(scrollYProgress, [0.15, 0.4, 0.7, 0.9], [0, 1, 1, 0])
  const titleOpacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75, 0.95], [0, 1, 1, 0])
  const ghostOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 0.08])

  return (
    <section
      id="signature"
      ref={ref}
      className="relative h-[200vh] w-full overflow-hidden bg-[#060606]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Radial gold backdrop */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0"
        >
          <div
            className="absolute left-1/2 top-1/2 h-[90vh] w-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(201,169,97,0.14) 0%, rgba(201,169,97,0.04) 35%, transparent 65%)",
              filter: "blur(30px)",
            }}
          />
        </motion.div>

        {/* Particles */}
        <div className="absolute inset-0 opacity-70">
          <GoldParticles density={50} />
        </div>

        {/* Giant type behind */}
        <motion.span
          style={{ opacity: ghostOpacity }}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-serif text-[28vw] italic leading-none text-[#c9a961]"
          aria-hidden
        >
          {brandName}
        </motion.span>

        {/* Label */}
        <motion.div
          style={{ opacity: labelOpacity }}
          className="absolute left-6 top-24 flex items-center gap-3 font-sans text-[10px] uppercase tracking-luxury text-[#c9a961] md:left-12 md:top-32"
        >
          <span className="h-px w-8 bg-[#c9a961]/60" />
          03 · Signature Piece
        </motion.div>

        {/* Rotating product */}
        <motion.div
          style={{
            y: imageY,
            rotate,
            scale,
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative aspect-square w-[85vw] max-w-[560px]">
            {/* Orbiting ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-10%] rounded-full border border-[#c9a961]/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-18%] rounded-full border border-dashed border-[#c9a961]/10"
            />

            {/* Reflection light sweep */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-10 rounded-full opacity-50"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 40%, rgba(230,199,122,0.35) 50%, transparent 60%)",
                  backgroundSize: "300% 100%",
                  mixBlendMode: "screen",
                }}
              />
            </div>

            {/* Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-full shadow-[0_0_120px_rgba(201,169,97,0.25)]">
              <Image
                src="/signature-piece.jpg"
                alt="Signature piece"
                fill
                sizes="560px"
                className="object-cover"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#060606]/40 via-transparent to-transparent" />
            </div>

            {/* Inner glow */}
            <div
              className="pointer-events-none absolute -inset-8 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, transparent 55%, rgba(201,169,97,0.2) 60%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="absolute inset-x-0 bottom-16 z-10 px-6 text-center md:bottom-24"
        >
          <p className="mb-3 font-sans text-[10px] uppercase tracking-luxury text-[#c9a961]">
            The House Signature
          </p>
          <h2 className="font-serif text-5xl italic leading-[1] text-[#f5f1e8] md:text-8xl lg:text-9xl">
            <span className="text-gold-shimmer">La Lumière</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md font-sans text-sm leading-relaxed text-[#8a8072]">
            The founding piece. A single pear-cut diamond set in a six-prong halo of hand-worked gold —
            released once a year, in editions of twelve.
          </p>
        </motion.div>

        {/* Corner marks */}
        <div className="pointer-events-none absolute left-6 top-6 h-8 w-8 border-l border-t border-[#c9a961]/20 md:left-12 md:top-12" />
        <div className="pointer-events-none absolute right-6 top-6 h-8 w-8 border-r border-t border-[#c9a961]/20 md:right-12 md:top-12" />
        <div className="pointer-events-none absolute left-6 bottom-6 h-8 w-8 border-b border-l border-[#c9a961]/20 md:left-12 md:bottom-12" />
        <div className="pointer-events-none absolute right-6 bottom-6 h-8 w-8 border-b border-r border-[#c9a961]/20 md:right-12 md:bottom-12" />
      </div>
    </section>
  )
}

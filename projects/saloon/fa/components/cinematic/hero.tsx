"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { GoldParticles } from "./gold-particles"
import { useBrand } from "@/lib/brand-context"


export function Hero() {
  const brandName = useBrand()
  const title = "Crafted to be Timeless".split("")
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25])
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0.85])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-[120vh] w-full overflow-hidden bg-[#060606]"
    >
      {/* Parallax image */}
      <motion.div
        style={{ scale: imgScale, y: imgY }}
        className="absolute inset-0 h-full w-full"
      >
        <Image
          src="/hero-jewelry.jpg"
          alt={`${brandName} fine jewellery`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <motion.div
          className="absolute inset-0 bg-[#060606]"
          style={{ opacity: overlayOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/60 via-transparent to-[#060606]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606]/60 via-transparent to-[#060606]/60" />
      </motion.div>

      {/* Light leaks */}
      <div className="light-leak left-[-10vw] top-[-10vw]" />
      <div className="light-leak right-[-10vw] bottom-[10vw]" />

      {/* Particles */}
      <div className="absolute inset-0">
        <GoldParticles density={80} />
      </div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity: contentOpacity }}
        className="sticky top-0 flex h-screen flex-col items-center justify-center px-6 text-center"
      >
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex items-center gap-4 font-sans text-[10px] uppercase tracking-luxury text-[#c9a961]"
        >
          <span className="h-px w-10 bg-[#c9a961]/60" />
          <span>Atelier · Est. 2019</span>
          <span className="h-px w-10 bg-[#c9a961]/60" />
        </motion.div>

        {/* Logo — dynamic brand name */}
        <motion.div
          initial={{ opacity: 0, scale: 1.2, filter: "blur(16px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.6, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8 flex items-baseline gap-4 md:gap-6"
        >
          <div
            className="absolute inset-0 -z-10 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(201,169,97,0.3) 0%, transparent 70%)",
            }}
          />
          <span className="font-serif text-5xl text-[#f5f1e8] glow-gold-text md:text-7xl tracking-wide">
            {brandName}
          </span>
        </motion.div>

        {/* Letter-by-letter title */}
        <h1 className="relative mb-3 flex flex-wrap items-center justify-center font-serif text-3xl italic tracking-tight text-[#f5f1e8] md:text-5xl lg:text-6xl">
          {title.map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 3.2 + i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
              style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 4.6 }}
          className="max-w-md font-sans text-sm leading-relaxed text-[#8a8072] md:text-base"
        >
          An atelier of quiet luxury. Each piece conceived slowly, worn forever.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 5 }}
          className="mt-14"
        >
          <a
            href="#collection"
            data-cursor="hover"
            className="btn-luxury group relative inline-flex items-center gap-5 border border-[#c9a961]/40 bg-[#0a0a0a]/40 px-10 py-4 font-sans text-[11px] uppercase tracking-luxury text-[#e6c77a] backdrop-blur-sm transition-all hover:border-[#c9a961] hover:bg-[#0a0a0a]/70 hover:text-[#f5f1e8]"
          >
            <span>Enter the Collection</span>
            <span className="relative flex h-4 w-8 items-center">
              <span className="absolute right-0 h-px w-8 bg-[#c9a961] transition-all group-hover:w-10" />
              <span className="absolute right-0 h-2 w-2 -translate-y-[3px] rotate-45 border-r border-t border-[#c9a961]" />
            </span>
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 5.4 }}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="font-sans text-[9px] uppercase tracking-luxury text-[#8a8072]">
            Scroll
          </span>
          <motion.span
            className="relative h-12 w-px overflow-hidden bg-[#c9a961]/20"
            aria-hidden
          >
            <motion.span
              className="absolute left-0 top-0 h-6 w-full bg-[#c9a961]"
              animate={{ y: [-24, 48] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  )
}

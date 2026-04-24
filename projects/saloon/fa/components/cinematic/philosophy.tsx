"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useBrand } from "@/lib/brand-context"


export function Philosophy() {
  const brandName = useBrand()
  const words = `A silence between elements. A conversation between light and form. ${brandName} is born of restraint — each piece conceived as an heirloom, not an ornament.`.split(" ")
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const lineScale = useTransform(scrollYProgress, [0.1, 0.5], [0, 1])
  const labelY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"])

  return (
    <section ref={ref} className="relative py-40 md:py-56">
      <motion.div
        style={{ y: labelY }}
        className="absolute left-6 top-32 font-sans text-[10px] uppercase tracking-luxury text-[#c9a961]/60 md:left-12"
      >
        01 · Philosophy
      </motion.div>

      <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
        <motion.div
          style={{ scaleX: lineScale }}
          className="mx-auto mb-16 h-px w-40 origin-center bg-gradient-to-r from-transparent via-[#c9a961] to-transparent"
        />

        <p className="font-serif text-2xl leading-[1.4] text-[#f5f1e8] md:text-4xl lg:text-5xl">
          {words.map((w, i) => {
            const start = i / words.length
            const end = start + 1 / words.length
            return <Word key={i} word={w} start={start} end={end} progress={scrollYProgress} />
          })}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 font-sans text-[10px] uppercase tracking-luxury text-[#8a8072]"
        >
          — Founded in Mumbai · Crafted worldwide
        </motion.div>
      </div>
    </section>
  )
}

function Word({
  word,
  start,
  end,
  progress,
}: {
  word: string
  start: number
  end: number
  progress: any
}) {
  const opacity = useTransform(progress, [start, end], [0.15, 1])
  return (
    <motion.span
      style={{ opacity }}
      className="mr-2 inline-block italic"
    >
      {word}
    </motion.span>
  )
}

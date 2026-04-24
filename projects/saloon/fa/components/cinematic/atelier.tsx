"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
import { useBrand } from "@/lib/brand-context"

const stats = [
  { value: "2019", label: "Est." },
  { value: "84", label: "Hours per piece" },
  { value: "12", label: "Annual editions" },
  { value: "0", label: "Compromises" },
]

export function Atelier() {
  const brandName = useBrand()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1])

  return (
    <section id="atelier" ref={ref} className="relative overflow-hidden bg-[#0a0a0a]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-0 md:grid-cols-12">
        {/* Image column */}
        <div className="relative col-span-1 overflow-hidden md:col-span-7">
          <motion.div style={{ y: imgY, scale: imgScale }} className="relative aspect-[4/5] w-full md:aspect-auto md:h-full">
            <Image
              src="/craftsmanship.jpg"
              alt="The atelier at work"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/30 via-transparent to-[#0a0a0a]/30" />
          </motion.div>
          <div className="pointer-events-none absolute left-6 top-6 font-mono text-[10px] uppercase tracking-luxury text-[#c9a961]/60 md:left-10 md:top-10">
            05 · The Atelier
          </div>
        </div>

        {/* Copy */}
        <div className="col-span-1 flex flex-col justify-center gap-12 px-6 py-20 md:col-span-5 md:px-14 md:py-32">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="font-sans text-[10px] uppercase tracking-luxury text-[#c9a961]">
              On Making
            </p>
            <h2 className="font-serif text-4xl leading-[1.1] text-[#f5f1e8] md:text-6xl">
              A practice of <span className="italic text-gold-gradient">patience</span>
            </h2>
            <div className="gold-divider max-w-[120px]" />
            <p className="max-w-md font-sans text-sm leading-[1.8] text-[#8a8072] md:text-base">
             Every {brandName} piece is hand-finished by a single master artisan from start to signature —
              never passed down a line, never rushed, never duplicated. It is the slowest way we know
              to make jewellery. It is the only way we care to.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[#c9a961]/10 pt-10"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-4xl italic text-gold-gradient md:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 font-sans text-[10px] uppercase tracking-luxury text-[#8a8072]">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-4"
          >
            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hello ${brandName} — I would like to schedule a private viewing.`)}`}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="btn-luxury group inline-flex items-center gap-4 border border-[#c9a961]/40 px-8 py-4 font-sans text-[10px] uppercase tracking-luxury text-[#e6c77a] transition-all hover:border-[#c9a961] hover:text-[#f5f1e8]"
            >
              Visit the Atelier
              <span className="inline-block h-px w-6 bg-[#c9a961] transition-all group-hover:w-10" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { GoldParticles } from "./gold-particles"
import { useBrand } from "@/lib/brand-context"

export function Footer() {
  const brandName = useBrand()
  return (
    <footer className="relative overflow-hidden bg-[#060606] pt-32 pb-10">
      <div className="absolute inset-0 opacity-60">
        <GoldParticles density={40} />
      </div>

      <div className="light-leak left-1/2 top-[20%] -translate-x-1/2" />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-6 font-sans text-[10px] uppercase tracking-luxury text-[#c9a961]">
            Begin a conversation
          </p>
          <h2 className="font-serif text-5xl leading-[1.05] text-[#f5f1e8] md:text-7xl lg:text-8xl">
            For the <span className="italic text-gold-shimmer">few</span> who know
          </h2>
          <p className="mx-auto mt-8 max-w-lg font-sans text-sm leading-relaxed text-[#8a8072]">
            Every {brandName} piece begins with a private conversation. Write to us — we will respond with intent.
          </p>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-5">
            <a
              href="https://wa.me/919999999999?text=Hello%20F%7CA"
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="btn-luxury group inline-flex items-center gap-4 bg-[#c9a961] px-10 py-4 font-sans text-[10px] uppercase tracking-luxury text-[#0a0a0a] transition-all hover:bg-[#e6c77a]"
            >
              Begin on WhatsApp
              <span className="inline-block h-px w-5 bg-[#0a0a0a] transition-all group-hover:w-8" />
            </a>
            <a
              href="mailto:atelier@fa-jewellery.com"
              data-cursor="hover"
              className="btn-luxury inline-flex items-center gap-3 border border-[#c9a961]/40 px-10 py-4 font-sans text-[10px] uppercase tracking-luxury text-[#e6c77a] transition-all hover:border-[#c9a961] hover:text-[#f5f1e8]"
            >
              atelier@fa-jewellery.com
            </a>
          </div>
        </motion.div>

        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mt-32 flex items-baseline justify-center gap-5 font-serif text-[#f5f1e8]"
        >
          <span className="text-4xl md:text-6xl tracking-wider">{brandName}</span>
        </motion.div>

        {/* Bottom meta */}
        <div className="mt-20 grid grid-cols-1 gap-8 border-t border-[#c9a961]/10 pt-10 font-sans text-[10px] uppercase tracking-luxury text-[#8a8072] md:grid-cols-4">
          <div className="space-y-1">
            <div className="text-[#e6c77a]">Atelier</div>
            <div>Mumbai · Maharashtra</div>
            <div>By appointment only</div>
          </div>
          <div className="space-y-1">
            <div className="text-[#e6c77a]">Hours</div>
            <div>Tue — Sat</div>
            <div>11:00 — 19:00 IST</div>
          </div>
          <div className="space-y-1">
            <div className="text-[#e6c77a]">Follow</div>
            <div className="flex gap-4">
              <a href="#" data-cursor="hover" className="hover:text-[#f5f1e8]">Instagram</a>
              <a href="#" data-cursor="hover" className="hover:text-[#f5f1e8]">Pinterest</a>
            </div>
          </div>
          <div className="space-y-1 md:text-right">
            <div className="text-[#e6c77a]">Contact</div>
            <div>+91 99999 99999</div>
            <div>atelier@fa-jewellery.com</div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 font-sans text-[10px] uppercase tracking-luxury text-[#8a8072]/60 md:flex-row">
          <div>© MMXXVI {brandName} — All rights reserved</div>
          <div>Crafted to be timeless</div>
        </div>
      </div>
    </footer>
  )
}

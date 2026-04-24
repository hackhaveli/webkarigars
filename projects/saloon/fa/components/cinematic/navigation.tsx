"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useState } from "react"
import { useBrand } from "@/lib/brand-context"

const links = [
  { label: "Collection", href: "#collection" },
  { label: "Signature", href: "#signature" },
  { label: "Lookbook", href: "#lookbook" },
  { label: "Atelier", href: "#atelier" },
]

export function Navigation() {
  const brandName = useBrand()
  const { scrollY } = useScroll()
  const bgColor = useTransform(
    scrollY,
    [0, 300],
    ["rgba(10,10,10,0)", "rgba(10,10,10,0.75)"],
  )
  const borderColor = useTransform(
    scrollY,
    [0, 300],
    ["rgba(201,169,97,0)", "rgba(201,169,97,0.15)"],
  )
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="absolute inset-0 backdrop-blur-md"
          style={{
            backgroundColor: bgColor,
            borderBottom: "1px solid",
            borderBottomColor: borderColor,
          }}
        />
        <nav className="relative mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12 md:py-6">
          <a href="#top" className="flex items-baseline gap-2 font-serif text-[#f5f1e8]" data-cursor="hover">
            <span className="text-xl tracking-wider">{brandName}</span>
          </a>

          <ul className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  data-cursor="hover"
                  className="group relative font-sans text-[11px] uppercase tracking-luxury text-[#e8e2d0]/80 transition-colors hover:text-[#e6c77a]"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#c9a961] transition-all duration-500 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <a
              href="#atelier"
              data-cursor="hover"
              className="btn-luxury group relative inline-flex items-center gap-3 border border-[#c9a961]/40 px-5 py-2.5 font-sans text-[10px] uppercase tracking-luxury text-[#e6c77a] transition-all hover:border-[#c9a961] hover:text-[#f5f1e8]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a961] animate-pulse-gold" />
              Private Viewing
            </a>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-6 bg-[#f5f1e8] transition-transform ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-6 bg-[#f5f1e8] transition-transform ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={menuOpen ? { opacity: 1, pointerEvents: "auto" } : { opacity: 0, pointerEvents: "none" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#0a0a0a]/95 backdrop-blur-xl md:hidden"
      >
        <ul className="space-y-6 text-center">
          {links.map((l, i) => (
            <motion.li
              key={l.href}
              initial={{ opacity: 0, y: 10 }}
              animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: menuOpen ? 0.15 + i * 0.08 : 0, duration: 0.6 }}
            >
              <a
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-4xl italic text-[#f5f1e8]"
              >
                {l.label}
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </>
  )
}

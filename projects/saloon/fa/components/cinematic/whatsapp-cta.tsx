"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useBrand } from "@/lib/brand-context"

export function WhatsAppCta() {
  const brandName = useBrand()
  const [expanded, setExpanded] = useState(false)

  const waLink = `https://wa.me/919999999999?text=${encodeURIComponent(
    `Hello ${brandName} — I would like to discuss a private piece.`,
  )}`

  return (
    <>
      {/* Desktop floating */}
      <div className="pointer-events-none fixed inset-0 z-40">
        <AnimatePresence>
          {expanded && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
              className="pointer-events-auto absolute inset-0 bg-[#060606]/40 backdrop-blur-sm"
              aria-label="Close"
            />
          )}
        </AnimatePresence>

        <div className="pointer-events-auto absolute bottom-6 right-6 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="glass w-[320px] overflow-hidden"
              >
                <div className="border-b border-[#c9a961]/15 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c9a961]/10">
                      <WaIcon className="h-4 w-4 text-[#e6c77a]" />
                    </div>
                    <div>
                      <div className="font-serif italic text-[#f5f1e8]">{brandName} Concierge</div>
                      <div className="flex items-center gap-1.5 font-sans text-[9px] uppercase tracking-luxury text-[#c9a961]">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c9a961]" />
                        Online
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 px-5 py-5 font-sans text-sm text-[#e8e2d0]">
                  <div className="rounded-sm border border-[#c9a961]/10 bg-[#0a0a0a]/60 px-4 py-3 leading-relaxed text-[13px] text-[#e8e2d0]/80">
                    Bonjour — thank you for considering {brandName}. Our concierge will respond within the hour, quietly and in private.
                  </div>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="btn-luxury group flex items-center justify-center gap-3 bg-[#c9a961] py-3 font-sans text-[10px] uppercase tracking-luxury text-[#0a0a0a] transition-all hover:bg-[#e6c77a]"
                  >
                    Open WhatsApp
                    <span className="inline-block h-px w-5 bg-[#0a0a0a] transition-all group-hover:w-8" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setExpanded((v) => !v)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            data-cursor="hover"
            aria-label={`Chat with ${brandName} concierge`}
            className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#0a0a0a] text-[#e6c77a] shadow-[0_10px_40px_rgba(201,169,97,0.25)] md:h-16 md:w-16"
          >
            <span className="absolute inset-0 animate-pulse-gold rounded-full border border-[#c9a961]" />
            <span
              className="absolute inset-[2px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(201,169,97,0.25) 0%, rgba(10,10,10,1) 70%)",
              }}
            />
            <motion.span
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {expanded ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <WaIcon className="h-6 w-6" />
              )}
            </motion.span>
          </motion.button>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-30 border-t border-[#c9a961]/15 bg-[#0a0a0a]/90 px-4 py-3 backdrop-blur-xl md:hidden">
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="btn-luxury flex items-center justify-center gap-3 bg-[#c9a961] px-5 py-3 font-sans text-[10px] uppercase tracking-luxury text-[#0a0a0a]"
        >
          <WaIcon className="h-4 w-4" />
          Chat to Order
        </a>
      </div>
    </>
  )
}

function WaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.6 14.2c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.4-.3-.7-.5-.6-.7-.6h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.4.8 3.1 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
import { useBrand } from "@/lib/brand-context"

const frames = [
  {
    src: "/lookbook-1.jpg",
    title: "Chapter I",
    subtitle: "The Veil",
    quote: "She wore only light.",
    align: "left" as const,
  },
  {
    src: "/lookbook-2.jpg",
    title: "Chapter II",
    subtitle: "The Hand",
    quote: "Not to be noticed — to be remembered.",
    align: "right" as const,
  },
  {
    src: "/lookbook-3.jpg",
    title: "Chapter III",
    subtitle: "The Silhouette",
    quote: "Gold, at the edge of a breath.",
    align: "center" as const,
  },
]

export function Lookbook() {
  const brandName = useBrand()
  return (
    <section id="lookbook" className="relative bg-[#060606]">
      {/* Intro */}
      <div className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-6 font-sans text-[10px] uppercase tracking-luxury text-[#c9a961]"
        >
          04 · Lookbook · Vol. I
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-4xl font-serif text-4xl leading-[1.05] text-[#f5f1e8] md:text-6xl lg:text-7xl"
        >
          A film in <span className="italic text-gold-gradient">three frames</span>
        </motion.h2>
      </div>

      {frames.map((f, i) => (
        <LookbookFrame key={i} frame={f} index={i} brandName={brandName} />
      ))}
    </section>
  )
}

function LookbookFrame({
  frame,
  index,
  brandName,
}: {
  frame: (typeof frames)[number]
  index: number
  brandName: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.2, 1])
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["80%", "-80%"])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.4, 0.8])

  return (
    <div
      ref={ref}
      className="relative h-[110vh] w-full overflow-hidden"
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      <motion.div style={{ scale: imgScale, y: imgY }} className="absolute inset-0">
        <Image
          src={frame.src}
          alt={frame.subtitle}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <motion.div
          className="absolute inset-0 bg-[#060606]"
          style={{ opacity: overlayOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/40 via-transparent to-[#060606]/70" />
      </motion.div>

      {/* Film grain strips */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#060606] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#060606] to-transparent" />

      {/* Chapter number */}
      <motion.div
        style={{ y: textY }}
        className={`absolute inset-0 flex flex-col justify-center px-6 md:px-16 ${
          frame.align === "left"
            ? "items-start text-left"
            : frame.align === "right"
              ? "items-end text-right"
              : "items-center text-center"
        }`}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="mb-6 font-sans text-[10px] uppercase tracking-luxury text-[#c9a961]"
        >
          {frame.title}
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl font-serif text-6xl italic leading-[0.95] text-[#f5f1e8] md:text-8xl lg:text-9xl"
        >
          {frame.subtitle}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 max-w-md font-serif text-xl italic text-[#e8e2d0]/80 md:text-2xl"
        >
          &ldquo;{frame.quote}&rdquo;
        </motion.p>
      </motion.div>

      {/* Film frame counter */}
      <div className="absolute left-6 top-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-luxury text-[#c9a961]/70 md:left-12 md:top-12">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c9a961]" />
        Frame {String(index + 1).padStart(2, "0")} / 03
      </div>
      <div className="absolute right-6 bottom-6 font-mono text-[10px] uppercase tracking-luxury text-[#c9a961]/70 md:right-12 md:bottom-12">
        {brandName} · MMXXVI
      </div>
    </div>
  )
}

"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef, useState } from "react"
import { ProductModal } from "./product-modal"

export interface Product {
  id: string
  name: string
  kind: string
  image: string
  price: string
  description: string
}

const products: Product[] = [
  {
    id: "aurelia",
    name: "Aurelia",
    kind: "Necklace · 18kt",
    image: "/product-3.jpg",
    price: "On Request",
    description:
      "A solitaire pendant suspended on a whisper-thin chain. Aurelia captures a single pear-cut diamond set in hand-finished 18kt champagne gold — conceived to fall exactly at the collarbone.",
  },
  {
    id: "solene",
    name: "Soléne",
    kind: "Earrings · 18kt",
    image: "/product-1.jpg",
    price: "On Request",
    description:
      "Tear-drop earrings paved with micro-set brilliants. Each facet is hand-selected to catch candlelight the way morning does water — still, then suddenly alive.",
  },
  {
    id: "isadore",
    name: "Isadore",
    kind: "Bracelet · 18kt",
    image: "/product-2.jpg",
    price: "On Request",
    description:
      "A fluid bracelet of interlocking gold links, dusted with brilliants. Named for a stage dancer who refused corsets — Isadore moves.",
  },
  {
    id: "vesper",
    name: "Vesper",
    kind: "Tennis Bracelet · 18kt",
    image: "/product-4.jpg",
    price: "On Request",
    description:
      "An uninterrupted river of round-brilliant diamonds, cast in a signature warm-champagne gold. A quiet devotion, worn close.",
  },
]

export function Collection() {
  const [selected, setSelected] = useState<Product | null>(null)
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1])
  const headerY = useTransform(scrollYProgress, [0, 0.2], [60, 0])

  return (
    <section id="collection" ref={ref} className="relative py-24 md:py-40">
      {/* Header */}
      <motion.div
        style={{ opacity: headerOpacity, y: headerY }}
        className="mx-auto mb-20 max-w-[1600px] px-6 md:mb-32 md:px-12"
      >
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="mb-4 font-sans text-[10px] uppercase tracking-luxury text-[#c9a961]">
              02 · The Collection
            </p>
            <h2 className="max-w-2xl font-serif text-4xl leading-[1.05] text-[#f5f1e8] md:text-6xl lg:text-7xl">
              Pieces that <span className="italic text-gold-gradient">remember</span> you
            </h2>
          </div>
          <p className="hidden max-w-xs font-sans text-sm leading-relaxed text-[#8a8072] md:block">
            Four archetypes. One vocabulary. Each released in the smallest possible edition — because attention cannot be mass-produced.
          </p>
        </div>
        <div className="gold-divider mt-12" />
      </motion.div>

      {/* Products */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        {products.map((p, i) => (
          <ProductRow
            key={p.id}
            product={p}
            index={i}
            onSelect={() => setSelected(p)}
          />
        ))}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  )
}

function ProductRow({
  product,
  index,
  onSelect,
}: {
  product: Product
  index: number
  onSelect: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 1.02])
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0.3])
  const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -2 : 2, index % 2 === 0 ? 1 : -1])

  const textX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [index % 2 === 0 ? -40 : 40, 0, index % 2 === 0 ? 40 : -40],
  )

  const reversed = index % 2 !== 0

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className={`relative grid min-h-[70vh] grid-cols-1 items-center gap-8 py-20 md:grid-cols-12 md:gap-12 md:py-32 ${
        reversed ? "md:[direction:rtl]" : ""
      }`}
    >
      {/* Image */}
      <motion.button
        onClick={onSelect}
        data-cursor="hover"
        style={{ y, scale, rotate }}
        className={`group relative col-span-1 overflow-hidden md:col-span-7 ${
          reversed ? "md:[direction:ltr]" : ""
        }`}
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {/* Image */}
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </motion.div>

          {/* Glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#c9a961]/0 via-[#c9a961]/10 to-[#e6c77a]/20" />
          </div>

          {/* Light sweep */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
            <div className="light-sweep absolute inset-0" />
          </div>

          {/* Corners */}
          <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-[#c9a961]/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-[#c9a961]/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="pointer-events-none absolute left-4 bottom-4 h-4 w-4 border-b border-l border-[#c9a961]/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="pointer-events-none absolute right-4 bottom-4 h-4 w-4 border-b border-r border-[#c9a961]/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Index number */}
          <div className="absolute left-6 top-6 font-mono text-[10px] tracking-luxury text-[#c9a961]/70">
            {String(index + 1).padStart(2, "0")} / {String(4).padStart(2, "0")}
          </div>
        </div>
      </motion.button>

      {/* Copy */}
      <motion.div
        style={{ x: textX }}
        className={`col-span-1 md:col-span-5 ${reversed ? "md:[direction:ltr]" : ""}`}
      >
        <div className="space-y-6 md:space-y-8">
          <p className="font-sans text-[10px] uppercase tracking-luxury text-[#c9a961]">
            {product.kind}
          </p>
          <h3 className="font-serif text-5xl italic text-[#f5f1e8] md:text-7xl lg:text-8xl">
            {product.name}
          </h3>
          <div className="gold-divider max-w-[200px]" />
          <p className="max-w-md font-sans text-sm leading-relaxed text-[#8a8072] md:text-base md:leading-[1.7]">
            {product.description}
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <button
              onClick={onSelect}
              data-cursor="hover"
              className="btn-luxury group inline-flex items-center gap-4 border border-[#c9a961]/40 bg-transparent px-7 py-3.5 font-sans text-[10px] uppercase tracking-luxury text-[#e6c77a] transition-all hover:border-[#c9a961] hover:text-[#f5f1e8]"
            >
              Discover
              <span className="inline-block h-px w-6 bg-[#c9a961] transition-all group-hover:w-8" />
            </button>
            <span className="font-sans text-[10px] uppercase tracking-luxury text-[#8a8072]">
              {product.price}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

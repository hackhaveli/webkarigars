"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

function formatName(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function getBrandName(): string {
  if (typeof window === "undefined") return "F|A"

  // 1. Query param takes priority: ?name=Glow Salon
  const params = new URLSearchParams(window.location.search)
  const qName = params.get("name")
  if (qName && qName.trim()) return qName.trim()

  // 2. URL path slug: /glow-beauty-studio → "Glow Beauty Studio"
  const path = window.location.pathname.replace(/^\//, "")
  const slug = path.split("/")[0] // first segment only
  if (slug && slug !== "") return formatName(slug)

  // 3. Default
  return "F|A"
}

const BrandContext = createContext<string>("F|A")

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brandName, setBrandName] = useState<string>("F|A")

  useEffect(() => {
    setBrandName(getBrandName())
  }, [])

  return (
    <BrandContext.Provider value={brandName}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand(): string {
  return useContext(BrandContext)
}

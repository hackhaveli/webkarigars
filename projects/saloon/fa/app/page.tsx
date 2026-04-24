import { Atelier } from "@/components/cinematic/atelier"
import { Collection } from "@/components/cinematic/collection"
import { Cursor } from "@/components/cinematic/cursor"
import { FilmGrain } from "@/components/cinematic/film-grain"
import { Footer } from "@/components/cinematic/footer"
import { Hero } from "@/components/cinematic/hero"
import { LoadingScreen } from "@/components/cinematic/loading-screen"
import { Lookbook } from "@/components/cinematic/lookbook"
import { Navigation } from "@/components/cinematic/navigation"
import { Philosophy } from "@/components/cinematic/philosophy"
import { ScrollProgress } from "@/components/cinematic/scroll-progress"
import { SignaturePiece } from "@/components/cinematic/signature-piece"
import { WhatsAppCta } from "@/components/cinematic/whatsapp-cta"

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0a0a] text-[#f5f1e8]">
      <LoadingScreen />
      <Cursor />
      <FilmGrain />
      <Navigation />
      <ScrollProgress />

      <Hero />
      <Philosophy />
      <Collection />
      <SignaturePiece />
      <Lookbook />
      <Atelier />
      <Footer />

      <WhatsAppCta />
    </main>
  )
}

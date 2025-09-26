// import { Header } from "@/src/components/header"
import { Header } from "@/src/features/public/header"
import { HeroCarousel } from "@/src/features/public/hero-carousel"
import { ServicesSection } from "@/src/features/public/services-section"
import { AboutSection } from "@/src/features/public/about-section"
import { MissionVisionSection } from "@/src/features/public/mission-vision-section"
import { QuoteSection } from "@/src/features/public/quote-section"
import { Footer } from "@/src/features/public/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <ServicesSection />
        <AboutSection />
        <MissionVisionSection />
        <QuoteSection />
      </main>
      <Footer />
    </div>
  )
}

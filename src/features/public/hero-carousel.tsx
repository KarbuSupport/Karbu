"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/shared/components/ui/button"
import { ChevronLeft, ChevronRight, Shield, Wrench, Clock, Car } from "lucide-react"

const slides = [
  {
    title: "Chequeo Preventivo Bimestral",
    subtitle: "Mantén tu vehículo en óptimas condiciones",
    description:
      "Realizamos inspecciones bimestrales para detectar a tiempo posibles fallas y garantizar el máximo rendimiento de tu vehículo, evitando gastos innecesarios a futuro.",
    icon: Shield,
    cta: "Solicitar Evaluación",
  },
  {
    title: "Servicio Técnico Especializado",
    subtitle: "Más de 20 años de experiencia en el sector automotriz",
    description:
      "Contamos con técnicos certificados y equipamiento de última generación para ofrecer diagnósticos precisos y reparaciones con garantía extendida.",
    icon: Wrench,
    cta: "Explorar Servicios",
  },
  {
    title: "Atención Personalizada con Cita",
    subtitle: "Comodidad y atención prioritaria",
    description:
      "Agenda tu cita y recibe atención inmediata de nuestros especialistas sin esperas. Servicio eficiente, puntual y enfocado en tus necesidades.",
    icon: Clock,
    cta: "Agendar Cita",
  },
  {
    title: "Seguro de Reparación Automotriz",
    subtitle: "Protege tu inversión con total tranquilidad",
    description:
      "Contrata nuestro seguro de reparación y recibe cobertura ante imprevistos mecánicos o eléctricos. Garantía, asistencia y respaldo profesional en todo momento.",
    icon: Car,
    cta: "Cotizar Seguro",
  },
]


export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 10000) // 10 Segundos
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section id="inicio" className="relative min-h-[600px] bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground">
      <div className="container mx-auto px-4 py-20">
        <div className="relative">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"
              }`}
            >
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start mb-6">
                    <slide.icon className="h-16 w-16 text-primary" />
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-bold mb-4 text-balance">{slide.title}</h2>
                  <p className="text-xl lg:text-2xl mb-6 text-secondary-foreground/80">{slide.subtitle}</p>
                  <p className="text-lg mb-8 text-secondary-foreground/70 max-w-2xl">{slide.description}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    {/* <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      {slide.cta}
                    </Button> */}
                  </div>
                </div>
                <div className="flex-1">
                  <img
                    src={`/automotive-workshop-.jpg?height=400&width=600&query=automotive workshop ${slide.title.toLowerCase()}`}
                    alt={slide.title}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-secondary-foreground p-2 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-secondary-foreground p-2 rounded-full transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slide indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-primary" : "bg-secondary-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

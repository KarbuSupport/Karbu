import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Button } from "@/src/shared/components/ui/button"
import { Shield, Wrench, Car, Zap, Paintbrush, Settings } from "lucide-react"

const services = [
  {
    icon: Shield,
    title: "Seguros de Reparación",
    description: "Cobertura completa para reparaciones mecánicas y eléctricas con planes flexibles.",
    features: ["Cobertura hasta $500,000 MXN", "Sin deducible", "Vigencia de 1-3 años"],
  },
  {
    icon: Wrench,
    title: "Mecánica General",
    description: "Diagnóstico y reparación de sistemas mecánicos con tecnología de punta.",
    features: ["Diagnóstico computarizado", "Garantía de 6 meses", "Refacciones originales"],
  },
  // {
  //   icon: Zap,
  //   title: "Sistema Eléctrico",
  //   description: "Reparación especializada en sistemas eléctricos y electrónicos automotrices.",
  //   features: ["Escáner automotriz", "Reparación de ECU", "Instalación de accesorios"],
  // },
  // {
  //   icon: Paintbrush,
  //   title: "Hojalatería y Pintura",
  //   description: "Restauración completa de carrocería con acabados de calidad premium.",
  //   features: ["Cabina de pintura", "Igualación de color", "Enderezado y soldadura"],
  // },
  {
    icon: Car,
    title: "Mantenimiento Preventivo",
    description: "Servicios programados para mantener tu vehículo en óptimas condiciones.",
    features: ["Cambio de aceite", "Afinación mayor", "Revisión de 50 puntos"],
  },
  {
    icon: Settings,
    title: "Servicios Especializados",
    description: "Reparaciones especializadas para vehículos de alta gama y clásicos.",
    features: ["Vehículos europeos", "Autos clásicos", "Modificaciones legales"],
  },
]

export function ServicesSection() {
  return (
    <section id="servicios" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Nuestros <span className="text-primary">Servicios</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Ofrecemos una gama completa de servicios automotrices respaldados por seguros especializados para garantizar
            la tranquilidad de nuestros clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-card border-2 border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <service.icon className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Más Información
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

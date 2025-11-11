import { Card, CardContent } from "@/src/shared/components/ui/card"
import { Users, Award, Clock, MapPin } from "lucide-react"

const stats = [
  { icon: Users, number: "5,000+", label: "Clientes Satisfechos" },
  { icon: Award, number: "20+", label: "Años de Experiencia" },
  { icon: Clock, number: "Servicio", label: "Lun - Vie: 10:00 AM - 3:00 PM y 3:30 PM - 7:00 PM \n Sáb: 9:30 AM - 3:00 PM \n Dom: Cerrado" },
  { icon: MapPin, number: "1", label: "Sucursal en C. Rita Pérez de Moreno 815, Santa María, 44719 Guadalajara, Jal." },
]

export function AboutSection() {
  return (
    <section id="quienes-somos" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-balance">
              ¿Quiénes <span className="text-primary">Somos?</span>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p className="text-pretty">
                <strong className="text-foreground">Karbu.com.mx</strong> es una empresa familiar con más de 20 años de
                experiencia en el sector automotriz. Nos especializamos en brindar servicios de reparación de alta
                calidad respaldados por seguros especializados que protegen la inversión de nuestros clientes.
              </p>
              <p className="text-pretty">
                Nuestro equipo de técnicos certificados utiliza tecnología de punta y refacciones originales para
                garantizar reparaciones duraderas. Hemos construido nuestra reputación basada en la confianza,
                transparencia y excelencia en el servicio.
              </p>
              <p className="text-pretty">
                Contamos con instalaciones modernas equipadas con la última tecnología en diagnóstico automotriz,
                cabinas de pintura especializadas y herramientas de precisión para atender desde vehículos económicos
                hasta automóviles de lujo.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <img
              src="/modern-automotive-workshop-interior-with-professio.jpg"
              alt="Karbu.com.mx - Instalaciones"
              className="w-full rounded-lg shadow-lg"
            />

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-background border-2 border-border">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{stat.number}</div>
                    <div className="text-sm text-muted-foreground whitespace-pre-line">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

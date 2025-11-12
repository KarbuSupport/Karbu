import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Target, Eye, Heart } from "lucide-react"

export function MissionVisionSection() {
  return (
    <section id="mision-vision" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Nuestra <span className="text-primary">Filosofía</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Los valores y principios que guían nuestro trabajo diario y definen nuestro compromiso con la excelencia en
            el servicio automotriz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-card border-2 border-border text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Target className="h-16 w-16 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-pretty">
                Karbu es una empresa dedicada a dar soluciones de servicios automotrices de calidad
                de manera eficaz y eficiente en cualquier punto donde se encuentren propietarios
                de vehículos automotores por medio de plataformas digitales, tenemos el propósito
                de desarrollar tecnologías necesarias para su buen manejo siempre dirigido a la mejora continua.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-border text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Eye className="h-16 w-16 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Visión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-pretty">
                Ser una empresa consolidada y ampliamente reconocida en la rama automotriz
                para que todos los propietarios de vehículos automotores cuenten con un servicio
                de mantenimiento preventivo, correctivo y asistencia vial de calidad de forma inteligente
                certera y autentica en cualquier parte de México.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-border text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Heart className="h-16 w-16 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Honestidad y transparencia</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Certeza</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Puntualidad</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Calidad</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Responsabilidad</span>
                </li>
                 <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Pasión</span>
                </li>
                 <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Respeto</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

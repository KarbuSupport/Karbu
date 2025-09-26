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
                Brindar servicios automotrices de excelencia con seguros especializados que protejan la inversión de
                nuestros clientes, utilizando tecnología de punta y un equipo humano altamente capacitado para superar
                las expectativas en cada servicio.
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
                Ser reconocidos como el taller automotriz líder en México, expandiendo nuestros servicios a nivel
                nacional y estableciendo el estándar de calidad en reparaciones automotrices respaldadas por seguros
                especializados.
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
                  <span>Excelencia en el servicio</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Compromiso con la calidad</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Innovación tecnológica</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Responsabilidad social</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

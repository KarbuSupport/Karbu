import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Karbu<span className="text-primary">.com.mx</span>
            </h3>
            <p className="text-secondary-foreground/80 mb-4 text-pretty">
              Más de 20 años brindando servicios automotrices de calidad con seguros especializados que protegen tu
              inversión.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-secondary-foreground/60 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-secondary-foreground/60 hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-secondary-foreground/60 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Seguros de Reparación
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Mecánica General
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Sistema Eléctrico
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Hojalatería y Pintura
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Mantenimiento
                </a>
              </li>
            </ul>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li>
                <a href="#inicio" className="hover:text-primary transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#quienes-somos" className="hover:text-primary transition-colors">
                  Quiénes Somos
                </a>
              </li>
              <li>
                <a href="#mision-vision" className="hover:text-primary transition-colors">
                  Misión y Visión
                </a>
              </li>
              <li>
                <a href="#cotizacion" className="hover:text-primary transition-colors">
                  Cotización
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Términos y Condiciones
                </a>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-3 text-secondary-foreground/80">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  Av. Insurgentes Sur 1234,
                  <br />
                  Col. Del Valle, CDMX 03100
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">+52 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">info@tallermendez.com</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  Lun - Vie: 8:00 AM - 6:00 PM
                  <br />
                  Sáb: 9:00 AM - 2:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-secondary-foreground/60 text-sm">
            © 2024 Karbu.com.mx. Todos los derechos reservados. | Diseñado con ❤️ para brindar el mejor servicio
            automotriz.
          </p>
        </div>
      </div>
    </footer>
  )
}

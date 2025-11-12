"use client"

import { useState } from "react"
import { Button } from "@/src/shared/components/ui/button"
import { Menu, X, Phone, MapPin } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Inicio", href: "#inicio" },
    { name: "Servicios", href: "#servicios" },
    { name: "Quiénes Somos", href: "#quienes-somos" },
    { name: "Misión y Visión", href: "#mision-vision" },
    { name: "Cotización", href: "#cotizacion" },
  ]

  return (
    <header className="bg-background border-b-2 border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar with contact info */}
        <div className="flex justify-between items-center py-2 text-sm border-b border-muted">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4 text-primary" />
              <span>+52 33-36-51-35-04</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary" />
              <span>C. Rita Pérez de Moreno 815, Santa María, 44719 Guadalajara, Jal.</span>

            </div>
          </div>
          <div className="hidden md:block text-muted-foreground">Lun - Vie: 10:00 AM - 3:00 PM y 3:30 PM - 7:00 PM <br /> Sáb: 9:30 AM - 3:00 PM  Dom: Cerrado</div>
        </div>

        {/* Main navigation */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-foreground">
              Karbu<span className="text-primary">.com.mx</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            {/* <a
              href="mailto:ventas@karbu.com.mx?subject=Solicitud%20de%20información&body=Hola%2C%20quiero%20recibir%20más%20información%20sobre%20sus%20servicios."
              className="inline-block"
            >
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Contactar Ahora
              </Button>
            </a> */}
                          <a
                href="https://wa.me/523318106833?text=Hola%2C%20quisiera%20más%20información%20sobre%20sus%20servicios."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full mt-4">
                  Contactar por WhatsApp
                </Button>
              </a>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-muted">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="https://wa.me/523318106833?text=Hola%2C%20quisiera%20más%20información%20sobre%20sus%20servicios."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full mt-4">
                  Contactar por WhatsApp
                </Button>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

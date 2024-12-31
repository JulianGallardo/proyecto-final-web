"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Truck, Map, Package, ChartGraph, Home, Logout, Menu, X } from "@mynaui/icons-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import BtnLogout from "@/components/auth/btn-logout"

const navItems = [
  { href: "/areas", label: "Áreas", icon: Map },
  { href: "/repartidores", label: "Repartidores", icon: Truck },
  { href: "/packages", label: "Paquetes", icon: Package },
  { href: "/reports", label: "Reportes", icon: ChartGraph },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  return (
    <nav className="flex items-center p-4 bg-gray-900 w-full shadow-lg z-50">
      <div className="flex-grow flex items-center justify-between">
        <Link href="/inicio" className="">
          <Button variant="ghost" className="text-gray-200 hover:text-blue-400 ">
            <Home className="w-6 h-6 " />
            <span className="text-sm hidden md:flex">Inicio</span>
          </Button>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 items-center justify-center w-full">
          {navItems.map((item) => (
            pathname !== item.href && (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="flex items-center text-gray-200 hover:text-blue-400"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            )
          ))}
        </div>

        {/* Mobile Navigation */}
        <Sheet >
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden text-gray-200">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="w-full p-0 bg-gray-800 text-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <span className="text-lg font-semibold text-gray-200">Menú</span>

            </div>
            <nav className="flex-grow">
              {navItems.map((item) => (
                <SheetTrigger asChild>
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center p-4 text-gray-200 hover:bg-gray-700"
                  >
                    <item.icon className="w-6 h-6 mr-4" />
                    <span className="text-lg">{item.label}</span>
                  </Link>
                </SheetTrigger>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
              <BtnLogout
                className="w-full flex items-center justify-center bg-transparent p-2 gap-2 text-gray-200 hover:text-red-400 hover:bg-gray-700 transition-all duration-300"
              >
                <Logout className="w-6 h-6" />
                <span className="text-lg">Cerrar sesión</span>
              </BtnLogout>
            </div>
          </SheetContent>
        </Sheet>

        <BtnLogout
          className=" hidden md:flex items-center justify-center bg-transparent p-2 gap-2 text-gray-200 hover:text-red-400 hover:bg-transparent transition-all duration-300"
        >
          <Logout className="w-6 h-6" />
          <span className="text-sm">Cerrar sesión</span>
        </BtnLogout>
      </div>
    </nav>
  )
}


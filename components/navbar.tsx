

import { headers } from "next/headers";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Truck, Map, Package, ChartGraph, Home, Logout, Menu } from "@mynaui/icons-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import BtnLogout from "@/components/auth/btn-logout"
import { auth } from "@/auth"

const navItems = [
  { href: "/zonas", label: "Zonas", icon: Map },
  { href: "/agentes", label: "Agente", icon: Truck },
  { href: "/instrumentos", label: "Instrumentos", icon: Package },
  { href: "/control", label: "Control", icon: ChartGraph },
]

export default async function Navbar() {
  const session = await auth()

 const heads = headers()

 const pathname = heads.get('next-url')

  if (!session) {
    return null
  }

  return (
    <nav className="flex items-center p-4  bg-gray-900 w-full shadow-lg z-50 overflow-hidden">

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
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="hidden">
            Menu de navegación
          </SheetDescription>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden text-gray-200">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="top" className="w-full p-0 bg-gray-800 text-white">
            <div className="flex items-center justify-between p-4 ">
              <span className="text-lg font-semibold text-gray-200">Menú</span>

            </div>
            <nav className="flex-grow">
              {navItems.map((item) => (
                <SheetTrigger asChild key={item.label}>
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center p-4 text-gray-200 hover:bg-gray-700"
                  >
                    <item.icon className="w-6 h-6 mr-4" />
                    <span className="text-lg">{item.label}</span>
                  </Link>
                </SheetTrigger>
              ))}
            </nav>
            <div className="p-4 ">
              <BtnLogout
                className=" flex w-full items-center justify-center bg-red-500 p-4 gap-2 text-gray-200 hover:text-red-400 hover:bg-gray-700 transition-all duration-300"
              >
                <Logout className="w-6 h-6" />
                <span className="text-lg">Cerrar sesión</span>
              </BtnLogout>
            </div>
          </SheetContent>
        </Sheet>

        <BtnLogout
          className=" hidden md:flex items-center justify-center bg-transparent gap-2 text-gray-200 hover:text-red-400 hover:bg-transparent transition-all duration-300"
        >
          <Logout className="w-6 h-6" />
          <span className="text-sm">Cerrar sesión</span>
        </BtnLogout>
      </div>
    </nav>
  )
}



import { headers } from "next/headers";
import Link from "next/link";
import {
  Truck,
  Map,
  Package,
  ChartGraph,
  Home,
  Logout,
  Menu,
  Config,
  LetterJSquare,
  LetterISquare,
  Location,
  User,
  Table, // Added User icon for Personal
} from "@mynaui/icons-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BtnLogout from "@/components/auth/btn-logout";
import { auth } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { canView } from "@/permissions/hasPermissions";
import { Resource } from "@/permissions/typePermissions";

const navItems = [
  { href: "/zonas", label: "Zonas", icon: Map, resource: Resource.ZONAS },
  { href: "/instrumentos", label: "Instrumentos", icon: Package, resource: Resource.INSTRUMENTOS },
  { href: "/control", label: "Control", icon: ChartGraph, resource: Resource.CONTROL },
  { href: "/planificador-de-ruta", label: "Planificador", icon: Location, resource: Resource.PLANIFICADOR },
  { href: "/entregas", label: "Entregas", icon: Package, resource: Resource.ENTREGAS },
  { href: "/control-agente", label: "Estadísticas", icon: ChartGraph, resource: Resource.CONTROL_AGENTE },
  { href: "/instrumentos-agente", label: "Mi Carpeta", icon: Package, resource: Resource.INSTRUMENTOS_AGENTE },
];

const personalItems = [
  { href: "/agentes", label: "Agentes", icon: Truck, resource: Resource.AGENTE },
  { href: "/mesa-de-entrada", label: "Mesa de Entrada", icon: Table, resource: Resource.AGENTE }, // Assuming Mesa de Entrada uses the same resource; adjust as needed
];

const optionItems = [
  { href: "/juzgados", label: "Juzgados", icon: LetterJSquare, resource: Resource.JUZGADOS },
  { href: "/instrumentos-tipo", label: "Tipo de instrumentos", icon: LetterISquare, resource: Resource.TIPOS_INSTRUMENTOS },
  { href: "/cambiar-contrasena", label: "Cambiar contraseña", icon: Config },
];

export default async function Navbar() {
  const session = await auth();

  const heads = headers();
  const pathname = heads.get("next-url");

  if (!session) {
    return null;
  }

  return (
    <nav className="flex items-center p-4 px-6 bg-gray-900 w-full shadow-lg z-50">
      <div className="flex-grow flex items-center justify-between">
        <Link href="/inicio" className="">
          <Button variant="ghost" className="text-gray-200 hover:text-blue-400">
            <Home className="w-6 h-6" />
            <span className="text-sm hidden md:flex">Inicio</span>
          </Button>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 items-center justify-center w-full">
          {navItems.map((item) => (
            pathname !== item.href && canView(session.user.role, item.resource) && (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="flex items-center text-gray-200 hover:text-blue-400">
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            )
          ))}

          {/* Personal Dropdown (replacing Agentes button) */}
          {canView(session.user.role, Resource.AGENTE) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center text-gray-200 hover:text-blue-400 outline-none"
                >
                  <User className="w-5 h-5 mr-2" /> {/* Using User icon for Personal */}
                  <span className="">Personal</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {personalItems.map((item) => (
                  canView(session.user.role, item.resource) && (
                    <DropdownMenuItem key={item.href}>
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          className="flex flex-row items-center text-black hover:text-blue-400 w-full"
                        >
                          <item.icon className="w-5 h-5 mr-2" />
                          <span className="text-sm">{item.label}</span>
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                  )
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTitle className="hidden">Menú</SheetTitle>
          <SheetDescription className="hidden">Menú de navegación</SheetDescription>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden text-gray-200">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="top" className="w-full p-0 bg-gray-800 text-white">
            <div className="flex items-center justify-between p-4">
              <span className="text-lg font-semibold text-gray-200">Menú</span>
            </div>
            <nav className="flex-grow">
              {navItems.map((item) => (
                canView(session.user.role, item.resource) && (
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
                )
              ))}

              {
                personalItems.map((item) => (
                  canView(session.user.role, item.resource) && (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center p-4 text-gray-200 hover:bg-gray-700"
                    >
                      <item.icon className="w-6 h-6 mr-4" />
                      <span className="text-lg">{item.label}</span>
                    </Link>
                  )
                ))
              }

              {optionItems.map((item) => (
                item.resource
                  ? pathname !== item.href && canView(session.user.role, item.resource) && (
                    <SheetTrigger asChild key={item.label}>
                      <Link
                        key={item.label}
                        href={item.resource ? item.href : ""}
                        className="flex items-center p-4 text-gray-200 hover:bg-gray-700"
                      >
                        <item.icon className="w-6 h-6 mr-4" />
                        <span className="text-lg">{item.label}</span>
                      </Link>
                    </SheetTrigger>
                  )
                  : (
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
                  )
              ))}
            </nav>
            <div className="p-4">
              <BtnLogout
                className="flex w-full items-center justify-center bg-red-500 p-4 gap-2 text-white hover:text-red-400 hover:bg-gray-700 transition-all duration-300"
              >
                <Logout className="w-6 h-6" />
                <span className="text-lg">Cerrar sesión</span>
              </BtnLogout>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center text-gray-200 hover:text-blue-400 outline-none"
              >
                <span className="">Opciones</span>
                <Config className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              {optionItems.map((item) => (
                item.resource
                  ? pathname !== item.href && canView(session.user.role, item.resource) && (
                    <DropdownMenuItem key={item.href}>
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          className="flex flex-row items-center text-black hover:text-blue-400 w-full"
                        >
                          <item.icon className="w-5 h-5 mr-2" />
                          <span className="text-sm">{item.label}</span>
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                  )
                  : (
                    <DropdownMenuItem key={item.href}>
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          className="flex flex-row items-center text-black hover:text-blue-400 w-full"
                        >
                          <item.icon className="w-5 h-5 mr-2" />
                          <span className="text-sm">{item.label}</span>
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                  )
              ))}
              <DropdownMenuItem>
                <BtnLogout
                  className="flex w-full items-center justify-center bg-red-500 p-4 gap-2 text-white hover:text-red-400 hover:bg-gray-700 transition-all duration-300"
                >
                  <Logout className="w-6 h-6" />
                  <span className="text-sm">Cerrar sesión</span>
                </BtnLogout>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
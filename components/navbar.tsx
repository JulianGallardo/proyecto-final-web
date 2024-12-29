"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Truck, Map, Package, ChartGraph, Home, Logout } from "@mynaui/icons-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import BtnLogout from "@/components/auth/btn-logout";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <nav className="flex items-center p-4 bg-gradient-to-r from-gray-900 via-black to-gray-900 w-full shadow-lg">
      {/* Contenedor de botones centrales */}
      <div className="flex justify-center gap-6 flex-grow">
        {pathname !== "/inicio" && (
          <Link href="/inicio">
            <Button
              type="button"
              className="flex flex-col items-center justify-center bg-transparent p-4 gap-2 text-white hover:text-blue-400 hover:bg-transparent transition-all duration-300"
            >
              <Home className="w-8 h-8" />
              <span className="text-sm">Inicio</span>
            </Button>
          </Link>
        )}
        {pathname !== "/areas" && (
          <Link href="/areas">
            <Button
              type="button"
              className="flex flex-col items-center bg-transparent justify-center p-4 gap-2 text-white hover:text-green-400 hover:bg-transparent transition-all duration-300"
            >
              <Map className="w-8 h-8" />
              <span className="text-sm">Áreas</span>
            </Button>
          </Link>
        )}
        {pathname !== "/repartidores" && (
          <Link href="/repartidores">
            <Button
              type="button"
              className="flex flex-col items-center justify-center bg-transparent p-4 gap-2 text-white hover:text-yellow-400 hover:bg-transparent transition-all duration-300"
            >
              <Truck className="w-8 h-8" />
              <span className="text-sm">Repartidores</span>
            </Button>
          </Link>
        )}
        {pathname !== "/packages" && (
          <Link href="/packages">
            <Button
              type="button"
              className="flex flex-col items-center justify-center bg-transparent p-4 gap-2 text-white hover:text-purple-400 hover:bg-transparent transition-all duration-300"
            >
              <Package className="w-8 h-8" />
              <span className="text-sm">Paquetes</span>
            </Button>
          </Link>
        )}
        {pathname !== "/reportes" && (
          <Link href="/reports">
            <Button
              type="button"
              className="flex flex-col items-center justify-center bg-transparent p-4 gap-2 text-white hover:text-red-400 hover:bg-transparent transition-all duration-300"
            >
              <ChartGraph className="w-8 h-8" />
              <span className="text-sm">Reportes</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Botón de Logout alineado a la derecha */}
      <BtnLogout
        className="ml-auto flex flex-col items-center justify-center bg-transparent p-4 gap-2 text-white hover:text-red-400 hover:bg-transparent transition-all duration-300"
      >
        <Logout className="w-8 h-8" />
        <span className="text-sm">Logout</span>
      </BtnLogout>
    </nav>
  );
}

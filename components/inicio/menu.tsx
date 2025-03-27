"use client";
import { useSession } from "next-auth/react";
import { Truck, Map, Package, ChartGraph, Book, FileText  } from "@mynaui/icons-react";
import CustomCard from "@/components/inicio/card";
import { useRouter } from "next/navigation";
import { canView } from "@/permissions/hasPermissions";
import { Resource } from "@/permissions/typePermissions";
import { Table } from "lucide-react";

export default function Menu() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) return null;

  const { name: userName, role } = session.user;

  // Define menu items with their metadata, sorted alphabetically by title
  const menuItems = [
    { resource: Resource.AGENTE, title: "Agentes", description: "Consulta y administra la información de los agentes.", icon: Truck, path: "/agentes" },
    { resource: Resource.CONTROL, title: "Control", description: "Revisa los datos y genera reportes detallados.", icon: ChartGraph, path: "/control" },
    { resource: Resource.CONTROL_AGENTE, title: "Estadísticas", description: "Visualiza tus estadísticas de entrega.", icon: ChartGraph, path: "/control-agente" },
    { resource: Resource.ENTREGAS, title: "Entregas", description: "Consulta y administra la información de tus entregas", icon: Package, path: "/entregas" },
    { resource: Resource.GENERAR_INGRESO, title: "Generar Ingreso", description: "Genera la plantilla de ingresos", icon: FileText , path: "/generar-ingreso" },
    { resource: Resource.INSTRUMENTOS, title: "Instrumentos", description: "Gestiona y rastrea los instrumentos en tránsito.", icon: Package, path: "/instrumentos" },
    { resource: Resource.INSTRUMENTOS_AGENTE, title: "Mi Carpeta", description: "Visualiza tus instrumentos asignados.", icon: Book, path: "/instrumentos-agente" },
    { resource: Resource.MESA_ENTRADA, title: "Mesa de Entrada", description: "Gestiona el personal de mesa de entrada.", icon: Table, path: "/mesa-de-entrada" },
    { resource: Resource.PLANIFICADOR, title: "Planificador", description: "Planifica la ruta de reparto.", icon: Map, path: "/planificador-de-ruta" },
    { resource: Resource.SUB_ZONAS, title: "Subzonas", description: "Administra las subzonas del sistema.", icon: Map, path: "/subzonas" },
    { resource: Resource.ZONAS, title: "Zonas", description: "Gestiona y visualiza las zonas disponibles en el sistema.", icon: Map, path: "/zonas" }
  ].sort((a, b) => a.title.localeCompare(b.title));

  // Filter items based on user permissions
  const visibleItems = menuItems.filter(item => canView(role, item.resource));

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-6">
      <h1 className="mb-8 text-2xl md:text-3xl font-semibold text-gray-800">
        Bienvenido, {userName} 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 grid-flow-row-dense">
        {visibleItems.map((item, index) => (
          <CustomCard
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
            onClick={() => router.push(item.path)}
          />
        ))}
      </div>
    </div>
  );
}
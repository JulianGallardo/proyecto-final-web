"use client";
import { useSession } from "next-auth/react";
import { Truck, Map, Package, ChartGraph } from "@mynaui/icons-react";
import CustomCard from "@/components/inicio/card";
import { useRouter } from "next/navigation";
import { canView } from "@/permissions/hasPermissions";
import { Resource } from "@/permissions/typePermissions";

export default function Menu() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) return null;

  const { name: userName, role } = session.user;

  // Define menu items with their metadata
  const menuItems = [
    { resource: Resource.ZONAS, title: "Zonas", description: "Gestiona y visualiza las zonas disponibles en el sistema.", icon: Map, path: "/zonas" },
    { resource: Resource.ENTREGAS, title: "Entregas", description: "Consulta y administra la información de tus entregas", icon: Package, path: "/entregas" },
    { resource: Resource.AGENTE, title: "Agentes", description: "Consulta y administra la información de los agentes.", icon: Truck, path: "/agentes" },
    { resource: Resource.INSTRUMENTOS, title: "Instrumentos", description: "Gestiona y rastrea los instrumentos en tránsito.", icon: Package, path: "/instrumentos" },
    { resource: Resource.CONTROL, title: "Control", description: "Revisa los datos y genera reportes detallados.", icon: ChartGraph, path: "/control" },
    { resource: Resource.PLANIFICADOR, title: "Planificador", description: "Planifica la ruta de reparto.", icon: Map, path: "/planificador-de-ruta" },
    { resource: Resource.CONTROL_AGENTE, title: "Estadísticas", description: "Visualiza tus estadísticas de entrega.", icon: ChartGraph, path: "/control-agente" },
  ];

  // Filter items based on user permissions
  const visibleItems = menuItems.filter(item => canView(role, item.resource));

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-6">
      {/* Welcome Header */}
      <h1 className="mb-8 text-2xl md:text-3xl font-semibold text-gray-800">
        Bienvenido, {userName} 👋
      </h1>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
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
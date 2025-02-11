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

  if (!session?.user) {
    return null;
  }

  const userName = session.user.name;

  return (
    <div className="p-6 flex flex-col gap-6 w-full">
      {/* Título de bienvenida */}
      <h1 className="text-2xl font-bold mb-6 w-full">
        Bienvenido, {userName} 👋
      </h1>

      {/* Contenedor de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-center justify-center gap-6 md:gap-6 lg:gap-6 mx-4">
        {/* Card Áreas */}

        { canView(session.user.role, Resource.ZONAS) &&
          <CustomCard
            title="Zonas"
            description="Gestiona y visualiza las zonas disponibles en el sistema."
            icon={Map}
            onClick={() => router.push("/zonas")}
          />
        }

        {/* Card Repartidores */}
        {
          canView(session.user.role, Resource.AGENTE) &&
          <CustomCard
          title="Agentes"
          description="Consulta y administra la información de los agente."
          icon={Truck}
          onClick={() => router.push("/agentes")}
        />}

        {/* Card Paquetes */}
        {
          canView(session.user.role, Resource.INSTRUMENTOS) &&
          <CustomCard
          title="Instrumentos"
          description="Gestiona y rastrea los instrumentos en tránsito."
          icon={Package}
          onClick={() => router.push("/instrumentos")}
        />}

        {/* Card Reportes */}
        {
          canView(session.user.role, Resource.CONTROL) &&
          <CustomCard
          title="Control"
          description="Revisa los datos y genera reportes detallados."
          icon={ChartGraph}
          onClick={() => router.push("/control")}
        />}

        {
          canView(session.user.role, Resource.PLANIFICADOR) &&
          <CustomCard
          title="Planificador"
          description="Planifica la ruta de reparto."
          icon={Map}
          onClick={() => router.push("/planificador-de-ruta")} />
        }
      </div>
    </div>
  );
}
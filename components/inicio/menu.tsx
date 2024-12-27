"use client";
import { useSession } from "next-auth/react";
import { Truck, Map, Package, ChartGraph } from "@mynaui/icons-react";
import CustomCard from "@/components/inicio/card";
import { useRouter } from "next/navigation";

export default function Menu() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session || !session.user) {
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
        <CustomCard
          title="Áreas"
          description="Gestiona y visualiza las áreas disponibles en el sistema."
          icon={Map}
          onClick={() => router.push("/areas")}
        />

        {/* Card Repartidores */}
        <CustomCard
          title="Repartidores"
          description="Consulta y administra la información de los repartidores."
          icon={Truck}
          onClick={() => router.push("/repartidores")}
        />

        {/* Card Paquetes */}
        <CustomCard
          title="Paquetes"
          description="Gestiona y rastrea los paquetes en tránsito."
          icon={Package}
          onClick={() => router.push("/packages")}
        />

        {/* Card Reportes */}
        <CustomCard
          title="Reportes"
          description="Revisa los datos y genera reportes detallados."
          icon={ChartGraph}
          onClick={() => router.push("/reports")}
        />
      </div>
    </div>
  );
}
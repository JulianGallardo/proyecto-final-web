

import { auth } from "@/auth";
import ClientCambiarContraseña from "@/components/cambiar-contraseña/FormularioCambiarContraseña";
import NoAutenticado from "@/components/error/errorNoAutenticado";


export default async function CambiarContraseña() {
  const session = await auth();

  if (!session) {
    return <NoAutenticado />;
  }

  return <ClientCambiarContraseña session={session} />;
}

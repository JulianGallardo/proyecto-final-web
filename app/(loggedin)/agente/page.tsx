import { auth } from "@/auth"
import ErrorNotFound from "@/components/error/error404"
import NoAutenticado from "@/components/error/errorNoAutenticado"
 
export default async function HomePage() {
  const session = await auth()
 
  if (!session) {
    return <div><NoAutenticado/></div>
  }
 
  return (
    <div className="w-full h-full">
      <ErrorNotFound reset={
                    async () => 
                    {
                      "use server"
                      window.location.reload()
                    }
                  }
                    error={{
                      name: "Pagina no implementada",
                      message: "Aca iria repartidores",
                      stack: "Page not found"
                    }} />
    </div>

  )
}
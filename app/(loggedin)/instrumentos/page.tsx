import { auth } from "@/auth"
import NoAutenticado from "@/components/error/errorNoAutenticado"
import InstrumentosPages from "@/components/instrumentos/instrumentos-pages"
 
export default async function InsturmentosPage(props: Readonly<{
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}>) {
  const session = await auth()
 
  if (!session) {
    return <div><NoAutenticado/></div>
  }
 
  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      
      <h2 className="text-2xl font-bold">Lista de Instrumentos</h2>
      <InstrumentosPages searchParams={props.searchParams}/>
    </div>

  )
}
import { auth } from "@/auth"
import NoAutenticado from "@/components/error/errorNoAutenticado"
import { CrudInstrumentos } from "@/components/instrumentos/crud-instrumento"
import InstrumentosPages from "@/components/instrumentos/instrumentos-pages"
 
export default async function InsturmentosPage(props: Readonly<{
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}>) {
  const searchParams = await props.searchParams;
  const session = await auth()
 
  if (!session) {
    return <div><NoAutenticado/></div>
  }
 
  return (
    <div className="w-full h-full">
      <InstrumentosPages searchParams={props.searchParams}/>
    </div>

  )
}
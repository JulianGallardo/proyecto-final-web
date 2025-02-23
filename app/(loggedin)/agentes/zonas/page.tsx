

import { getAgentes } from "@/actions/agente-actions"
import {  getAllZonesWithAgents } from "@/actions/zone-actions"
import MapView from "@/components/agentes/zonas/MapView"
import ZoneList from "@/components/agentes/zonas/ZoneList"


export default async function ZonesManagment() {

  const agentes = await getAgentes()
  const zonesDto = await getAllZonesWithAgents()


  console.log(zonesDto)

  return (
    <div className="flex flex-col md:flex-row  w-full h-full">
      <div className="flex-col w-full h-2/3 md:h-full bg-gray-100 z-0">
        <MapView zonasBDD={zonesDto} />
      </div>
      <div className=" p-4 flex-col w-full h-full overflow-auto">
        <ZoneList agentes={agentes} zones={zonesDto} />
      </div>

    </div>
  )
}


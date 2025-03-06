

import { getAgentes } from "@/actions/user-actions"
import {  getAllZonesWithAgents } from "@/actions/zone-actions"
import MapView from "@/components/agentes/zonas/MapView"
import ZoneList from "@/components/agentes/zonas/ZoneList"


export default async function ZonesManagment() {

  const agentes = await getAgentes()
  const zonesDto = await getAllZonesWithAgents()
  zonesDto.sort((a, b) => {
    // Check if both names start with numbers
    const aIsNumeric = /^\d/.test(a.zoneName);
    const bIsNumeric = /^\d/.test(b.zoneName);
    
    // If one starts with a number and the other doesn't
    if (aIsNumeric && !bIsNumeric) {
        return -1; // Numbers come before letters
    } else if (!aIsNumeric && bIsNumeric) {
        return 1; // Letters come after numbers
    }
    
    // If both start with numbers, sort numerically in descending order
    if (aIsNumeric && bIsNumeric) {
        // Extract the numeric parts
        const aMatch = /^\d+/.exec(a.zoneName);
        const aNum = aMatch ? parseInt(aMatch[0]) : 0;
        const bMatch = b.zoneName.match(/^\d+/);
        const bNum = bMatch ? parseInt(bMatch[0]) : 0;
        return bNum - aNum; // Descending order for numbers
    }
    
    // If both are alphabetic, sort alphabetically
    return a.zoneName.localeCompare(b.zoneName);
  }
  );


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


import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"

export default function ZoneList({ zones, agents, onAssignAgent }) {
  const [openZones, setOpenZones] = useState({})

  const toggleZone = (zoneId) => {
    setOpenZones((prev) => ({ ...prev, [zoneId]: !prev[zoneId] }))
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Zonas Registradas</h3>
      <ul className="space-y-2">
        {zones.map((zone) => (
          <li key={zone.id} className="border rounded-md p-2">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleZone(zone.id)}>
              <span>{zone.name}</span>
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform ${openZones[zone.id] ? "transform rotate-180" : ""}`}
              />
            </div>
            {openZones[zone.id] && (
              <div className="mt-2">
                <p className="text-sm mb-1">Asignar agentes:</p>
                {agents.map((agent) => (
                  <label key={agent.id} className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={zone.assignedAgents.includes(agent.id)}
                      onChange={() => onAssignAgent(zone.id, agent.id)}
                      className="mr-2"
                    />
                    {agent.name}
                  </label>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}


"use client"

import { getInstrumentosEntregadosUltimosSeisMeses } from "@/actions/estadisticas-actions"
import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function Overview() {
  const [data, setData] = useState<{ month: string; year: number; count: number }[]>([])

  // Llamar la función para obtener los datos cuando el componente se monte
  useEffect(() => {
    async function fetchData() {
      const data = await getInstrumentosEntregadosUltimosSeisMeses()
      setData(data)
    }
    fetchData()
  }, [])

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data}>
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="count" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

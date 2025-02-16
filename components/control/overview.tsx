"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface OverviewProps {
  data: { month: string; year: number; count: number }[]
}




export default function Overview({ data }: Readonly<OverviewProps>) {
  return (

    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Instrumentos entregados por mes</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data}>
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <Bar dataKey="count" fill="#adfa1d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

  )
}

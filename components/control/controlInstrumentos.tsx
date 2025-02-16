"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TabGeneral from "./Tabs/TabGeneral/TabGeneral"
import TabAgentes from "./Tabs/TabAgente/TabAgente"

export default function DashboardControl() {
  const [activeTab, setActiveTab] = useState("overview")

  return (

    <div className="flex flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Control de Instrumentos</h2>
        </div>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="agentes">Por Agente</TabsTrigger>
            <TabsTrigger value="zonas">Por Zona</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <TabGeneral />
          </TabsContent>
          <TabsContent value="agentes" className="space-y-4">
            <TabAgentes />
          </TabsContent>
          <TabsContent value="zonas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas por Zona</CardTitle>
                <CardDescription>Desglose de instrumentos por cada zona geográfica.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Aquí iría un componente con estadísticas por zona */}
                <p>Contenido de estadísticas por zona (a implementar)</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TabGeneral from "./Tabs/TabGeneral/TabGeneral"

export default function DashboardControl() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <>
      <div className="md:hidden">
        <img
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <img
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Control de Instrumentos</h2>
          </div>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Vista General</TabsTrigger>
              <TabsTrigger value="analytics">Por Agente</TabsTrigger>
              <TabsTrigger value="reports">Por Zona</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
                <TabGeneral />
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas por Agente</CardTitle>
                  <CardDescription>Desglose de instrumentos por cada agente activo.</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Aquí iría un componente con estadísticas por agente */}
                  <p>Contenido de estadísticas por agente (a implementar)</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
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
    </>
  )
}


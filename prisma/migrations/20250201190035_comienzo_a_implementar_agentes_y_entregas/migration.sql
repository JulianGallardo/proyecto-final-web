/*
  Warnings:

  - A unique constraint covering the columns `[instrumentoId]` on the table `Instrumento` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Agente" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntregaInstrumentos" (
    "id" SERIAL NOT NULL,
    "agenteId" INTEGER NOT NULL,
    "instrumentoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntregaInstrumentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AgenteToZone" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AgenteToZone_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agente_userId_key" ON "Agente"("userId");

-- CreateIndex
CREATE INDEX "_AgenteToZone_B_index" ON "_AgenteToZone"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Instrumento_instrumentoId_key" ON "Instrumento"("instrumentoId");

-- AddForeignKey
ALTER TABLE "Agente" ADD CONSTRAINT "Agente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregaInstrumentos" ADD CONSTRAINT "EntregaInstrumentos_agenteId_fkey" FOREIGN KEY ("agenteId") REFERENCES "Agente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregaInstrumentos" ADD CONSTRAINT "EntregaInstrumentos_instrumentoId_fkey" FOREIGN KEY ("instrumentoId") REFERENCES "Instrumento"("instrumentoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgenteToZone" ADD CONSTRAINT "_AgenteToZone_A_fkey" FOREIGN KEY ("A") REFERENCES "Agente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgenteToZone" ADD CONSTRAINT "_AgenteToZone_B_fkey" FOREIGN KEY ("B") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

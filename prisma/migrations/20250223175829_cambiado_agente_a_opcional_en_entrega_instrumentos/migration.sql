-- DropForeignKey
ALTER TABLE "EntregaInstrumentos" DROP CONSTRAINT "EntregaInstrumentos_agenteId_fkey";

-- AlterTable
ALTER TABLE "EntregaInstrumentos" ALTER COLUMN "agenteId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EntregaInstrumentos" ADD CONSTRAINT "EntregaInstrumentos_agenteId_fkey" FOREIGN KEY ("agenteId") REFERENCES "Agente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

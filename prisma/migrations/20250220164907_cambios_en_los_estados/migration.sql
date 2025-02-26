/*
  Warnings:

  - The values [ENTREGADO,NO_ENTREGADO] on the enum `EstadoEntrega` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDIENTE_DE_ENTREGA,ENTREGADO_VERDE,ENTREGADO_AMARILLO,ENTREGADO_ROJO,PENDIENTE_DE_PROCESAR] on the enum `EstadoInstrumento` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "UrgenciaInstrumento" AS ENUM ('NORMAL', 'URGENTE');

-- AlterEnum
BEGIN;
CREATE TYPE "EstadoEntrega_new" AS ENUM ('PENDIENTE_DE_PROCESAR', 'NOTIFICADO', 'NO_NOTIFICADO');
ALTER TABLE "EntregaInstrumentos" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "EntregaInstrumentos" ALTER COLUMN "estado" TYPE "EstadoEntrega_new" USING ("estado"::text::"EstadoEntrega_new");
ALTER TYPE "EstadoEntrega" RENAME TO "EstadoEntrega_old";
ALTER TYPE "EstadoEntrega_new" RENAME TO "EstadoEntrega";
DROP TYPE "EstadoEntrega_old";
ALTER TABLE "EntregaInstrumentos" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE_DE_PROCESAR';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EstadoInstrumento_new" AS ENUM ('CORRECCIONES_SOLICITADAS', 'PENDIENTE_DE_NOTIFICAR', 'PENDIENTE_DE_PROCESAR_NOTIFICACION', 'NOTIFICADO_VERDE', 'NOTIFICADO_AMARILLO', 'NOTIFICADO_ROJO');
ALTER TABLE "Instrumento" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Instrumento" ALTER COLUMN "estado" TYPE "EstadoInstrumento_new" USING ("estado"::text::"EstadoInstrumento_new");
ALTER TYPE "EstadoInstrumento" RENAME TO "EstadoInstrumento_old";
ALTER TYPE "EstadoInstrumento_new" RENAME TO "EstadoInstrumento";
DROP TYPE "EstadoInstrumento_old";
ALTER TABLE "Instrumento" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE_DE_NOTIFICAR';
COMMIT;

-- AlterTable
ALTER TABLE "Instrumento" ADD COLUMN     "urgencia" "UrgenciaInstrumento" NOT NULL DEFAULT 'NORMAL',
ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE_DE_NOTIFICAR';

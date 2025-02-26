-- AlterTable
ALTER TABLE "Instrumento" ADD COLUMN     "zoneName" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Instrumento" ADD CONSTRAINT "Instrumento_zoneName_fkey" FOREIGN KEY ("zoneName") REFERENCES "Zone"("zoneName") ON DELETE RESTRICT ON UPDATE CASCADE;

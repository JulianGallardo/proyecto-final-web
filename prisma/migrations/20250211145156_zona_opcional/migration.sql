-- DropForeignKey
ALTER TABLE "Instrumento" DROP CONSTRAINT "Instrumento_zoneName_fkey";

-- AlterTable
ALTER TABLE "Instrumento" ALTER COLUMN "zoneName" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Instrumento" ADD CONSTRAINT "Instrumento_zoneName_fkey" FOREIGN KEY ("zoneName") REFERENCES "Zone"("zoneName") ON DELETE SET NULL ON UPDATE CASCADE;

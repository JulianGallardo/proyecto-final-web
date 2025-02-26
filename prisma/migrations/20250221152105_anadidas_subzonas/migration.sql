-- CreateTable
CREATE TABLE "SubZone" (
    "id" TEXT NOT NULL,
    "zoneName" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Feature',
    "geometryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "zonaId" TEXT NOT NULL,

    CONSTRAINT "SubZone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubZone_geometryId_key" ON "SubZone"("geometryId");

-- AddForeignKey
ALTER TABLE "SubZone" ADD CONSTRAINT "SubZone_geometryId_fkey" FOREIGN KEY ("geometryId") REFERENCES "Geometry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubZone" ADD CONSTRAINT "SubZone_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "BusMedia" (
    "id" TEXT NOT NULL,
    "busId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL,
    "data" BYTEA,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusMedia_busId_kind_idx" ON "BusMedia"("busId", "kind");

-- AddForeignKey
ALTER TABLE "BusMedia" ADD CONSTRAINT "BusMedia_busId_fkey" FOREIGN KEY ("busId") REFERENCES "Bus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "whBestGear" ALTER COLUMN "itemLink" DROP NOT NULL,
ALTER COLUMN "sourceLink" DROP NOT NULL;

-- CreateTable
CREATE TABLE "EnchantData" (
    "id" SERIAL NOT NULL,
    "slot" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "popularity" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "classSpec" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnchantData_pkey" PRIMARY KEY ("id")
);

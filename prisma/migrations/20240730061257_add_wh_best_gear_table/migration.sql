-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "charRealm" TEXT NOT NULL,
    "combinedData" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "classSpec" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchonGear" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "maxKey" TEXT NOT NULL,
    "popularity" TEXT NOT NULL,
    "itemIcon" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "classSpec" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArchonGear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whBestGear" (
    "id" SERIAL NOT NULL,
    "itemSlot" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemLink" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceLink" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "classSpec" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whBestGear_pkey" PRIMARY KEY ("id")
);

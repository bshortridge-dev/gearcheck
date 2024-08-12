/*
  Warnings:

  - A unique constraint covering the columns `[className,classSpec,categoryName,itemName]` on the table `ArchonGear` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[className,classSpec,slot,name]` on the table `EnchantData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[className,classSpec,itemName]` on the table `whBestGear` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ArchonGear_className_classSpec_categoryName_itemName_key" ON "ArchonGear"("className", "classSpec", "categoryName", "itemName");

-- CreateIndex
CREATE UNIQUE INDEX "EnchantData_className_classSpec_slot_name_key" ON "EnchantData"("className", "classSpec", "slot", "name");

-- CreateIndex
CREATE UNIQUE INDEX "whBestGear_className_classSpec_itemName_key" ON "whBestGear"("className", "classSpec", "itemName");

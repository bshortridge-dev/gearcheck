/*
  Warnings:

  - A unique constraint covering the columns `[className,classSpec,name]` on the table `Character` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Character_className_classSpec_name_key" ON "Character"("className", "classSpec", "name");

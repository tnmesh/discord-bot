/*
  Warnings:

  - A unique constraint covering the columns `[hexId]` on the table `Node` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Node_hexId_key" ON "Node"("hexId");

/*
  Warnings:

  - The primary key for the `Flag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Flag` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flag" (
    "nodeId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    CONSTRAINT "Flag_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Flag" ("key", "nodeId", "value") SELECT "key", "nodeId", "value" FROM "Flag";
DROP TABLE "Flag";
ALTER TABLE "new_Flag" RENAME TO "Flag";
CREATE UNIQUE INDEX "Flag_nodeId_key" ON "Flag"("nodeId");
CREATE UNIQUE INDEX "Flag_key_key" ON "Flag"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

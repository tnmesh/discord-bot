/*
  Warnings:

  - Added the required column `hexId` to the `Node` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Node" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "longName" TEXT NOT NULL,
    "hexId" TEXT NOT NULL,
    "discordId" TEXT
);
INSERT INTO "new_Node" ("discordId", "id", "longName") SELECT "discordId", "id", "longName" FROM "Node";
DROP TABLE "Node";
ALTER TABLE "new_Node" RENAME TO "Node";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

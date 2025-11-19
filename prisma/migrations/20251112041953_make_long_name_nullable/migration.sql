-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Node" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "longName" TEXT,
    "hexId" TEXT NOT NULL,
    "discordId" TEXT
);
INSERT INTO "new_Node" ("discordId", "hexId", "id", "longName") SELECT "discordId", "hexId", "id", "longName" FROM "Node";
DROP TABLE "Node";
ALTER TABLE "new_Node" RENAME TO "Node";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Links" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "isAffiliate" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Links" ("guildId", "id", "type", "url") SELECT "guildId", "id", "type", "url" FROM "Links";
DROP TABLE "Links";
ALTER TABLE "new_Links" RENAME TO "Links";
CREATE UNIQUE INDEX "Links_url_key" ON "Links"("url");
CREATE UNIQUE INDEX "Links_guildId_key" ON "Links"("guildId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

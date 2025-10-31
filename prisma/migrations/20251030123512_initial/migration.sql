-- CreateTable
CREATE TABLE "Node" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "longName" TEXT NOT NULL,
    "discordId" TEXT
);

-- CreateTable
CREATE TABLE "NodeInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hopStart" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NodeInfo_id_fkey" FOREIGN KEY ("id") REFERENCES "Node" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Links" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "guildId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Links_url_key" ON "Links"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Links_guildId_key" ON "Links"("guildId");

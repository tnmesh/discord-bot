-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flag" (
    "nodeId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "readOnly" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("nodeId", "key"),
    CONSTRAINT "Flag_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Flag" ("key", "nodeId", "value") SELECT "key", "nodeId", "value" FROM "Flag";
DROP TABLE "Flag";
ALTER TABLE "new_Flag" RENAME TO "Flag";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

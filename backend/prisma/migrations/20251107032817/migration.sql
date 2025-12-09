-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "utorid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "spent" REAL,
    "rate" REAL,
    "remark" TEXT,
    "createdBy" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "relatedId" INTEGER,
    "suspicious" BOOLEAN NOT NULL DEFAULT false,
    "processed" BOOLEAN,
    CONSTRAINT "Transaction_utorid_fkey" FOREIGN KEY ("utorid") REFERENCES "User" ("utorid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "createdBy", "id", "processed", "rate", "relatedId", "remark", "spent", "suspicious", "type", "utorid") SELECT "amount", "createdBy", "id", "processed", "rate", "relatedId", "remark", "spent", "suspicious", "type", "utorid" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE UNIQUE INDEX "Transaction_utorid_key" ON "Transaction"("utorid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

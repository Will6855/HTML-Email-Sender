-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GeneralAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'DEMO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" DATETIME
);
INSERT INTO "new_GeneralAccount" ("createdAt", "email", "id", "password", "resetToken", "resetTokenExpiry", "role", "updatedAt", "username") SELECT "createdAt", "email", "id", "password", "resetToken", "resetTokenExpiry", "role", "updatedAt", "username" FROM "GeneralAccount";
DROP TABLE "GeneralAccount";
ALTER TABLE "new_GeneralAccount" RENAME TO "GeneralAccount";
CREATE UNIQUE INDEX "GeneralAccount_username_key" ON "GeneralAccount"("username");
CREATE UNIQUE INDEX "GeneralAccount_email_key" ON "GeneralAccount"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

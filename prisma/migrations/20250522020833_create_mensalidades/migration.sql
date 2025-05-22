-- CreateTable
CREATE TABLE "Mensalidade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "vencimento" DATETIME NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

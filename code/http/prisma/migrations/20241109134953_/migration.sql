-- CreateTable
CREATE TABLE "Repl" (
    "Id" TEXT NOT NULL,
    "baseLanguage" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repl_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Repl" ADD CONSTRAINT "Repl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

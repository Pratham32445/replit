-- CreateTable
CREATE TABLE "User" (
    "Id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Repls" (
    "Id" TEXT NOT NULL,
    "baseLanguage" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Repls_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Repls" ADD CONSTRAINT "Repls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

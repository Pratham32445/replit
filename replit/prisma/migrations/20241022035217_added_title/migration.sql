-- CreateTable
CREATE TABLE "User" (
    "Id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Repl" (
    "Id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "baseLanguage" TEXT NOT NULL,
    "baseImage" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Repl_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Repl" ADD CONSTRAINT "Repl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

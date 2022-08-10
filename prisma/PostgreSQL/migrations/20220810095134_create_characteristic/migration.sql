-- CreateTable
CREATE TABLE "Characteristic" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "userId" TEXT,
    "characteristicTypeId" TEXT,

    CONSTRAINT "Characteristic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacteristicType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CharacteristicType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacteristicType_name_key" ON "CharacteristicType"("name");

-- AddForeignKey
ALTER TABLE "Characteristic" ADD CONSTRAINT "Characteristic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Characteristic" ADD CONSTRAINT "Characteristic_characteristicTypeId_fkey" FOREIGN KEY ("characteristicTypeId") REFERENCES "CharacteristicType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

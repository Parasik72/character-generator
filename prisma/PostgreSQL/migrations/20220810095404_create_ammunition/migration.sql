-- CreateTable
CREATE TABLE "Ammunition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT,
    "ammunitionTypeId" TEXT,

    CONSTRAINT "Ammunition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmmunitionType" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "AmmunitionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmmunitionOnUser" (
    "userId" TEXT NOT NULL,
    "ammunitionId" TEXT NOT NULL,

    CONSTRAINT "AmmunitionOnUser_pkey" PRIMARY KEY ("userId","ammunitionId")
);

-- CreateTable
CREATE TABLE "AmmunitionOnCharacteristics" (
    "characteristicTypeId" TEXT NOT NULL,
    "ammunitionId" TEXT NOT NULL,
    "upValue" INTEGER NOT NULL,

    CONSTRAINT "AmmunitionOnCharacteristics_pkey" PRIMARY KEY ("characteristicTypeId","ammunitionId")
);

-- CreateTable
CREATE TABLE "AmmunitionOnStats" (
    "statId" TEXT NOT NULL,
    "ammunitionId" TEXT NOT NULL,
    "upValue" INTEGER NOT NULL,

    CONSTRAINT "AmmunitionOnStats_pkey" PRIMARY KEY ("statId","ammunitionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ammunition_name_key" ON "Ammunition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AmmunitionType_type_key" ON "AmmunitionType"("type");

-- AddForeignKey
ALTER TABLE "Ammunition" ADD CONSTRAINT "Ammunition_ammunitionTypeId_fkey" FOREIGN KEY ("ammunitionTypeId") REFERENCES "AmmunitionType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmmunitionOnUser" ADD CONSTRAINT "AmmunitionOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmmunitionOnUser" ADD CONSTRAINT "AmmunitionOnUser_ammunitionId_fkey" FOREIGN KEY ("ammunitionId") REFERENCES "Ammunition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmmunitionOnCharacteristics" ADD CONSTRAINT "AmmunitionOnCharacteristics_characteristicTypeId_fkey" FOREIGN KEY ("characteristicTypeId") REFERENCES "CharacteristicType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmmunitionOnCharacteristics" ADD CONSTRAINT "AmmunitionOnCharacteristics_ammunitionId_fkey" FOREIGN KEY ("ammunitionId") REFERENCES "Ammunition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmmunitionOnStats" ADD CONSTRAINT "AmmunitionOnStats_statId_fkey" FOREIGN KEY ("statId") REFERENCES "Stat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmmunitionOnStats" ADD CONSTRAINT "AmmunitionOnStats_ammunitionId_fkey" FOREIGN KEY ("ammunitionId") REFERENCES "Ammunition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Stat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacteristicTypeOnStat" (
    "characteristicTypeId" TEXT NOT NULL,
    "statId" TEXT NOT NULL,
    "eachDivider" INTEGER NOT NULL,
    "eachUp" INTEGER NOT NULL,

    CONSTRAINT "CharacteristicTypeOnStat_pkey" PRIMARY KEY ("characteristicTypeId","statId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stat_name_key" ON "Stat"("name");

-- AddForeignKey
ALTER TABLE "CharacteristicTypeOnStat" ADD CONSTRAINT "CharacteristicTypeOnStat_characteristicTypeId_fkey" FOREIGN KEY ("characteristicTypeId") REFERENCES "CharacteristicType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacteristicTypeOnStat" ADD CONSTRAINT "CharacteristicTypeOnStat_statId_fkey" FOREIGN KEY ("statId") REFERENCES "Stat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillOnStats" (
    "statId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "upValue" INTEGER NOT NULL,

    CONSTRAINT "SkillOnStats_pkey" PRIMARY KEY ("statId","skillId")
);

-- CreateTable
CREATE TABLE "SkillOnCharacteristics" (
    "characteristicTypeId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "upValue" INTEGER NOT NULL,

    CONSTRAINT "SkillOnCharacteristics_pkey" PRIMARY KEY ("characteristicTypeId","skillId")
);

-- CreateTable
CREATE TABLE "SkillOnUsers" (
    "userId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "SkillOnUsers_pkey" PRIMARY KEY ("userId","skillId")
);

-- CreateTable
CREATE TABLE "AmmunitionOnSkills" (
    "skillId" TEXT NOT NULL,
    "ammunitionId" TEXT NOT NULL,

    CONSTRAINT "AmmunitionOnSkills_pkey" PRIMARY KEY ("skillId","ammunitionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- AddForeignKey
ALTER TABLE "SkillOnStats" ADD CONSTRAINT "SkillOnStats_statId_fkey" FOREIGN KEY ("statId") REFERENCES "Stat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillOnStats" ADD CONSTRAINT "SkillOnStats_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillOnCharacteristics" ADD CONSTRAINT "SkillOnCharacteristics_characteristicTypeId_fkey" FOREIGN KEY ("characteristicTypeId") REFERENCES "CharacteristicType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillOnCharacteristics" ADD CONSTRAINT "SkillOnCharacteristics_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillOnUsers" ADD CONSTRAINT "SkillOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillOnUsers" ADD CONSTRAINT "SkillOnUsers_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmmunitionOnSkills" ADD CONSTRAINT "AmmunitionOnSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmmunitionOnSkills" ADD CONSTRAINT "AmmunitionOnSkills_ammunitionId_fkey" FOREIGN KEY ("ammunitionId") REFERENCES "Ammunition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

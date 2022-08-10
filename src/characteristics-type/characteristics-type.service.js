const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");
const CharacteristicsService = require('../characteristics/characteristics.service');
const { v4 } = require('uuid');
const CharacteristicTypeOnStatService = require("../characteristic-type-on-stat/characteristic-type-on-stat.service");
const SkillOnCharacteristicsService = require("../skill-on-characteristics/skill-on-characteristics.service");
const AmmunitionOnCharacteristicsService = require("../ammunition-on-characteristics/ammunition-on-characteristics.service");
const StatsService = require('../stats/stats.service');

class CharacteristicsTypeService {
    async getAll(select){
        return PostgreSQLPrisma.characteristicType.findMany({select});
    }

    async getOneById(id) {
        return PostgreSQLPrisma.characteristicType.findUnique({where: {id}});
    }

    async getOneByName(name) {
        return PostgreSQLPrisma.characteristicType.findFirst({where: {name}});
    }

    async generateCharacteristicTypeId() {
        let characteristicType, id;
        do {
            id = v4();
            characteristicType = await PostgreSQLPrisma.characteristicType.findUnique({where: {id}});
        } while (characteristicType);
        return id;
    }

    async create(dto) {
        return PostgreSQLPrisma.characteristicType.create({data: dto});
    }

    async update(dto, id) {
        return PostgreSQLPrisma.characteristicType.update({data: dto, where: {id}});
    }

    async delete(id) {
        await CharacteristicsService.deleteByCharacteristicTypeId(id);
        await CharacteristicTypeOnStatService.deleteByCharacteristicTypeId(id);
        await SkillOnCharacteristicsService.deleteByCharacteristicTypeId(id);
        await AmmunitionOnCharacteristicsService.deleteByCharacteristicTypeId(id);
        return PostgreSQLPrisma.characteristicType.delete({where: {id}});
    }

    async addStats(newStatsArr, characteristicTypeId) {
        const res = [];
        for(const newStat of newStatsArr){
            const stat = await StatsService.getOneByName(newStat.name);
            if(!stat)
                continue;
            let characteristicTypeOnStat = await CharacteristicTypeOnStatService
                .getOneByCharacteristicTypeIdAndStatId(characteristicTypeId, stat.id);
            if(characteristicTypeOnStat)
                characteristicTypeOnStat = await CharacteristicTypeOnStatService
                    .update(
                        {eachDivider: Number(newStat.eachDivider), eachUp: Number(newStat.eachUp)}, 
                        characteristicTypeId, 
                        stat.id
                    );
            else
                characteristicTypeOnStat = await CharacteristicTypeOnStatService
                    .create({
                        statId: stat.id,
                        characteristicTypeId,
                        eachDivider: Number(newStat.eachDivider),
                        eachUp: Number(newStat.eachUp)
                    });
            res.push(characteristicTypeOnStat);
        }
        return res;
    }

    async removeStats(newStatsArr, characteristicTypeId) {
        const res = [];
        for(const newStat of newStatsArr){
            const stat = await StatsService.getOneByName(newStat.name);
            if(!stat)
                continue;
            let characteristicTypeOnStat = await CharacteristicTypeOnStatService
                .getOneByCharacteristicTypeIdAndStatId(characteristicTypeId, stat.id);
            if(!characteristicTypeOnStat)
                continue;
            characteristicTypeOnStat = await CharacteristicTypeOnStatService
                .delete(characteristicTypeId, stat.id);
            res.push(characteristicTypeOnStat);
        }
        return res;
    }
}

module.exports = new CharacteristicsTypeService();
const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");
const SkillOnUsersService = require("../skill-on-users/skill-on-users.service");
const SkillOnStatsService = require("../skill-on-stats/skill-on-stats.service");
const { v4 } = require('uuid');
const SkillOnCharacteristicsService = require("../skill-on-characteristics/skill-on-characteristics.service");
const AmmunitionOnSkillsService = require("../ammunition-on-skills/ammunition-on-skills.service");
const CharacteristicsTypeService = require('../characteristics-type/characteristics-type.service');
const StatsService = require('../stats/stats.service');

class SkillsService {
    async getAll(select) {
        return PostgreSQLPrisma.skill.findMany({select});
    }

    async create(dto){
        return PostgreSQLPrisma.skill.create({data: dto});
    }

    async update(dto, id){
        return PostgreSQLPrisma.skill.update({data: dto, where: {id}});
    }

    async delete(id){
        await SkillOnStatsService.deleteBySkillId(id);
        await SkillOnCharacteristicsService.deleteBySkillId(id);
        await SkillOnUsersService.deleteBySkillId(id);
        await AmmunitionOnSkillsService.deleteBySkillId(id);
        return PostgreSQLPrisma.skill.delete({where: {id}});
    }

    async getOneByName(name) {
        return PostgreSQLPrisma.skill.findFirst({where: {name}});
    }

    async getOneById(id) {
        return PostgreSQLPrisma.skill.findUnique({where: {id}});
    }

    async getByUserId(userId) {
        const res = [];
        const skillsOnUserArr = await SkillOnUsersService.getByUserId(userId);
        for(const skillsOnUser of skillsOnUserArr)
            res.push(await this.getOneById(skillsOnUser.skillId));
        return res;
    }

    async generateSkillId() {
        let skill, id;
        do {
            id = v4();
            skill = await PostgreSQLPrisma.skill.findUnique({where: {id}});
        } while (skill);
        return id;
    }

    async addCharacteristics(newCharacteristicsArr, skillId) {
        const res = [];
        for(const newCharacteristic of newCharacteristicsArr){
            const characteristicType = await CharacteristicsTypeService.getOneByName(newCharacteristic.name);
            if(!characteristicType)
                continue;
            let skillOnCharacteristic = await SkillOnCharacteristicsService
                .getOneBySkillIdAndCharacteristicTypeId(skillId, characteristicType.id);
            if(skillOnCharacteristic)
                skillOnCharacteristic = await SkillOnCharacteristicsService
                    .update({upValue: Number(newCharacteristic.value)}, skillId, characteristicType.id);
            else
                skillOnCharacteristic = await SkillOnCharacteristicsService
                    .create({
                        characteristicTypeId: characteristicType.id,
                        skillId,
                        upValue: Number(newCharacteristic.value)
                    });
            res.push(skillOnCharacteristic);
        }
        return res;
    }

    async addStats(newStatsArr, skillId) {
        const res = [];
        for(const newStat of newStatsArr){
            const stat = await StatsService.getOneByName(newStat.name);
            if(!stat)
                continue;
            let skillOnStat = await SkillOnStatsService
                .getOneBySkillIdAndStatId(skillId, stat.id);
            if(skillOnStat)
                skillOnStat = await SkillOnStatsService
                    .update({upValue: Number(newStat.value)}, skillId, stat.id);
            else
                skillOnStat = await SkillOnStatsService
                    .create({
                        statId: stat.id,
                        skillId,
                        upValue: Number(newStat.value)
                    });
            res.push(skillOnStat);
        }
        return res;
    }

    async removeStats(newStatsArr, skillId) {
        const res = [];
        for(const newStat of newStatsArr){
            const stat = await StatsService.getOneByName(newStat.name);
            if(!stat)
                continue;
            let skillOnStat = await SkillOnStatsService
                .getOneBySkillIdAndStatId(skillId, stat.id);
            if(!skillOnStat)
                continue;
            skillOnStat = await SkillOnStatsService
                .delete(skillId, stat.id);
            res.push(skillOnStat);
        }
        return res;
    }

    async removeCharacteristics(newCharacteristicsArr, skillId) {
        const res = [];
        for(const newCharacteristic of newCharacteristicsArr){
            const characteristicType = await CharacteristicsTypeService.getOneByName(newCharacteristic.name);
            if(!characteristicType)
                continue;
            let skillOnCharacteristic = await SkillOnCharacteristicsService
                .getOneBySkillIdAndCharacteristicTypeId(skillId, characteristicType.id);
            if(!skillOnCharacteristic)
                continue;
            skillOnCharacteristic = await SkillOnCharacteristicsService
                .delete(skillId, characteristicType.id);
            res.push(skillOnCharacteristic);
        }
        return res;
    }
}

module.exports = new SkillsService();
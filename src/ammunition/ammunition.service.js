const AmmunitionOnUserService = require("../ammunition-on-user/ammunition-on-user.service");
const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");
const { SelectAmmunition, SelectExtendedAmmunition } = require("./ammunition.select");
const FileUploadService = require('../file-upload/file-upload.service');
const path = require('path');
const { v4 } = require('uuid');
const AmmunitionOnCharacteristicsService = require("../ammunition-on-characteristics/ammunition-on-characteristics.service");
const AmmunitionOnStatsService = require('../ammunition-on-stats/ammunition-on-stats.service');
const AmmunitionOnSkillsService = require('../ammunition-on-skills/ammunition-on-skills.service');
const CharacteristicsTypeService = require('../characteristics-type/characteristics-type.service');
const StatsService = require('../stats/stats.service');
const SkillsService = require("../skills/skills.service");

const AMMUNITION_PATH = path.resolve(__dirname, '..', process.env.AMMUNITION_PATH) || 'ammunition_path';

class AmmunitionService {
    async getOneById(id, select){
        return PostgreSQLPrisma.ammunition.findFirst({where: {id}, select});
    }

    async getByUserId(userId){
        const ammunitions = [];
        const ammunitionOnUserArr = await AmmunitionOnUserService.getByUserId(userId);
        for(const ammunitionOnUser of ammunitionOnUserArr)
            ammunitions.push(await this.getOneById(ammunitionOnUser.ammunitionId, SelectAmmunition));
        return ammunitions;
    }

    async getAll(){
        return PostgreSQLPrisma.ammunition.findMany({select: SelectExtendedAmmunition});
    }

    async getByAmmunitionTypeId(ammunitionTypeId){
        return PostgreSQLPrisma.ammunition.findMany({where: {ammunitionTypeId}, select: SelectExtendedAmmunition})
    }

    async getOneByName(name){
        return PostgreSQLPrisma.ammunition.findFirst({where: {name}, select: SelectExtendedAmmunition})
    }

    async generateAmmunitionId() {
        let ammunition, id;
        do {
            id = v4();
            ammunition = await PostgreSQLPrisma.ammunition.findUnique({where: {id}});
        } while (ammunition);
        return id;
    }

    async create(dto) {
        return PostgreSQLPrisma.ammunition.create({data: dto});
    }

    async delete(ammunition) {
        return PostgreSQLPrisma.ammunition.delete({where: {id: ammunition.id}});
    }

    async deleteAmmunition(ammunition) {
        await AmmunitionOnUserService.deleteByAmmunitionId(ammunition.id);
        await AmmunitionOnCharacteristicsService.deleteByAmmunitionId(ammunition.id);
        await AmmunitionOnStatsService.deleteByAmmunitionId(ammunition.id);
        await AmmunitionOnSkillsService.deleteByAmmunitionId(ammunition.id);
        await this.delete(ammunition);
    }

    uploadFile(file, ammunition){
        if(ammunition && ammunition.picture)
            FileUploadService.deleteFile(ammunition.picture);
        return FileUploadService.uploadFile(file, AMMUNITION_PATH);
    }

    deleteFile(ammunition) {
        if(ammunition && ammunition.picture)
            return FileUploadService.deleteFile(ammunition.picture);
        return null;
    }

    async updateAmmunition(dto, ammunition, select) {
        return PostgreSQLPrisma.ammunition.update({data: dto, where: {id: ammunition.id}, select});
    }

    async addCharacteristics(newCharacteristicsArr, ammunitionId) {
        const res = [];
        for(const newCharacteristic of newCharacteristicsArr){
            const characteristicType = await CharacteristicsTypeService.getOneByName(newCharacteristic.name);
            if(!characteristicType)
                continue;
            let ammunitionOnCharacteristic = await AmmunitionOnCharacteristicsService
                .getOneByCharacteristicTypeIdAndAmmunitionId(characteristicType.id, ammunitionId);
            if(ammunitionOnCharacteristic)
                ammunitionOnCharacteristic = await AmmunitionOnCharacteristicsService
                    .update({upValue: Number(newCharacteristic.value)}, characteristicType.id, ammunitionId);
            else
                ammunitionOnCharacteristic = await AmmunitionOnCharacteristicsService
                    .create({
                        characteristicTypeId: characteristicType.id,
                        ammunitionId,
                        upValue: Number(newCharacteristic.value)
                    });
            res.push(ammunitionOnCharacteristic);
        }
        return res;
    }

    async addStats(newStatsArr, ammunitionId) {
        const res = [];
        for(const newStat of newStatsArr){
            const stat = await StatsService.getOneByName(newStat.name);
            if(!stat)
                continue;
            let ammunitionOnStats = await AmmunitionOnStatsService
                .getOneByAmmunitionIdAndStatId(ammunitionId, stat.id);
            if(ammunitionOnStats)
                ammunitionOnStats = await AmmunitionOnStatsService
                    .update({upValue: Number(newStat.value)}, ammunitionId, stat.id);
            else
                ammunitionOnStats = await AmmunitionOnStatsService
                    .create({
                        statId: stat.id,
                        ammunitionId,
                        upValue: Number(newStat.value)
                    });
            res.push(ammunitionOnStats);
        }
        return res;
    }

    async addSkills(newSkillsArr, ammunitionId) {
        const res = [];
        for(const newSkill of newSkillsArr){
            const skill = await SkillsService.getOneByName(newSkill.name);
            if(!skill)
                continue;
            let ammunitionOnSkills = await AmmunitionOnSkillsService
                .getOneByAmmunitionIdAndSkillId(ammunitionId, skill.id);
            if(ammunitionOnSkills)
                continue;
            ammunitionOnSkills = await AmmunitionOnSkillsService
                .create({
                    skillId: skill.id,
                    ammunitionId
                });
            res.push(ammunitionOnSkills);
        }
        return res;
    }

    async removeSkills(newSkillsArr, ammunitionId) {
        const res = [];
        for(const newSkill of newSkillsArr){
            const skill = await SkillsService.getOneByName(newSkill.name);
            if(!skill)
                continue;
            let ammunitionOnSkills = await AmmunitionOnSkillsService
                .getOneByAmmunitionIdAndSkillId(ammunitionId, skill.id);
            if(!ammunitionOnSkills)
                continue;
            ammunitionOnSkills = await AmmunitionOnSkillsService
                .delete(ammunitionId, skill.id);
            res.push(ammunitionOnSkills);
        }
        return res;
    }

    async removeStats(newStatsArr, ammunitionId) {
        const res = [];
        for(const newStat of newStatsArr){
            const stat = await StatsService.getOneByName(newStat.name);
            if(!stat)
                continue;
            let ammunitionOnStats = await AmmunitionOnStatsService
                .getOneByAmmunitionIdAndStatId(ammunitionId, stat.id);
            if(!ammunitionOnStats)
                continue;
            ammunitionOnStats = await AmmunitionOnStatsService
                .delete(ammunitionOnStats.ammunitionId, ammunitionOnStats.statId);
            res.push(ammunitionOnStats);
        }
        return res;
    }

    async removeCharacteristics(newCharacteristicsArr, ammunitionId) {
        const res = [];
        for(const newCharacteristic of newCharacteristicsArr){
            const characteristicType = await CharacteristicsTypeService.getOneByName(newCharacteristic.name);
            if(!characteristicType)
                continue;
            let ammunitionOnCharacteristic = await AmmunitionOnCharacteristicsService
                .getOneByCharacteristicTypeIdAndAmmunitionId(characteristicType.id, ammunitionId);
            if(!ammunitionOnCharacteristic)
                continue;
            ammunitionOnCharacteristic = await AmmunitionOnCharacteristicsService
                .delete(ammunitionOnCharacteristic.characteristicTypeId, ammunitionOnCharacteristic.ammunitionId);
            res.push(ammunitionOnCharacteristic);
        }
        return res;
    }
}

module.exports = new AmmunitionService();
const AmmunitionOnSkillsService = require("../ammunition-on-skills/ammunition-on-skills.service");
const AmmunitionOnStatsService = require("../ammunition-on-stats/ammunition-on-stats.service");
const AmmunitionOnUserService = require("../ammunition-on-user/ammunition-on-user.service");
const CharacteristicTypeOnStatService = require("../characteristic-type-on-stat/characteristic-type-on-stat.service");
const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");
const SkillOnStatsService = require("../skill-on-stats/skill-on-stats.service");
const SkillOnUsersService = require("../skill-on-users/skill-on-users.service");
const { v4 } = require('uuid');

class StatsService {
    async getAll(){
        return PostgreSQLPrisma.stat.findMany();
    }

    async getOneByName(name){
        return PostgreSQLPrisma.stat.findFirst({where: {name}});
    }

    async getOneById(id){
        return PostgreSQLPrisma.stat.findUnique({where: {id}});
    }

    async calculateStats(userId, characteristics){
        let res = [];
        const stats = await this.getAll();
        const ammunitionOnUserArr = await AmmunitionOnUserService.getByUserId(userId);
        for(const stat of stats){
            res.push({...stat, value: 0});
            let statValue = 0;
            for(const ammunitionOnUser of ammunitionOnUserArr){
                const ammunitionOnStats = await AmmunitionOnStatsService.getOneByAmmunitionIdAndStatId(ammunitionOnUser.ammunitionId, stat.id);
                if(ammunitionOnStats)
                    statValue += ammunitionOnStats.upValue;
                const ammunitionOnSkillsArr = await AmmunitionOnSkillsService.getByAmmunitionId(ammunitionOnUser.ammunitionId);
                for(const ammunitionOnSkill of ammunitionOnSkillsArr){
                    const skillOnUser = await SkillOnUsersService.getOneBySkillIdAndUserId(ammunitionOnSkill.skillId, userId);
                    if(!skillOnUser)
                        continue;
                    const skillOnStat = await SkillOnStatsService.getOneBySkillIdAndStatId(skillOnUser.skillId, stat.id);
                    if(skillOnStat)
                        statValue += skillOnStat.upValue;
                }
            }
            res[res.length - 1].value += statValue;
        }
        for(const characteristic of characteristics){
            const characteristicTypeOnStatArr = await CharacteristicTypeOnStatService.getByCharacteristicTypeId(characteristic.characteristicTypeId);
            for(const characteristicTypeOnStat of characteristicTypeOnStatArr){
                const resValue = Math.trunc(characteristic.value / characteristicTypeOnStat.eachDivider) * characteristicTypeOnStat.eachUp;
                res = res.map(stat => stat.id === characteristicTypeOnStat.statId
                                      ? {...stat, value: stat.value + resValue}
                                      : stat);
            }
        }
        return res;
    }

    async create(dto) {
        return PostgreSQLPrisma.stat.create({data: dto});
    }
    
    async update(dto, id) {
        return PostgreSQLPrisma.stat.update({data: dto, where: {id}});
    }

    async delete(id) {
        await CharacteristicTypeOnStatService.deleteByStatId(id);
        await SkillOnStatsService.deleteByStatId(id);
        await AmmunitionOnStatsService.deleteByStatId(id);
        return PostgreSQLPrisma.stat.delete({where: {id}});
    }

    async generateStatId() {
        let stat, id;
        do {
            id = v4();
            stat = await PostgreSQLPrisma.stat.findUnique({where: {id}});
        } while (stat);
        return id;
    }
}

module.exports = new StatsService();
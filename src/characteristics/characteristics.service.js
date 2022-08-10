const AmmunitionOnCharacteristicsService = require("../ammunition-on-characteristics/ammunition-on-characteristics.service");
const AmmunitionOnSkillsService = require("../ammunition-on-skills/ammunition-on-skills.service");
const AmmunitionOnUserService = require("../ammunition-on-user/ammunition-on-user.service");
const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");
const SkillOnCharacteristicsService = require("../skill-on-characteristics/skill-on-characteristics.service");
const SkillOnUsersService = require("../skill-on-users/skill-on-users.service");
const { SelectCharacteristics } = require('./characteristics.select');
const { v4 } = require('uuid');

class CharacteristicsService {
    async getByUserId(userId, select) {
        return PostgreSQLPrisma.characteristic.findMany({where: {userId}, select});
    }

    async deleteByCharacteristicTypeId(characteristicTypeId) {
        return PostgreSQLPrisma.characteristic.deleteMany({where: {characteristicTypeId}});
    }

    async calculateCharacteristics(userId){
        const characteristicsArr = await this.getByUserId(userId, SelectCharacteristics);
        const ammunitionOnUserArr = await AmmunitionOnUserService.getByUserId(userId);
        for(const characteristic of characteristicsArr){
            for(const ammunitionOnUser of ammunitionOnUserArr){
                const ammunitionOnCharacteristics = await AmmunitionOnCharacteristicsService
                    .getOneByCharacteristicTypeIdAndAmmunitionId(characteristic.characteristicTypeId, ammunitionOnUser.ammunitionId);
                if(ammunitionOnCharacteristics)
                    characteristic.value += ammunitionOnCharacteristics.upValue;
                const ammunitionOnSkillsArr = await AmmunitionOnSkillsService.getByAmmunitionId(ammunitionOnUser.ammunitionId);
                for(const ammunitionOnSkill of ammunitionOnSkillsArr){
                    const skillOnUser = await SkillOnUsersService.getOneBySkillIdAndUserId(ammunitionOnSkill.skillId, userId);
                    if(!skillOnUser)
                        continue;
                    const skillOnCharacteristic = await SkillOnCharacteristicsService
                        .getOneBySkillIdAndCharacteristicTypeId(skillOnUser.skillId, characteristic.characteristicTypeId);
                    if(skillOnCharacteristic)
                        characteristic.value += skillOnCharacteristic.upValue;
                }
            }
        }
        return characteristicsArr;
    }

    async updateCharacteristic(curCharacteristicsArr, newCharacteristicsArr){
        for(const newCharacteristic of newCharacteristicsArr)
            for(const curCharacteristic of curCharacteristicsArr)
                if(curCharacteristic.characteristicType.name === newCharacteristic.name){
                    const characteristic = await PostgreSQLPrisma.characteristic
                        .update({
                            where: {id: curCharacteristic.id}, 
                            data: {value: newCharacteristic.value}
                        });
                    curCharacteristicsArr = curCharacteristicsArr
                        .map(curChar => curChar.id === characteristic.id
                                        ? {...curChar, value: characteristic.value}
                                        : curChar);
                    break;
                }    
        return curCharacteristicsArr;
    }

    async generateCharacteristicId() {
        let characteristic, id;
        do {
            id = v4();
            characteristic = await PostgreSQLPrisma.characteristic.findUnique({where: {id}});
        } while (characteristic);
        return id;
    }

    async create(dto){
        return await PostgreSQLPrisma.characteristic.create({data: dto});
    }

    async addCharacteristicsForNewUser(userId, allTypesArr){
        for(const type of allTypesArr){
            const id = await this.generateCharacteristicId();
            await this.create({id, userId, characteristicTypeId: type.id, value: 0});
        }
    }
}

module.exports = new CharacteristicsService();
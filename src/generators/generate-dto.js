const bcrypt = require('bcryptjs');

class GeneratorDto{
    prefix;
    index = 0;
    constructor(prefix){
        this.prefix = prefix;
    }
    generateUserDto() {
        ++this.index;
        return {
            email: `${this.prefix}user${this.index}@test.com`,
            password: bcrypt.hashSync('12345', 5),
            id: `${this.prefix}user${this.index}`,
            createdAt: new Date(0)
        }
    }
    generateRoleDto(roleType){
        ++this.index;
        return {
            id: `${this.prefix}role${this.index}`,
            name: roleType
        }
    }
    generateLogDto(createdBy){
        ++this.index;
        return {
            id: `${this.prefix}log${this.index}`,
            operation: `${this.prefix}log${this.index}`,
            createdBy,
            createdAt: new Date(0)
        }
    }
    generateActivationLinkDto(userId, link, phoneCode){
        ++this.index;
        return {
            userId,
            link,
            isActivated: false,
            phoneCode
        }
    }
    generateTokenDto(userId, accessToken){
        ++this.index;
        return {
            userId,
            accessToken,
            isActive: true,
            lastAuthorization: new Date(0)
        }
    }
    generateAmmunitionDto(name){
        ++this.index;
        return {
            id: `${this.prefix}amm${this.index}`,
            name,
            picture: `${this.prefix}amm${this.index}`
        }
    }
    generateAmmunitionTypeDto(type){
        ++this.index;
        return {
            id: `${this.prefix}ammtype${this.index}`,
            type
        }
    }
    generateCharacteristicTypeDto(name){
        ++this.index;
        return {
            id: `${this.prefix}chartype${this.index}`,
            name
        }
    }
    generateSkillDto(name){
        ++this.index;
        return {
            id: `${this.prefix}skill${this.index}`,
            name
        }
    }
};

module.exports = GeneratorDto;
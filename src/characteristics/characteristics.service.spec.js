const CharacteristicsService = require('./characteristics.service');

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        characteristic: {
            findFirst: jest.fn().mockImplementation((dto) => {
                return dto.where;
            }),
            findUnique: jest.fn().mockImplementation((dto) => {
                return null;
            }),
            findMany: jest.fn().mockImplementation((dto) => {
                return [{
                    userId: dto.where.userId,
                    characteristicTypeId: '123',
                    value: 1
                }];
            }),
            deleteMany: jest.fn().mockImplementation((dto) => {
                return []
            }),
            create: jest.fn().mockImplementation((dto) => {
                return dto.data
            }),
            delete: jest.fn().mockImplementation((dto) => {
                return dto.where
            }),
            update: jest.fn().mockImplementation((dto) => {
                return {
                    ...dto.where,
                    ...dto.data
                }
            }),
        }
    }
});

jest.mock('../ammunition-on-characteristics/ammunition-on-characteristics.service', () => {
    return {
        getOneByCharacteristicTypeIdAndAmmunitionId: jest.fn().mockImplementation((characteristicTypeId, ammunitionId) => {
            return {
                characteristicTypeId,
                ammunitionId,
                upValue: 1
            }
        }),
    }
});

jest.mock('../ammunition-on-skills/ammunition-on-skills.service', () => {
    return {
        getByAmmunitionId: jest.fn().mockImplementation((ammunitionId) => {
            return [{skillId: '123', ammunitionId}];
        }),
    }
});

jest.mock('../ammunition-on-user/ammunition-on-user.service', () => {
    return {
        getByUserId: jest.fn().mockImplementation((userId) => {
            return [{ammunitionId: '123', userId}];
        }),
    }
});

jest.mock('../skill-on-characteristics/skill-on-characteristics.service', () => {
    return {
        getOneBySkillIdAndCharacteristicTypeId: jest.fn().mockImplementation((skillId, CharacteristicTypeId) => {
            return [{skillId, CharacteristicTypeId, upValue: 1}];
        }),
    }
});

jest.mock('../skill-on-users/skill-on-users.service', () => {
    return {
        getOneBySkillIdAndUserId: jest.fn().mockImplementation((skillId, userId) => {
            return [{skillId, userId}];
        }),
    }
});

describe('characteristics service', () => {
    it('should be defined', () => {
        expect(CharacteristicsService).toBeDefined();
    });
    it('should return by user id', async () => {
        const userId = '123';
        expect(await CharacteristicsService.getByUserId(userId)).toEqual(expect.any(Array))
    });
    it('should delete by user id', async () => {
        const characteristicTypeId = '123';
        expect(await CharacteristicsService.deleteByCharacteristicTypeId(characteristicTypeId)).toEqual(expect.any(Array))
    });
    it('should calculate characteristics', async () => {
        const userId = '123';
        expect(await CharacteristicsService.calculateCharacteristics(userId)).toEqual(expect.arrayContaining([expect.objectContaining({
            userId
        })]));
    });
    it('should update characteristics', async () => {
        const curCharacteristicsArr = [{
            id: '456',
            characteristicType: {
                name: "Strength"
            },
            value: 10
        }];
        const newCharacteristicsArr = [{
            name: "Strength",
            value: 5
        }];
        expect(await CharacteristicsService.updateCharacteristic(curCharacteristicsArr, newCharacteristicsArr)).toEqual([
            {...curCharacteristicsArr[0], value: newCharacteristicsArr[0].value}
        ]);
    });
    it('should generate characteristic id', async () => {
        expect(await CharacteristicsService.generateCharacteristicId()).toEqual(expect.any(String));
    });
    it('should create', async () => {
        const dto = {
            id: '123',
            value: 5,
            userId: '456',
            characteristicTypeId: '789'
        }
        expect(await CharacteristicsService.create(dto)).toMatchObject({
            ...dto
        });
    });
    it('should add characteristics for new user', async () => {
        const characteristics = [{
            id: '456',
            name: "Strength"
        }];
        const userId = '123';
        expect(await CharacteristicsService.addCharacteristicsForNewUser(userId, characteristics));
    });
});
const SkillOnCharacteristicsService = require('./skill-on-characteristics.service');

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        skillOnCharacteristics: {
            findFirst: jest.fn().mockImplementation((dto) => {
                return dto.where;
            }),
            findMany: jest.fn().mockImplementation((dto) => {
                return [{...dto.where}];
            }),
            deleteMany: jest.fn().mockImplementation((dto) => {
                return [{...dto.where}]
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

describe('skill-on-characteristics service', () => {
    it('should be defined', () => {
        expect(SkillOnCharacteristicsService).toBeDefined();
    });
    it('should return one by skill id and characterisitc type id', async () => {
        const skillId = '123';
        const characteristicTypeId = '456';
        expect(await SkillOnCharacteristicsService.getOneBySkillIdAndCharacteristicTypeId(skillId, characteristicTypeId)).toMatchObject({
            skillId,
            characteristicTypeId
        });
    });
    it('should delete by characterisitc type id', async () => {
        const characteristicTypeId = '456';
        expect(await SkillOnCharacteristicsService.deleteByCharacteristicTypeId(characteristicTypeId)).toEqual(expect.arrayContaining([expect.objectContaining({
            characteristicTypeId
        })]));
    });
    it('should delete by skill id', async () => {
        const skillId = '123';
        expect(await SkillOnCharacteristicsService.deleteBySkillId(skillId)).toEqual(expect.arrayContaining([expect.objectContaining({
            skillId
        })]));
    });
    it('should create', async () => {
        const dto = {
            characteristicTypeId: '123',
            skillId: '456',
            upValue: 10
        }
        expect(await SkillOnCharacteristicsService.create(dto)).toMatchObject({
            ...dto
        })
    });
    it('should delete', async () => {
        const dto = {
            characteristicTypeId: '123',
            skillId: '456',
        }
        expect(await SkillOnCharacteristicsService.delete(dto.skillId, dto.characteristicTypeId)).toMatchObject({
            characteristicTypeId_skillId: {
                ...dto
            }
        })
    });
    it('should update', async () => {
        const dto = {
            characteristicTypeId: '123',
            skillId: '456',
            upValue: 10
        }
        expect(await SkillOnCharacteristicsService.update(dto, dto.skillId, dto.characteristicTypeId)).toMatchObject({
            ...dto
        })
    });
});
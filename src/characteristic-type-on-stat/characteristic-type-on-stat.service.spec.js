const CharacteristicTypeOnStatService = require('./characteristic-type-on-stat.service');

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        characteristicTypeOnStat: {
            findFirst: jest.fn().mockImplementation((dto) => {
                return dto.where;
            }),
            findMany: jest.fn().mockImplementation((dto) => {
                return [];
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

describe('characteristic-type-on-stat service', () => {
    it('should be defined', () => {
        expect(CharacteristicTypeOnStatService).toBeDefined();
    });
    it('should return by characteristic type id', async () => {
        const characteristicTypeId = '123';
        expect(await CharacteristicTypeOnStatService.getByCharacteristicTypeId(characteristicTypeId)).toEqual(expect.any(Array))
    });
    it('should delete by characteristic type id', async () => {
        const characteristicTypeId = '123';
        expect(await CharacteristicTypeOnStatService.deleteByCharacteristicTypeId(characteristicTypeId)).toEqual(expect.any(Array))
    });
    it('should delete by stat id', async () => {
        const statId = '123';
        expect(await CharacteristicTypeOnStatService.deleteByStatId(statId)).toEqual(expect.any(Array))
    });
    it('should return one by characteristic type id and stat id', async () => {
        const characteristicTypeId = '123';
        const statId = '456';
        expect(await CharacteristicTypeOnStatService.getOneByCharacteristicTypeIdAndStatId(characteristicTypeId, statId))
            .toMatchObject({
                characteristicTypeId,
                statId
            });
    });
    it('should create', async () => {
        const dto = {
            characteristicTypeId: '123',
            statId: '456',
            eachDivider: 2,
            eachUp: 1
        };
        expect(await CharacteristicTypeOnStatService.create(dto))
            .toMatchObject({
                ...dto
            });
    });
    it('should delete', async () => {
        const characteristicTypeId = '123';
        const statId = '456';
        expect(await CharacteristicTypeOnStatService.delete(characteristicTypeId, statId))
            .toMatchObject({
                characteristicTypeId_statId: {
                    characteristicTypeId,
                    statId
                }
            });
    });
    it('should update', async () => {
        const dto = {
            characteristicTypeId: '123',
            statId: '456',
            eachDivider: 2,
            eachUp: 1
        };
        expect(await CharacteristicTypeOnStatService.update(dto, dto.characteristicTypeId, dto.statId))
            .toMatchObject({
                ...dto
            });
    });
});
const AmmunitionOnCharacteristicsService = require('./ammunition-on-characteristics.service');

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        ammunitionOnCharacteristics: {
            findFirst: jest.fn().mockImplementation((dto) => {
                return dto.where;
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

describe('logs service', () => {
    it('should be defined', () => {
        expect(AmmunitionOnCharacteristicsService).toBeDefined();
    });
    it('should return one by characteristic type id and ammunition id', async () => {
        const characteristicTypeId = '123';
        const ammunitionId = '456';
        expect(await AmmunitionOnCharacteristicsService.getOneByCharacteristicTypeIdAndAmmunitionId(characteristicTypeId, ammunitionId))
            .toMatchObject({
                characteristicTypeId,
                ammunitionId
            });
    });
    it('should delete by ammunition id', async () => {
        const ammunitionId = '456';
        expect(await AmmunitionOnCharacteristicsService.deleteByAmmunitionId(ammunitionId))
            .toEqual(expect.any(Array));
    });
    it('should create', async () => {
        const dto = {
            characteristicTypeId: '123',
            ammunitionId: '456',
            upValue: 10
        }
        expect(await AmmunitionOnCharacteristicsService.create(dto))
            .toMatchObject({
                ...dto
            });
    });
    it('should delete', async () => {
        const dto = {
            characteristicTypeId: '123',
            ammunitionId: '456',
        }
        expect(await AmmunitionOnCharacteristicsService.delete(dto.characteristicTypeId, dto.ammunitionId))
            .toMatchObject({
                characteristicTypeId_ammunitionId: {
                    ...dto
                }
            });
    });
    it('should update', async () => {
        const dto = {
            characteristicTypeId: '123',
            ammunitionId: '456',
            upValue: 10
        }
        expect(await AmmunitionOnCharacteristicsService.update(dto, dto.characteristicTypeId, dto.ammunitionId))
            .toMatchObject({
                ...dto
            });
    });
    it('should delete by characteristic type id', async () => {
        const dto = {
            characteristicTypeId: '123'
        }
        expect(await AmmunitionOnCharacteristicsService.deleteByCharacteristicTypeId(dto.characteristicTypeId))
            .toEqual(expect.any(Array))
    });
});
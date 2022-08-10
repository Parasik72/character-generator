const AmmunitionOnStatsService = require('./ammunition-on-stats.service');

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        ammunitionOnStats: {
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

describe('ammunition-on-stats service', () => {
    it('should be defined', () => {
        expect(AmmunitionOnStatsService).toBeDefined();
    });
    it('should return one by ammunition id and stat id', async () => {
        const ammunitionId = '123';
        const statId = '456';
        expect(await AmmunitionOnStatsService.getOneByAmmunitionIdAndStatId(ammunitionId, statId))
            .toMatchObject({
                ammunitionId,
                statId
            });
    });
    it('should delete by ammunition id', async () => {
        const ammunitionId = '123';
        expect(await AmmunitionOnStatsService.deleteByAmmunitionId(ammunitionId))
            .toEqual(expect.any(Array))
    });
    it('should delete by stat id', async () => {
        const statId = '123';
        expect(await AmmunitionOnStatsService.deleteByStatId(statId))
            .toEqual(expect.any(Array))
    });
    it('should create', async () => {
        const dto = {
            statId: '123',
            ammunitionId: '456',
            upValue: 10
        };
        expect(await AmmunitionOnStatsService.create(dto))
            .toMatchObject({
                ...dto
            });
    });
    it('should delete', async () => {
        const dto = {
            statId: '123',
            ammunitionId: '456',
        };
        expect(await AmmunitionOnStatsService.delete(dto.ammunitionId, dto.statId))
            .toMatchObject({
                statId_ammunitionId: {
                    ...dto
                }
            });
    });
    it('should update', async () => {
        const dto = {
            statId: '123',
            ammunitionId: '456',
            upValue: 10
        };
        expect(await AmmunitionOnStatsService.update(dto, dto.ammunitionId, dto.statId))
            .toMatchObject({
                ...dto
            });
    });
});
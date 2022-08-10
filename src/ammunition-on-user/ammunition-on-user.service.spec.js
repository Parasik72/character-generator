const AmmunitionOnUserService = require('./ammunition-on-user.service');

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        ammunitionOnUser: {
            findMany: jest.fn().mockImplementation((dto) => {
                return [{...dto.where}];
            }),
            deleteMany: jest.fn().mockImplementation((dto) => {
                return [{...dto.where}]
            })
        }
    }
});

describe('logs service', () => {
    it('should be defined', () => {
        expect(AmmunitionOnUserService).toBeDefined();
    });
    it('should return by user id', async () => {
        const userId = '123';
        expect(await AmmunitionOnUserService.getByUserId(userId)).toEqual(expect.any(Array))
    });
    it('should delete by ammunition id', async () => {
        const ammunitionId = '123';
        expect(await AmmunitionOnUserService.deleteByAmmunitionId(ammunitionId)).toEqual(expect.any(Array))
    });
});
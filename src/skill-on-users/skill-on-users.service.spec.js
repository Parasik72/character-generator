const SkillOnUsersService = require('./skill-on-users.service');

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        skillOnUsers: {
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

describe('skill-on-stats service', () => {
    it('should be defined', () => {
        expect(SkillOnUsersService).toBeDefined();
    });
    it('should return one by skill id and user id', async () => {
        const dto = {
            userId: '123',
            skillId: '456'
        }
        expect(await SkillOnUsersService.getOneBySkillIdAndUserId(dto.skillId, dto.userId)).toMatchObject({
            ...dto
        });
    });
    it('should create', async () => {
        const dto = {
            userId: '123',
            skillId: '456'
        }
        console.log(await SkillOnUsersService.create(dto))
        expect(await SkillOnUsersService.create(dto)).toMatchObject({
            skillId: {
                ...dto
            },
            userId: undefined
        });
    });
    it('should delete', async () => {
        const dto = {
            userId: '123',
            skillId: '456'
        }
        expect(await SkillOnUsersService.delete(dto)).toMatchObject({
            userId_skillId: {
                skillId: {
                    ...dto
                }
            }
        });
    });
    it('should delete by skill id', async () => {
        const dto = {
            skillId: '456'
        }
        expect(await SkillOnUsersService.deleteBySkillId(dto.skillId)).toEqual(expect.arrayContaining([expect.objectContaining({
            ...dto
        })]))
    });
});
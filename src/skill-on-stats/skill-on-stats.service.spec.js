const SkillOnStatsService = require('./skill-on-stats.service');

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        skillOnStats: {
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
        expect(SkillOnStatsService).toBeDefined();
    });
    it('should return one by skill id and stat id', async () => {
        const skillId = '123';
        const statId = '456';
        expect(await SkillOnStatsService.getOneBySkillIdAndStatId(skillId, statId)).toMatchObject({
            skillId,
            statId
        });
    });
    it('should delete by skill id', async () => {
        const skillId = '123';
        expect(await SkillOnStatsService.deleteBySkillId(skillId)).toEqual(expect.arrayContaining([expect.objectContaining({
            skillId
        })]));
    });
    it('should delete by skill id', async () => {
        const statId = '123';
        expect(await SkillOnStatsService.deleteByStatId(statId)).toEqual(expect.arrayContaining([expect.objectContaining({
            statId
        })]));
    });
    it('should create', async () => {
        const dto = {
            statId: '123',
            skillId: '456',
            upValue: 10
        }
        expect(await SkillOnStatsService.create(dto)).toMatchObject({
            ...dto
        });
    });
    it('should delete', async () => {
        const dto = {
            statId: '123',
            skillId: '456'
        }
        expect(await SkillOnStatsService.delete(dto)).toMatchObject({
            statId_skillId: {
                skillId: {
                    ...dto
                }
            }
        });
    });
    it('should update', async () => {
        const dto = {
            statId: '123',
            skillId: '456',
            upValue: 10
        }
        expect(await SkillOnStatsService.update(dto)).toMatchObject({
            ...dto
        });
    });
});
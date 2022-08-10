const AmmunitionOnSkillsService = require('./ammunition-on-skills.service');

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        ammunitionOnSkills: {
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

describe('ammunition-on-skills service', () => {
    it('should be defined', () => {
        expect(AmmunitionOnSkillsService).toBeDefined();
    });
    it('should return by ammunition id', async () => {
        const ammunitionId = '123';
        expect(await AmmunitionOnSkillsService.getByAmmunitionId(ammunitionId)).toEqual(expect.any(Array))
    });
    it('should return one by ammunition id and skill is', async () => {
        const ammunitionId = '123';
        const skillId = '456';
        expect(await AmmunitionOnSkillsService.getOneByAmmunitionIdAndSkillId(ammunitionId, skillId)).toMatchObject({
            ammunitionId,
            skillId
        });
    });
    it('should delete by ammunition id', async () => {
        const ammunitionId = '123';
        expect(await AmmunitionOnSkillsService.deleteByAmmunitionId(ammunitionId)).toEqual(expect.any(Array));
    });
    it('should delete by skill id', async () => {
        const skillId = '456';
        expect(await AmmunitionOnSkillsService.deleteBySkillId(skillId)).toEqual(expect.any(Array));
    });
    it('should create', async () => {
        const ammunitionId = '123';
        const skillId = '456';
        expect(await AmmunitionOnSkillsService.create({skillId, ammunitionId})).toMatchObject({
            ammunitionId,
            skillId
        });
    });
    it('should delete', async () => {
        const ammunitionId = '123';
        const skillId = '456';
        expect(await AmmunitionOnSkillsService.delete({skillId, ammunitionId})).toMatchObject({
            skillId_ammunitionId: {
                ammunitionId: {
                    ammunitionId,
                    skillId
                }
            }
        });
    });
});
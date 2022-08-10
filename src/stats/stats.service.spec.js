const StatsService = require('./stats.service');

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        stat: {
            findFirst: jest.fn().mockImplementation((dto) => {
                return dto.where;
            }),
            findUnique: jest.fn().mockImplementation((dto) => {
                if(dto.where.id.length === 36)
                    return null;
                return dto.where;
            }),
            findMany: jest.fn().mockImplementation(() => {
                return [];
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

jest.mock('../ammunition-on-skills/ammunition-on-skills.service', () => {
    return {
        getByAmmunitionId: jest.fn().mockImplementation((ammunitionId) => {
            return [{ammunitionId, skillId: '123'}];
        }),
    }
});

jest.mock('../ammunition-on-stats/ammunition-on-stats.service', () => {
    return {
        getOneByAmmunitionIdAndStatId: jest.fn().mockImplementation((ammunitionId, statId) => {
            return {
                ammunitionId,
                statId,
                upValue: 2
            }
        }),
        deleteByStatId: jest.fn().mockImplementation((statId) => {
            return [{statId}];
        }),
    }
});

jest.mock('../ammunition-on-user/ammunition-on-user.service', () => {
    return {
        getByUserId: jest.fn().mockImplementation((userId) => {
            return [{userId, ammunitionId: '123'}]
        }),
    }
});

jest.mock('../characteristic-type-on-stat/characteristic-type-on-stat.service', () => {
    return {
        getByCharacteristicTypeId: jest.fn().mockImplementation((characteristicTypeId) => {
            return [{
                characteristicTypeId, 
                statId: '123',
                eachDivider: 2,
                eachUp: 1
            }]
        }),
        deleteByStatId: jest.fn().mockImplementation((statId) => {
            return [{statId}];
        }),
    }
});

jest.mock('../skill-on-stats/skill-on-stats.service', () => {
    return {
        getOneBySkillIdAndStatId: jest.fn().mockImplementation((skillId, statId) => {
            return [{
                skillId, 
                statId,
                upValue: 2
            }]
        }),
        deleteByStatId: jest.fn().mockImplementation((statId) => {
            return [{statId}];
        }),
    }
});

jest.mock('../skill-on-users/skill-on-users.service', () => {
    return {
        getOneBySkillIdAndUserId: jest.fn().mockImplementation((skillId, userId) => {
            return [{
                skillId, 
                userId
            }]
        })
    }
});

describe('stats service', () => {
    it('should be defined', () => {
        expect(StatsService).toBeDefined();
    });
    it('should return all the stats', async () => {
        expect(await StatsService.getAll()).toEqual(expect.any(Array))
    });
    it('should return one by name', async () => {
        const name = 'asd';
        expect(await StatsService.getOneByName(name)).toMatchObject({
            name
        });
    });
    it('should return one by id', async () => {
        const id = '123';
        expect(await StatsService.getOneById(id)).toMatchObject({
            id
        });
    });
    it('should calculate stats', async () => {
        const userId = '123';
        const characteristics = [{
            characteristicTypeId: '456',
            value: 2
        }];
        expect(await StatsService.calculateStats(userId, characteristics)).toEqual(expect.any(Array));
    });
    it('should create', async () => {
        const dto = {
            name: 'asd'
        }
        expect(await StatsService.create(dto)).toMatchObject({
            ...dto
        });
    });
    it('should update', async () => {
        const dto = {
            name: 'asd'
        }
        const id = '123';
        expect(await StatsService.update(dto, id)).toMatchObject({
            ...dto,
            id
        });
    });
    it('should delete', async () => {
        const id = '123';
        expect(await StatsService.delete(id)).toMatchObject({
            id
        });
    });
    it('should generate a stat id', async () => {
        expect(await StatsService.generateStatId()).toEqual(expect.any(String));
    });
});
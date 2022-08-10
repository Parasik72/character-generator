const GeneratorDto = require('../generators/generate-dto');
const SkillsService = require('./skills.service');

const mockGDto = new GeneratorDto('skills');
const mockSkills = [
    mockGDto.generateSkillDto('aa'),
    mockGDto.generateSkillDto('aa'),
    mockGDto.generateSkillDto('aa')
]

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        skill: {
            findMany: jest.fn().mockImplementation((select) => {
                return mockSkills
            }),
            create: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateSkillDto('aa'),
                    ...dto.data
                }
            }),
            update: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateSkillDto('aa'),
                    ...dto.data,
                    ...dto.where
                }
            }),
            delete: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateSkillDto('aa'),
                    ...dto.where
                }
            }),
            findFirst: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateSkillDto('aa'),
                    ...dto.where
                }
            }),
            findUnique: jest.fn().mockImplementation((dto) => {
                if(dto.where.id.length === 36)
                    return null;
                return {
                    ...mockGDto.generateSkillDto('aa'),
                    ...dto.where
                }
            }),
        }
    }
});

jest.mock('../skill-on-users/skill-on-users.service', () => {
    return {
        deleteBySkillId: jest.fn().mockImplementation((skillId) => {
            return [{skillId}]
        }),
        getByUserId: jest.fn().mockImplementation((userId) => {
            return [{userId, skillId: '123'}]
        }),
    }
});

jest.mock('../skill-on-stats/skill-on-stats.service', () => {
    return {
        deleteBySkillId: jest.fn().mockImplementation((skillId) => {
            return [{skillId}]
        }),
        getOneBySkillIdAndStatId: jest.fn().mockImplementation((skillId, statId) => {
            return {
                skillId,
                statId,
                upValue: 2
            }
        }),
        update: jest.fn().mockImplementation((dto, skillId, statId) => {
            return {
                ...dto,
                skillId,
                statId
            }
        }),
        create: jest.fn().mockImplementation((dto) => {
            return dto;
        }),
        delete: jest.fn().mockImplementation((skillId, statId) => {
            return {
                skillId,
                statId,
                upValue: 2
            }
        }),
    }
});

jest.mock('../skill-on-characteristics/skill-on-characteristics.service', () => {
    return {
        deleteBySkillId: jest.fn().mockImplementation((skillId) => {
            return [{skillId}]
        }),
        getOneBySkillIdAndCharacteristicTypeId: jest.fn().mockImplementation((skillId, characteristicTypeId) => {
            return {
                skillId,
                characteristicTypeId,
                upValue: 2
            }
        }),
        update: jest.fn().mockImplementation((dto, skillId, characteristicTypeId) => {
            return {
                ...dto,
                skillId,
                characteristicTypeId
            }
        }),
        create: jest.fn().mockImplementation((dto) => {
            return dto;
        }),
        delete: jest.fn().mockImplementation((skillId, characteristicTypeId) => {
            return {
                skillId,
                characteristicTypeId,
                upValue: 2
            }
        }),
    }
});

jest.mock('../ammunition-on-skills/ammunition-on-skills.service', () => {
    return {
        deleteBySkillId: jest.fn().mockImplementation((skillId) => {
            return [{skillId}]
        })
    }
});

jest.mock('../characteristics-type/characteristics-type.service', () => {
    return {
        getOneByName: jest.fn().mockImplementation((name) => {
            return mockGDto.generateCharacteristicTypeDto(name);
        })
    }
});

jest.mock('../stats/stats.service', () => {
    return {
        getOneByName: jest.fn().mockImplementation((name) => {
            return {
                id: '123',
                name
            }
        })
    }
});

describe('skills service', () => {
    it('should be defined', () => {
        expect(SkillsService).toBeDefined();
    });
    it('should return all the skills', async () => {
        expect(await SkillsService.getAll({})).toEqual(expect.any(Array))
    });
    it('should create', async () => {
        const dto = {
            name: 'asd'
        }
        expect(await SkillsService.create(dto)).toMatchObject({
            ...dto
        })
    });
    it('should update', async () => {
        const dto = {
            id: '123',
            name: 'asd'
        }
        expect(await SkillsService.update(dto, dto.id)).toMatchObject({
            ...dto
        })
    });
    it('should delete', async () => {
        const id = '123';
        expect(await SkillsService.delete(id)).toMatchObject({
            id
        })
    });
    it('should return one by name', async () => {
        const name = 'asd';
        expect(await SkillsService.getOneByName(name)).toMatchObject({
            name
        })
    });
    it('should return one by id', async () => {
        const id = '123';
        expect(await SkillsService.getOneById(id)).toMatchObject({
            id
        })
    });
    it('should return by user id', async () => {
        const userId = '123';
        expect(await SkillsService.getByUserId(userId)).toEqual(expect.any(Array));
    });
    it('should generate a skill id', async () => {
        expect(await SkillsService.generateSkillId()).toEqual(expect.any(String));
    });
    it('should add characteristics', async () => {
        const newCharacteristicsArr = [{
            name: "Strength",
            value: 5
        }];
        const skillId = '123';
        expect(await SkillsService.addCharacteristics(newCharacteristicsArr, skillId)).toEqual(expect.arrayContaining([expect.objectContaining({
            upValue: newCharacteristicsArr[0].value,
            skillId
        })]));
    });
    it('should add stats', async () => {
        const newStatsArr = [{
            name: "Protection",
            value: 5
        }];
        const skillId = '123';
        expect(await SkillsService.addStats(newStatsArr, skillId)).toEqual(expect.arrayContaining([expect.objectContaining({
            upValue: newStatsArr[0].value,
            skillId
        })]));
    });
    it('should remove stats', async () => {
        const newStatsArr = [{
            name: "Protection"
        }];
        const skillId = '123';
        expect(await SkillsService.removeStats(newStatsArr, skillId)).toEqual(expect.arrayContaining([expect.objectContaining({
            skillId
        })]));
    });
    it('should remove characteristics', async () => {
        const newCharacteristicsArr = [{
            name: "Protection"
        }];
        const skillId = '123';
        expect(await SkillsService.removeCharacteristics(newCharacteristicsArr, skillId)).toEqual(expect.arrayContaining([expect.objectContaining({
            skillId
        })]));
    });
});
const GeneratorDto = require('../generators/generate-dto');
const AmmunitionService = require('./ammunition.service');

const mockGDto = new GeneratorDto('amm');
const mockAmms = [
    mockGDto.generateAmmunitionDto('a'),
    mockGDto.generateAmmunitionDto('a'),
    mockGDto.generateAmmunitionDto('a')
]

jest.mock('../ammunition-on-user/ammunition-on-user.service', () => {
    return {
        getByUserId: jest.fn().mockImplementation((userId) => {
            return [];
        }),
        deleteByAmmunitionId: jest.fn().mockImplementation((ammunitionId) => {
            return ammunitionId;
        }),
    }
});

jest.mock('../file-upload/file-upload.service', () => {
    return {
        deleteFile: jest.fn().mockImplementation((picPath) => {
            return picPath;
        }),
        uploadFile: jest.fn().mockImplementation((file, picPath) => {
            return picPath;
        }),
    }
});

jest.mock('../stats/stats.service', () => {
    return {
        getOneByName: jest.fn().mockImplementation((name) => {
            return {name, id: '123'};
        }),
    }
});

jest.mock('path', () => {
    return {
        resolve: jest.fn().mockImplementation(() => {
            return 'path';
        }),
    }
});

jest.mock('../skills/skills.service', () => {
    return {
        getOneByName: jest.fn().mockImplementation((name) => {
            return {name, id: '123'};
        }),
    }
});

jest.mock('../characteristics-type/characteristics-type.service', () => {
    return {
        getOneByName: jest.fn().mockImplementation((name) => {
            return {name, id: '123'};
        }),
    }
});

jest.mock('../ammunition-on-skills/ammunition-on-skills.service', () => {
    return {
        deleteByAmmunitionId: jest.fn().mockImplementation((ammunitionId) => {
            return ammunitionId;
        }),
        getOneByAmmunitionIdAndSkillId: jest.fn().mockImplementation((ammunitionId, skillId) => {
            return {
                ammunitionId,
                skillId
            };
        }),
        create: jest.fn().mockImplementation((dto) => {
            return dto;
        }),
        delete: jest.fn().mockImplementation((ammunitionId, skillId) => {
            return {
                ammunitionId,
                skillId
            };
        }),
    }
});

jest.mock('../ammunition-on-stats/ammunition-on-stats.service', () => {
    return {
        deleteByAmmunitionId: jest.fn().mockImplementation((ammunitionId) => {
            return ammunitionId;
        }),
        getOneByAmmunitionIdAndStatId: jest.fn().mockImplementation((ammunitionId, statId) => {
            return {
                ammunitionId,
                statId
            };
        }),
        update: jest.fn().mockImplementation((dto, ammunitionId, statId) => {
            return {
                ...dto,
                ammunitionId,
                statId
            };
        }),
        create: jest.fn().mockImplementation((dto) => {
            return dto;
        }),
        delete: jest.fn().mockImplementation((ammunitionId, statId) => {
            return {
                ammunitionId,
                statId
            };
        }),
    }
});

jest.mock('../ammunition-on-characteristics/ammunition-on-characteristics.service', () => {
    return {
        deleteByAmmunitionId: jest.fn().mockImplementation((ammunitionId) => {
            return ammunitionId;
        }),
        getOneByCharacteristicTypeIdAndAmmunitionId: jest.fn().mockImplementation((characteristicTypeId, ammunitionId) => {
            return {
                characteristicTypeId,
                ammunitionId
            };
        }),
        update: jest.fn().mockImplementation((dto, characteristicTypeId, ammunitionId) => {
            return {
                ...dto,
                characteristicTypeId,
                ammunitionId
            };
        }),
        create: jest.fn().mockImplementation((dto) => {
            return dto;
        }),
        delete: jest.fn().mockImplementation((characteristicTypeId, ammunitionId) => {
            return {
                characteristicTypeId,
                ammunitionId
            };
        }),
    }
});

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        ammunition: {
            findFirst: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateAmmunitionDto('amm'),
                    ...dto.where
                };
            }),
            findMany: jest.fn().mockImplementation((dto) => {
                return mockAmms;
            }),
            findUnique: jest.fn().mockImplementation((dto) => {
                return null;
            }),
            create: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateAmmunitionDto('amm'),
                    ...dto.data
                };
            }),
            delete: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateAmmunitionDto('amm'),
                    ...dto.where,
                    ...dto.data,
                };
            }),
            update: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateAmmunitionDto('amm'),
                    ...dto.where,
                    ...dto.data
                };
            }),
        }
    }
});

describe('ammunition service', () => {
    it('should be defined', () => {
        expect(AmmunitionService).toBeDefined();
    });
    it('should return an ammunition by id', async () => {
        const id = '123';
        expect(await AmmunitionService.getOneById(id, {})).toMatchObject({
            id
        });
    });
    it('should return ammunitions by userId', async () => {
        const userId = '123';
        expect(await AmmunitionService.getByUserId(userId)).toEqual(expect.any(Array));
    });
    it('should return all the ammunition', async () => {
        expect(await AmmunitionService.getAll()).toEqual(expect.any(Array));
    });
    it('should return ammunitions by ammunition type id', async () => {
        const ammunitionTypeId = '123';
        expect(await AmmunitionService.getByAmmunitionTypeId(ammunitionTypeId)).toEqual(expect.any(Array));
    });
    it('should return an ammunition by name', async () => {
        const name = '123';
        expect(await AmmunitionService.getOneByName(name)).toMatchObject({
            name
        });
    });
    it('should generate an ammunition id', async () => {
        expect(await AmmunitionService.generateAmmunitionId()).toEqual(expect.any(String));
    });
    it('should create an ammunition', async () => {
        const dto = mockGDto.generateAmmunitionDto('a');
        expect(await AmmunitionService.create(dto)).toMatchObject({
            ...dto
        });
    });
    it('should delete the ammunition', async () => {
        const dto = mockGDto.generateAmmunitionDto('a');
        expect(await AmmunitionService.delete(dto)).toMatchObject({
            id: dto.id
        });
    });
    it('should delete the ammunition', async () => {
        const dto = mockGDto.generateAmmunitionDto('a');
        expect(await AmmunitionService.deleteAmmunition(dto));
    });
    it('should upload the ammunition picture', async () => {
        const dto = mockGDto.generateAmmunitionDto('a');
        expect(await AmmunitionService.uploadFile({}, dto)).toEqual(expect.any(String));
    });
    it('should update the ammunition', async () => {
        const ammunition = mockGDto.generateAmmunitionDto('a');
        const dto = {
            name: 'nameamm'
        }
        expect(await AmmunitionService.updateAmmunition(dto, ammunition, {})).toMatchObject({
            ...dto
        });
    });
    it('should add the characteristics to the ammuniiton', async () => {
        const ammunition = mockGDto.generateAmmunitionDto('a');
        const dto = [{
            name: 'Strength',
            upValue: 10
        }];
        expect(await AmmunitionService.addCharacteristics(dto, ammunition.id)).toEqual(expect.any(Array));
    });
    it('should add the stats to the ammuniiton', async () => {
        const ammunition = mockGDto.generateAmmunitionDto('a');
        const dto = [{
            name: 'Protection',
            upValue: 10
        }];
        expect(await AmmunitionService.addStats(dto, ammunition.id)).toEqual(expect.any(Array));
    });
    it('should add the skills to the ammuniiton', async () => {
        const ammunition = mockGDto.generateAmmunitionDto('a');
        const dto = [{
            name: 'Strongman'
        }];
        expect(await AmmunitionService.addSkills(dto, ammunition.id)).toEqual(expect.any(Array));
    });
    it('should remove the skills from the ammuniiton', async () => {
        const ammunition = mockGDto.generateAmmunitionDto('a');
        const dto = [{
            name: 'Strongman'
        }];
        expect(await AmmunitionService.removeSkills(dto, ammunition.id)).toEqual(expect.any(Array));
    });
    it('should remove the stats from the ammuniiton', async () => {
        const ammunition = mockGDto.generateAmmunitionDto('a');
        const dto = [{
            name: 'Protection',
            upValue: 10
        }];
        expect(await AmmunitionService.removeStats(dto, ammunition.id)).toEqual(expect.any(Array));
    });
    it('should remove the characteristics from the ammuniiton', async () => {
        const ammunition = mockGDto.generateAmmunitionDto('a');
        const dto = [{
            name: 'Strength',
            upValue: 10
        }];
        expect(await AmmunitionService.removeCharacteristics(dto, ammunition.id)).toEqual(expect.any(Array));
    });
});
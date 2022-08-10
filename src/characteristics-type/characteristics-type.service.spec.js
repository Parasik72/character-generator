const GeneratorDto = require('../generators/generate-dto');
const CharacteristicsTypeService = require('./characteristics-type.service');

const mockGDto = new GeneratorDto('chartype');
const mockCharTypes = [
    mockGDto.generateCharacteristicTypeDto('a'),
    mockGDto.generateCharacteristicTypeDto('a'),
    mockGDto.generateCharacteristicTypeDto('a')
]

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        characteristicType: {
            findMany: jest.fn().mockImplementation((select) => {
                return mockCharTypes
            }),
            findUnique: jest.fn().mockImplementation((dto) => {
                if(dto.where.id.length === 36)
                    return null;
                return {
                    ...mockGDto.generateCharacteristicTypeDto('a'),
                    ...dto.where
                }
            }),
            findFirst: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateCharacteristicTypeDto('a'),
                    ...dto.where
                }
            }),
            create: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateCharacteristicTypeDto('a'),
                    ...dto.data
                }
            }),
            update: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateCharacteristicTypeDto('a'),
                    ...dto.data,
                    ...dto.where
                }
            }),
            delete: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateCharacteristicTypeDto('a'),
                    ...dto.where
                }
            }),
        }
    }
});

jest.mock('../characteristics/characteristics.service', () => {
    return {
        deleteByCharacteristicTypeId: jest.fn().mockImplementation((characteristicTypeId) => {
            return [{characteristicTypeId}]
        })
    }
});

jest.mock('../skill-on-characteristics/skill-on-characteristics.service', () => {
    return {
        deleteByCharacteristicTypeId: jest.fn().mockImplementation((characteristicTypeId) => {
            return [{characteristicTypeId}]
        })
    }
});

jest.mock('../ammunition-on-characteristics/ammunition-on-characteristics.service', () => {
    return {
        deleteByCharacteristicTypeId: jest.fn().mockImplementation((characteristicTypeId) => {
            return [{characteristicTypeId}]
        })
    }
});

jest.mock('../stats/stats.service', () => {
    return {
        getOneByName: jest.fn().mockImplementation((name) => {
            return [{id: '123', name}]
        })
    }
});

jest.mock('../characteristic-type-on-stat/characteristic-type-on-stat.service', () => {
    return {
        deleteByCharacteristicTypeId: jest.fn().mockImplementation((characteristicTypeId) => {
            return [{characteristicTypeId}]
        }),
        getOneByCharacteristicTypeIdAndStatId: jest.fn().mockImplementation((characteristicTypeId, statId) => {
            return {
                characteristicTypeId,
                statId,
                eachDivider: 2,
                eachUp: 1
            }
        }),
        update: jest.fn().mockImplementation((dto, characteristicTypeId, statId) => {
            return {
                ...dto,
                characteristicTypeId,
                statId
            }
        }),
        create: jest.fn().mockImplementation((dto) => {
            return dto
        }),
        delete: jest.fn().mockImplementation((characteristicTypeId, statId) => {
            return {
                characteristicTypeId,
                statId,
                eachDivider: 2,
                eachUp: 1
            }
        }),
    }
});

describe('characteristics-type service', () => {
    it('should be defined', () => {
        expect(CharacteristicsTypeService).toBeDefined();
    });
    it('should return all the logs', async () => {
        expect(await CharacteristicsTypeService.getAll({})).toEqual(expect.any(Array))
    });
    it('should return one by id', async () => {
        const id ='456'
        expect(await CharacteristicsTypeService.getOneById(id)).toMatchObject({
            id
        });
    });
    it('should return one by name', async () => {
        const name ='aaa'
        expect(await CharacteristicsTypeService.getOneByName(name)).toMatchObject({
            name
        });
    });
    it('should return generate a characteristic type id', async () => {
        expect(await CharacteristicsTypeService.generateCharacteristicTypeId()).toEqual(expect.any(String));
    });
    it('should create', async () => {
        const dto = {
            id: '123',
            name: 'asd'
        } 
        expect(await CharacteristicsTypeService.create(dto)).toMatchObject({
            ...dto
        });
    });
    it('should update', async () => {
        const dto = {
            id: '123',
            name: 'asd'
        } 
        expect(await CharacteristicsTypeService.update(dto, dto.id)).toMatchObject({
            ...dto
        });
    });
    it('should delete', async () => {
        const id ='456'
        expect(await CharacteristicsTypeService.delete(id)).toMatchObject({
            id
        });
    });
    it('should add stats', async () => {
        const newStatsArr = [{
            id: '123',
            name: 'Protection',
            eachDivider: 2,
            eachUp: 1
        }];
        const characteristicTypeId = '456'
        expect(await CharacteristicsTypeService.addStats(newStatsArr, characteristicTypeId)).toEqual(expect.arrayContaining([expect.objectContaining({
            characteristicTypeId
        })]))
    });
    it('should remove stats', async () => {
        const newStatsArr = [{
            id: '123',
            name: 'Protection',
            eachDivider: 2,
            eachUp: 1
        }];
        const characteristicTypeId = '456'
        expect(await CharacteristicsTypeService.removeStats(newStatsArr, characteristicTypeId)).toEqual(expect.arrayContaining([expect.objectContaining({
            characteristicTypeId
        })]))
    });
});
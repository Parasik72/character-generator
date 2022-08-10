const GeneratorDto = require('../generators/generate-dto');
const AmmunitionTypeService = require('./ammunition-type.service');

const mockGDto = new GeneratorDto('ammtype');
const mockAmmTypes = [
    mockGDto.generateAmmunitionTypeDto('t'),
    mockGDto.generateAmmunitionTypeDto('t'),
    mockGDto.generateAmmunitionTypeDto('t')
]

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        ammunitionType: {
            findMany: jest.fn().mockImplementation(() => {
                return mockAmmTypes
            }),
            findUnique: jest.fn().mockImplementation((dto) => {
                if(dto.where.id.length === 36)
                    return null;
                return {
                    ...mockGDto.generateAmmunitionTypeDto(''),
                    ...dto.where
                }
            }),
            findFirst: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateAmmunitionTypeDto(''),
                    ...dto.where
                }
            }),
            create: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateAmmunitionTypeDto(''),
                    ...dto.data
                }
            }),
            update: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateAmmunitionTypeDto(''),
                    ...dto.data,
                    ...dto.where
                }
            }),
            delete: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateAmmunitionTypeDto(''),
                    ...dto.where
                }
            }),
        }
    }
});

jest.mock('../ammunition/ammunition.service', () => {
    return {
        getByAmmunitionTypeId: jest.fn().mockImplementation((ammunitionTypeId) => {
            return [];
        }),
        deleteAmmunition: jest.fn().mockImplementation((ammunition) => {
            return ammunition;
        }),
    }
});

describe('ammunition-type service', () => {
    it('should be defined', () => {
        expect(AmmunitionTypeService).toBeDefined();
    });
    it('should return all the ammunition types', async () => {
        expect(await AmmunitionTypeService.getAll()).toEqual(expect.any(Array))
    });
    it('should return one by id', async () => {
        const id = '123';
        expect(await AmmunitionTypeService.getOneById(id)).toMatchObject({
            id
        });
    });
    it('should return one by type', async () => {
        const type = 't';
        expect(await AmmunitionTypeService.getOneByType(type)).toMatchObject({
            type
        });
    });
    it('should create', async () => {
        const type = 't';
        expect(await AmmunitionTypeService.create({type})).toMatchObject({
            type
        });
    });
    it('should generate an ammunition type id', async () => {
        expect(await AmmunitionTypeService.generateAmmunitionTypeId()).toEqual(expect.any(String));
    });
    it('should update', async () => {
        const type = 't';
        const id = '123';
        expect(await AmmunitionTypeService.update({type}, id)).toMatchObject({
            type,
            id
        });
    });
    it('should delete', async () => {
        const id = '123';
        expect(await AmmunitionTypeService.delete(id)).toMatchObject({
            id
        });
    });
});
const GeneratorDto = require('../generators/generate-dto');
const AmmunitionTypeController = require('./ammunition-type.controller');
const {mockRequest, mockResponse} = require('../interceptors/interceptor');

const mockGDto = new GeneratorDto('ammtype');
const mockAmmTypes = [
    mockGDto.generateAmmunitionTypeDto('t'),
    mockGDto.generateAmmunitionTypeDto('t'),
    mockGDto.generateAmmunitionTypeDto('t')
]

jest.mock('./ammunition-type.service', () => {
    return {
        getAll: jest.fn().mockImplementation(() => {
            return mockAmmTypes;
        }),
        getOneByType: jest.fn().mockImplementation((type) => {
            return null;
        }),
        generateAmmunitionTypeId: jest.fn().mockImplementation(() => {
            return '123';
        }),
        create: jest.fn().mockImplementation((dto) => {
            return {
                ...mockGDto.generateAmmunitionTypeDto('t'),
                ...dto
            }
        }),
        getOneById: jest.fn().mockImplementation((id) => {
            return {
                ...mockGDto.generateAmmunitionTypeDto('t'),
                id
            }
        }),
        update: jest.fn().mockImplementation((dto, id) => {
            return {
                ...mockGDto.generateAmmunitionTypeDto('t'),
                ...dto,
                id
            }
        }),
        delete: jest.fn().mockImplementation((dto) => {
            return {
                ...mockGDto.generateAmmunitionTypeDto('t'),
                ...dto
            }
        }),
    }
});

jest.mock('../logs/logs.service', () => {
    return {
        create: jest.fn().mockImplementation(req => {
            return null
        })
    }
});

describe('ammunition-type controller', () => {
    it('should be defined', () => {
        expect(AmmunitionTypeController).toBeDefined();
    });
    it('should return all the ammunition types', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        let res = mockResponse();
        await AmmunitionTypeController.getAll(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
    it('should create', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const dto = mockGDto.generateAmmunitionTypeDto('tt')
        req.body = dto;
        let res = mockResponse();
        await AmmunitionTypeController.create(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            type: dto.type
        }));
    });
    it('should update', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const dto = mockGDto.generateAmmunitionTypeDto('tt')
        req.body = dto;
        const params = {
            ammunitionTypeId: '456'
        };
        req.params = params;
        let res = mockResponse();
        await AmmunitionTypeController.update(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            type: dto.type,
            id: params.ammunitionTypeId
        }));
    });
    it('should delete', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const params = {
            ammunitionTypeId: '456'
        };
        req.params = params;
        let res = mockResponse();
        await AmmunitionTypeController.delete(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }));
    });
});
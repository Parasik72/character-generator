const GeneratorDto = require('../generators/generate-dto');
const CharacteristicsTypeController = require('./characteristics-type.controller');
const {mockRequest, mockResponse} = require('../interceptors/interceptor');

const mockGDto = new GeneratorDto('chartype');
const mockCharTypes = [
    mockGDto.generateCharacteristicTypeDto('a'),
    mockGDto.generateCharacteristicTypeDto('a'),
    mockGDto.generateCharacteristicTypeDto('a')
];

jest.mock('./characteristics-type.service', () => {
    return {
        getAll: jest.fn().mockImplementation((select) => {
            return mockCharTypes;
        }),
        getOneByName: jest.fn().mockImplementation((name) => {
            return null;
        }),
        getOneById: jest.fn().mockImplementation((id) => {
            return {
                ...mockGDto.generateCharacteristicTypeDto(''),
                id
            };
        }),
        generateCharacteristicTypeId: jest.fn().mockImplementation(() => {
            return '123';
        }),
        create: jest.fn().mockImplementation((dto) => {
            return {
                ...mockGDto.generateCharacteristicTypeDto(),
                ...dto
            };
        }),
        update: jest.fn().mockImplementation((dto, id) => {
            return {
                ...mockGDto.generateCharacteristicTypeDto(),
                ...dto,
                id
            };
        }),
        delete: jest.fn().mockImplementation((id) => {
            return {
                ...mockGDto.generateCharacteristicTypeDto(),
                id
            };
        }),
        addStats: jest.fn().mockImplementation((dto, id) => {
            return [{...dto[0], id}];
        }),
        removeStats: jest.fn().mockImplementation((dto, id) => {
            return [{...dto[0], id}];
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

describe('logs controller', () => {
    it('should be defined', () => {
        expect(CharacteristicsTypeController).toBeDefined();
    });
    it('should return all the characteristic types', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        let res = mockResponse();
        await CharacteristicsTypeController.getAll(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
    it('should create', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const dto = {name: 'asd'}
        req.body = dto;
        let res = mockResponse();
        await CharacteristicsTypeController.create(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            ...dto
        }));
    });
    it('should update', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const dto = {name: 'asd'}
        req.body = dto;
        const params = {characteristicTypeId: '456'}
        req.params = params;
        let res = mockResponse();
        await CharacteristicsTypeController.update(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            ...dto,
            id: params.characteristicTypeId
        }));
    });
    it('should delete', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const params = {characteristicTypeId: '456'}
        req.params = params;
        let res = mockResponse();
        await CharacteristicsTypeController.delete(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }));
    });
    it('should add stats', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const params = {characteristicTypeId: '456'}
        req.params = params;
        const dto = [{
            id: '789',
            name: 'asd',
            eachDivider: 2,
            eachUp: 1
        }]
        req.body = dto;
        let res = mockResponse();
        await CharacteristicsTypeController.addStats(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
            ...dto[0],
            id: params.characteristicTypeId
        })]));
    });
    it('should remove stats', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const params = {characteristicTypeId: '456'}
        req.params = params;
        const dto = [{
            id: '789',
            name: 'asd',
            eachDivider: 2,
            eachUp: 1
        }]
        req.body = dto;
        let res = mockResponse();
        await CharacteristicsTypeController.removeStats(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
            ...dto[0],
            id: params.characteristicTypeId
        })]));
    });
});
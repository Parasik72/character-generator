const GeneratorDto = require('../generators/generate-dto');
const AmmunitionController = require('./ammunition.controller');
const {mockRequest, mockResponse} = require('../interceptors/interceptor');

const mockGDto = new GeneratorDto('amm');
const mockAmms = [
    mockGDto.generateAmmunitionDto('a'),
    mockGDto.generateAmmunitionDto('a'),
    mockGDto.generateAmmunitionDto('a'),
]

jest.mock('./ammunition.service', () => {
    return {
        getAll: jest.fn().mockImplementation(() => {
            return mockAmms;
        }),
        uploadFile: jest.fn().mockImplementation((file) => {
            return '/' + file;
        }),
        generateAmmunitionId: jest.fn().mockImplementation(() => {
            return '123';
        }),
        create: jest.fn().mockImplementation((dto) => {
            return {
                ...mockGDto.generateAmmunitionDto('a'),
                ...dto
            };
        }),
        getOneById: jest.fn().mockImplementation((id, select) => {
            return {
                ...mockGDto.generateAmmunitionDto('a'),
                id
            };
        }),
        addCharacteristics: jest.fn().mockImplementation((dto, id) => {
            return dto;
        }),
        addStats: jest.fn().mockImplementation((dto, id) => {
            return dto;
        }),
        addSkills: jest.fn().mockImplementation((dto, id) => {
            return dto;
        }),
        removeSkills: jest.fn().mockImplementation((dto, id) => {
            return dto;
        }),
        removeCharacteristics: jest.fn().mockImplementation((dto, id) => {
            return dto;
        }),
        removeStats: jest.fn().mockImplementation((dto, id) => {
            return dto;
        }),
        updateAmmunition: jest.fn().mockImplementation((dto, ammunition, select) => {
            return {
                ...ammunition,
                ...dto
            };
        }),
        getOneByName: jest.fn().mockImplementation((name) => {
            return mockGDto.generateAmmunitionDto(name);
        }),
        deleteAmmunition: jest.fn().mockImplementation((ammunition) => {
            return ammunition;
        }),
        deleteFile: jest.fn().mockImplementation((ammunition) => {
            return 'path';
        })
    }
});

jest.mock('../ammunition-type/ammunition-type.service', () => {
    return {
        getOneByType: jest.fn().mockImplementation((type) => {
            return {type, id: '123'}
        })
    }
});

jest.mock('../logs/logs.service', () => {
    return {
        create: jest.fn().mockImplementation(req => {
            return null
        })
    }
});

describe('ammunition controller', () => {
    it('should be defined', () => {
        expect(AmmunitionController).toBeDefined();
    });
    it('should return all the ammunition', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        let res = mockResponse();
        await AmmunitionController.getAll(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
    it('should create an ammunition', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        req.files = {
            picture: 'pic'
        }
        const dto = mockGDto.generateAmmunitionDto('na');
        req.body = dto;
        let res = mockResponse();
        await AmmunitionController.create(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            name: dto.name
        }));
    });
    it('should add the characteristics to the ammunition', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const dto = [{
            name: 'Strength',
            upValue: 10
        }];
        req.body = dto;
        let res = mockResponse();
        await AmmunitionController.addCharacteristics(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
    it('should add the stats to the ammunition', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const dto = [{
            name: 'Protection',
            upValue: 10
        }];
        req.body = dto;
        let res = mockResponse();
        await AmmunitionController.addStats(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
    it('should add the skills to the ammunition', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const dto = [{
            name: 'Strongman'
        }];
        req.body = dto;
        let res = mockResponse();
        await AmmunitionController.addSkills(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
    it('should remove the skills from the ammunition', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const dto = [{
            name: 'Strongman'
        }];
        req.body = dto;
        let res = mockResponse();
        await AmmunitionController.removeSkills(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
    it('should remove the characteristics from the ammunition', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const dto = [{
            name: 'Strength',
            upValue: 10
        }];
        req.body = dto;
        let res = mockResponse();
        await AmmunitionController.removeCharacteristics(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
    it('should remove the stats from the ammunition', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const dto = [{
            name: 'Protection',
            upValue: 10
        }];
        req.body = dto;
        let res = mockResponse();
        await AmmunitionController.removeStats(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
    it('should update the ammunition', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const ammunitionId = '123';
        req.params = {
            ammunitionId
        }
        const dto = [{
            type: 'type'
        }];
        req.body = dto;
        let res = mockResponse();
        await AmmunitionController.update(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: ammunitionId
        }));
    });
    it('should delete the ammunition', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const ammunitionId = '123';
        req.params = {
            ammunitionId
        }
        let res = mockResponse();
        await AmmunitionController.delete(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }));
    });
});
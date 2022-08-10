const GeneratorDto = require('../generators/generate-dto');
const SkillsController = require('./skills.controller');
const {mockRequest, mockResponse} = require('../interceptors/interceptor');

const mockGDto = new GeneratorDto('skills');
const mockSkills = [
    mockGDto.generateSkillDto('aa'),
    mockGDto.generateSkillDto('aa'),
    mockGDto.generateSkillDto('aa')
]

jest.mock('./skills.service', () => {
    return {
        getAll: jest.fn().mockImplementation((select) => {
            return mockSkills;
        }),
        getOneByName: jest.fn().mockImplementation((name) => {
            if(name !== 'Strongman')
                return null;
            return {
                id: '123',
                name
            }
        }),
        getOneById: jest.fn().mockImplementation((id) => {
            return {
                ...mockGDto.generateSkillDto(''),
                id
            }
        }),
        generateSkillId: jest.fn().mockImplementation(() => {
            return '123';
        }),
        create: jest.fn().mockImplementation((dto) => {
            return {
                ...mockGDto.generateSkillDto(''),
                ...dto
            };
        }),
        update: jest.fn().mockImplementation((dto, id) => {
            return {
                ...dto,
                id
            };
        }),
        delete: jest.fn().mockImplementation((id) => {
            return {
                ...mockGDto.generateSkillDto(''),
                id
            };
        }),
        addCharacteristics: jest.fn().mockImplementation((dto, id) => {
            return dto;
        }),
        addStats: jest.fn().mockImplementation((dto, id) => {
            return dto;
        }),
        removeStats: jest.fn().mockImplementation((dto, id) => {
            return dto;
        }),
        removeCharacteristics: jest.fn().mockImplementation((dto, id) => {
            return dto;
        }),
    }
});

jest.mock('../skill-on-users/skill-on-users.service', () => {
    return {
        getOneBySkillIdAndUserId: jest.fn().mockImplementation((skillId, userId) => {
            if(skillId === 'null' || userId === 'null')
                return null;
            return {
                skillId,
                userId
            }
        }),
        create: jest.fn().mockImplementation((skillId, userId) => {
            return {
                id: skillId,
                userId
            }
        }),
        delete: jest.fn().mockImplementation((skillId, userId) => {
            return {
                id: skillId,
                userId
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

describe('skills controller', () => {
    it('should be defined', () => {
        expect(SkillsController).toBeDefined();
    });
    it('should return all the skills', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        let res = mockResponse();
        await SkillsController.getAll(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
    it('should create', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const dto = {
            name: 'null'
        }
        req.body = dto;
        let res = mockResponse();
        await SkillsController.create(req, res);
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
        const dto = {
            name: 'Strongman'
        }
        req.body = dto;
        const params = {skillId: '456'}
        req.params = params;
        let res = mockResponse();
        await SkillsController.update(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: params.skillId
        }));
    });
    it('should delete', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const params = {skillId: '456'}
        req.params = params;
        let res = mockResponse();
        await SkillsController.delete(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }));
    });
    it('should add characteristics', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const params = {skillId: '456'}
        req.params = params;
        const dto = [{
            name: 'Strength',
            value: 5
        }];
        req.body = dto;
        let res = mockResponse();
        await SkillsController.addCharacteristics(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
            ...dto[0]
        })]));
    });
    it('should add stats', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const params = {skillId: '456'}
        req.params = params;
        const dto = [{
            name: 'Protection',
            value: 5
        }];
        req.body = dto;
        let res = mockResponse();
        await SkillsController.addStats(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
            ...dto[0]
        })]));
    });
    it('should remove stats', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const params = {skillId: '456'}
        req.params = params;
        const dto = [{
            name: 'Protection'
        }];
        req.body = dto;
        let res = mockResponse();
        await SkillsController.removeStats(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
            ...dto[0]
        })]));
    });
    it('should remove characteristics', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const params = {skillId: '456'}
        req.params = params;
        const dto = [{
            name: 'Strength'
        }];
        req.body = dto;
        let res = mockResponse();
        await SkillsController.removeCharacteristics(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
            ...dto[0]
        })]));
    });
    it('should add skill to the user', async () => {
        let req = mockRequest();
        const userId = 'null';
        req.user = {
            id: userId,
            email: 'email',
            role: 'role'
        };
        const params = {skillId: '456'}
        req.params = params;
        const dto = {
            name: 'Strongman'
        }
        req.body = dto;
        let res = mockResponse();
        await SkillsController.addSkill(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            userId
        }))
    });
    it('should remove skill from the user', async () => {
        let req = mockRequest();
        const userId = '123';
        req.user = {
            id: userId,
            email: 'email',
            role: 'role'
        };
        const params = {skillId: '456'}
        req.params = params;
        const dto = {
            name: 'Strongman'
        }
        req.body = dto;
        let res = mockResponse();
        await SkillsController.removeSkill(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }))
    });
});
/*
req.user = {
    id: '123',
    email: 'email',
    role: 'role'
};
*/
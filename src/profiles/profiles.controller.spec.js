const GeneratorDto = require('../generators/generate-dto');
const ProfilesController = require('./profiles.controller');
const {mockRequest, mockResponse} = require('../interceptors/interceptor');

const mockGDto = new GeneratorDto('prof');

jest.mock('../users/users.service', () => {
    return {
        getOneById: jest.fn().mockImplementation((id) => {
            return {
                ...mockGDto.generateUserDto(),
                id
            };
        }),
        updateUser: jest.fn().mockImplementation((dto, user, select) => {
            return {
                ...user,
                ...dto
            };
        }),
        uploadAvatar: jest.fn().mockImplementation((user, file) => {
            return 'filepath';
        }),
    }
});

jest.mock('../characteristics/characteristics.service', () => {
    return {
        calculateCharacteristics: jest.fn().mockImplementation((userId) => {
            return [{userId}];
        }),
    }
});

jest.mock('../stats/stats.service', () => {
    return {
        calculateStats: jest.fn().mockImplementation((userId) => {
            return [{userId}];
        }),
    }
});

jest.mock('../ammunition/ammunition.service', () => {
    return {
        getByUserId: jest.fn().mockImplementation((userId) => {
            return {
                ammunitionId: '123',
                userId
            }
        }),
    }
});

jest.mock('../skills/skills.service', () => {
    return {
        getByUserId: jest.fn().mockImplementation((userId) => {
            return {
                skillId: '123',
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

describe('profiles controller', () => {
    it('should be defined', () => {
        expect(ProfilesController).toBeDefined();
    });
    it('should return the user profile', async () => {
        let req = mockRequest();
        const userId = '123';
        req.user = {
            id: userId,
            email: 'email',
            role: 'role'
        };
        let res = mockResponse();
        await ProfilesController.getProfile(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: userId
        }));
    });
    it('should return update the user profile', async () => {
        let req = mockRequest();
        const userId = '123';
        req.user = {
            id: userId,
            email: 'email',
            role: 'role'
        };
        const dto = {
            description: 'descrpt'
        }
        req.body = dto;
        let res = mockResponse();
        await ProfilesController.changeProfile(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            description: dto.description,
            id: userId
        }));
    });
});
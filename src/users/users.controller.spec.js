const GeneratorDto = require('../generators/generate-dto');
const UsersController = require('./users.controller');
const {mockRequest, mockResponse} = require('../interceptors/interceptor');

const gDto = new GeneratorDto('logs');
const mockUsers = [
    gDto.generateUserDto(),
    gDto.generateUserDto(),
    gDto.generateUserDto()
]

jest.mock('./users.service', () => {
    return {
        getAll: jest.fn().mockImplementation(req => {
            return mockUsers
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

describe('users controller', () => {
    it('should be defined', () => {
        expect(UsersController).toBeDefined();
    });
    it('should return all the users', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        let res = mockResponse();
        await UsersController.getAll(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
});
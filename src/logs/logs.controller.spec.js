const GeneratorDto = require('../generators/generate-dto');
const LogsController = require('./logs.controller');
const {mockRequest, mockResponse} = require('../interceptors/interceptor');

const mockGDto = new GeneratorDto('logs');
const mockLogs = [
    mockGDto.generateLogDto('123'),
    mockGDto.generateLogDto('123'),
    mockGDto.generateLogDto('123')
]

jest.mock('./logs.service', () => {
    return {
        getAll: jest.fn().mockImplementation(() => {
            return mockLogs;
        })
    }
});

describe('logs controller', () => {
    it('should be defined', () => {
        expect(LogsController).toBeDefined();
    });
    it('should return all the logs', async () => {
        let req = mockRequest();
        let res = mockResponse();
        await LogsController.getAll(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
});
/*
req.user = {
    id: '123',
    email: 'email',
    role: 'role'
};
*/
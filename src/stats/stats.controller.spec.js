const StatsController = require('./stats.controller');
const {mockRequest, mockResponse} = require('../interceptors/interceptor');

jest.mock('./stats.service.js', () => {
    return {
        getAll: jest.fn().mockImplementation(() => {
            return [{name: 'asd'}];
        }),
        getOneByName: jest.fn().mockImplementation((name) => {
            return null;
        }),
        generateStatId: jest.fn().mockImplementation((name) => {
            return '123';
        }),
        create: jest.fn().mockImplementation((dto) => {
            return dto;
        }),
        getOneById: jest.fn().mockImplementation((id) => {
            return {
                id,
                name: 'ads'
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
                id,
                name: 'ads'
            };
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

describe('stats controller', () => {
    it('should be defined', () => {
        expect(StatsController).toBeDefined();
    });
    it('should return all the stats', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        let res = mockResponse();
        await StatsController.getAll(req, res);
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
            name: 'Protection'
        }
        req.body = dto;
        let res = mockResponse();
        await StatsController.create(req, res);
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
            name: 'Protection'
        }
        req.body = dto;
        const params = {statId: '456'};
        req.params = params;
        let res = mockResponse();
        await StatsController.update(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            ...dto,
            id: params.statId
        }));
    });
    it('should delete', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        const params = {statId: '456'};
        req.params = params;
        let res = mockResponse();
        await StatsController.delete(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }));
    });
});
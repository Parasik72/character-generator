const CharacteristicsController = require('./characteristics.controller');
const {mockRequest, mockResponse} = require('../interceptors/interceptor');

jest.mock('./characteristics.service', () => {
    return {
        getByUserId: jest.fn().mockImplementation((userId, select) => {
            return [{id: '123', userId, value: 5, characteristicTypeId: '456'}];
        }),
        updateCharacteristic: jest.fn().mockImplementation((characteristics, dto) => {
            return [{
                ...characteristics[0],
                name: dto[0].name,
                value: dto[0].value
            }];
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

describe('characteristics controller', () => {
    it('should be defined', () => {
        expect(CharacteristicsController).toBeDefined();
    });
    it('should return all the logs', async () => {
        const characteristics = [{
            name: "Strength",
            value: 10
        }];
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        req.body = characteristics;
        let res = mockResponse();
        await CharacteristicsController.update(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
            ...characteristics[0]
        })]));
    });
});
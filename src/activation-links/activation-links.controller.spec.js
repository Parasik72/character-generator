const GeneratorDto = require('../generators/generate-dto');
const ActivationLinksController = require('./activation-links.controller');
const {mockRequest, mockResponse} = require('../interceptors/interceptor');

const mockGDto = new GeneratorDto('actlink');

jest.mock('../users/users.service', () => {
    return {
        getOneById: jest.fn().mockImplementation((id) => {
            return {
                ...mockGDto.generateUserDto(),
                id
            }
        }),
        updateUser: jest.fn().mockImplementation((dto, user) => {
            return {
                ...user,
                ...dto
            }
        }),
    }
});

jest.mock('../sms-transporter/sms-transporter', () => {
    return {
        messages: {
            create: jest.fn().mockImplementation((dto) => {
                return dto;
            })
        }
    }
});

jest.mock('../characteristics/characteristics.service', () => {
    return {
        addCharacteristicsForNewUser: jest.fn().mockImplementation((userId, types) => {
            return {
                userId,
                ...types
            }
        }),
    }
});

jest.mock('../activation-links/activation-links.service', () => {
    return {
        getOneByUserIdAndLink: jest.fn().mockImplementation((userId, link) => {
            return mockGDto.generateActivationLinkDto(userId, link, 1234);
        }),
        getOneByUserId: jest.fn().mockImplementation((userId) => {
            return {
                ...mockGDto.generateActivationLinkDto(userId, 'link', 1234),
                isActivated: true
            };
        }),
        generatePhoneCode: jest.fn().mockImplementation(() => {
            return 1234;
        }),
        updateActivationLink: jest.fn().mockImplementation((dto, activationLink) => {
            return {
                ...activationLink,
                ...dto
            };
        }),
        createActivationRegLinkUrl: jest.fn().mockImplementation((userId, link) => {
            return userId + link;
        }),
        generatePhoneCode: jest.fn().mockImplementation(() => {
            return 1234;
        })
    }
});

jest.mock('../tokens/tokens.service', () => {
    return {
        generateToken: jest.fn().mockImplementation((user) => {
            return mockGDto.generateTokenDto(user.id, 'access')
        }),
        saveToken: jest.fn().mockImplementation((userId, token) => {
            return mockGDto.generateTokenDto(userId, token);
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

jest.mock('../characteristics-type/characteristics-type.service', () => {
    return {
        getAll: jest.fn().mockImplementation(req => {
            return []
        })
    }
});

describe('activation-links controller', () => {
    it('should be defined', () => {
        expect(ActivationLinksController).toBeDefined();
    });
    it('should verificate a phone', async () => {
        let req = mockRequest();
        req.params = {
            userId: '123',
            link: 'link'
        }
        let res = mockResponse();
        await ActivationLinksController.phoneVerification(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            link: expect.any(String)
        }));
    });
    it('should accept registration', async () => {
        let req = mockRequest();
        req.params = {
            userId: '123',
            link: 'link'
        }
        req.body = {
            phoneCode: 1234
        }
        let res = mockResponse();
        await ActivationLinksController.activationReg(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }));
    });
    it('should accept login', async () => {
        let req = mockRequest();
        req.params = {
            userId: '123'
        }
        req.body = {
            phoneCode: 1234
        }
        let res = mockResponse();
        await ActivationLinksController.activationLog(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            token: expect.any(Object)
        }));
    });
});
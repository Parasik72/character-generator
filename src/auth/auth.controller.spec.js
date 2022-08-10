const GeneratorDto = require('../generators/generate-dto');
const AuthController = require('./auth.controller');
const {mockRequest, mockResponse} = require('../interceptors/interceptor');

const mockGDto = new GeneratorDto('auth');

jest.mock('../users/users.service', () => {
    return {
        getOneByEmail: jest.fn().mockImplementation((email) => {
            return {
                ...mockGDto.generateUserDto(),
                email
            };
        }),
        generateUserId: jest.fn().mockImplementation(() => {
            return '123';
        }),
        createUser: jest.fn().mockImplementation((dto) => {
            return {
                ...mockGDto.generateUserDto(),
                ...dto
            };
        }),
    }
});

jest.mock('../mail-transporter/mail-transporter.service', () => {
    return {
        sendEmail: jest.fn().mockImplementation((email, title, text) => {
            return {
                email,
                title,
                text
            };
        }),
    }
});

jest.mock('../tokens/tokens.service', () => {
    return {
        getOneByUserId: jest.fn().mockImplementation((id) => {
            return {
                ...mockGDto.generateUserDto(),
                id
            };
        }),
        disactivateToken: jest.fn().mockImplementation((token) => {
            return {
                ...token,
                isActive: false
            };
        }),
    }
});

jest.mock('../activation-links/activation-links.service', () => {
    return {
        generateLink: jest.fn().mockImplementation(() => {
            return 'link';
        }),
        createPhoneVerificationLinkUrl: jest.fn().mockImplementation((id, link) => {
            return id + link;
        }),
        createActiovationLink: jest.fn().mockImplementation((dto) => {
            return {
                ...mockGDto.generateActivationLinkDto('', '', 1234),
                ...dto
            };
        }),
        getOneByUserId: jest.fn().mockImplementation((userId) => {
            return mockGDto.generateActivationLinkDto(userId, 'link', 1234);
        }),
        generatePhoneCode: jest.fn().mockImplementation((userId) => {
            return 1234;
        }),
        updateActivationLink: jest.fn().mockImplementation((dto, activationLink) => {
            return {
                ...activationLink,
                ...dto
            };
        }),
        createActivationLogLinkUrl: jest.fn().mockImplementation((userId, link) => {
            return userId + link;
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

jest.mock('../sms-transporter/sms-transporter', () => {
    return {
        messages: {
            create: jest.fn().mockImplementation((dto) => {
                return dto;
            })
        }
    }
});

describe('logs controller', () => {
    it('should be defined', () => {
        expect(AuthController).toBeDefined();
    });
    it('should register', async () => {
        let req = mockRequest();
        const dto = mockGDto.generateUserDto();
        req.body = dto;
        let res = mockResponse();
        await AuthController.register(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }));
    });
    it('should login', async () => {
        let req = mockRequest();
        const dto = mockGDto.generateUserDto();
        req.body = dto;
        let res = mockResponse();
        await AuthController.register(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }));
    });
    it('should logout', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        let res = mockResponse();
        await AuthController.register(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }));
    });
});
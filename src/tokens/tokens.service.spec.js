const GeneratorDto = require('../generators/generate-dto');
const TokensService = require('./tokens.service');

const mockGDto = new GeneratorDto('tokens');

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        token: {
            findFirst: jest.fn().mockImplementation((dto) => {
                return mockGDto.generateTokenDto(dto.where.userId, 'access');
            }),
            create: jest.fn().mockImplementation((dto) => {
                return mockGDto.generateTokenDto(dto.data.userId, dto.data.accessToken);
            }),
            update: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateTokenDto('', ''),
                    ...dto.data,
                    ...dto.where
                }
            }),
        }
    }
});

jest.mock('../roles/roles.service', () => {
    return {
        getRoleById: jest.fn().mockImplementation((id) => {
            return {
                ...mockGDto.generateRoleDto('USER'),
                id
            };
        }),
    }
});

describe('tokens service', () => {
    it('should be defined', () => {
        expect(TokensService).toBeDefined();
    });
    it('should generate a token', async () => {
        const user = mockGDto.generateUserDto();
        expect(await TokensService.generateToken(user)).toEqual(expect.any(String));
    });
    it('should save the token', async () => {
        const user = mockGDto.generateUserDto();
        expect(await TokensService.saveToken(user.id, 'access')).toMatchObject({
            userId: user.id
        });
    });
    it('should disactivate the token', async () => {
        const token = mockGDto.generateTokenDto('123', 'access');
        expect(await TokensService.disactivateToken(token)).toMatchObject({
            isActive: false
        });
    });
    it('should return one by an user id', async () => {
        const user = mockGDto.generateUserDto();
        expect(await TokensService.getOneByUserId(user.id)).toMatchObject({
            userId: user.id
        });
    });
});
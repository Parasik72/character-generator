const GeneratorDto = require('../generators/generate-dto');
const UsersService = require('./users.service');

const gDto = new GeneratorDto('users');
const mockUsers = [
    gDto.generateUserDto('123'),
    gDto.generateUserDto('123'),
    gDto.generateUserDto('123')
]

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        user: {
            create: jest.fn().mockImplementation((dto) => {
                return dto.data
            }),
            findFirst: jest.fn().mockImplementation((dto) => {
                return dto.where
            }),
            findUnique: jest.fn().mockImplementation((dto) => {
                if(dto.where.id.length === 36)
                    return null;
                return dto.where
            }),
            findMany: jest.fn().mockImplementation((dto) => {
                return mockUsers
            }),
            update: jest.fn().mockImplementation((dto) => {
                const user = {
                    id: dto.where.id
                }
                return {
                    ...user,
                    ...dto.data
                }
            }),
        }
    }
});

jest.mock('../roles/roles.service', () => {
    return {
        getRoleByName: jest.fn().mockImplementation((role) => {
            return {
                id: '123',
                name: role
            }
        })
    }
});

describe('users service', () => {
    it('should be defined', () => {
        expect(UsersService).toBeDefined();
    });
    it('should create a user', async () => {
        const dto = gDto.generateUserDto();
        expect(await UsersService.createUser(dto)).toMatchObject({
            id: dto.id
        })
    });
    it('should return a user by email', async () => {
        const email = 'email';
        expect(await UsersService.getOneByEmail(email)).toMatchObject({
            email
        })
    });
    it('should return a user by id', async () => {
        const id = '123';
        expect(await UsersService.getOneById(id, {})).toMatchObject({
            id
        })
    });
    it('should return all the users', async () => {
        expect(await UsersService.getAll({})).toEqual(expect.any(Array))
    });
    it('should update the user', async () => {
        const dto = {
            email: 'email'
        }
        const user = gDto.generateUserDto();
        expect(await UsersService.updateUser(dto, user)).toMatchObject({
            id: user.id,
            email: dto.email
        })
    });
    it('should generate the user id', async () => {
        expect(await UsersService.generateUserId()).toEqual(expect.any(String));
    });
});
const GeneratorDto = require('../generators/generate-dto');
const RolesService = require('./roles.service');
const { RoleTypes } = require('./roles.type');

const mockGDto = new GeneratorDto('roles');
const mockRoles = [
    mockGDto.generateRoleDto(RoleTypes.USER),
    mockGDto.generateRoleDto(RoleTypes.ADMIN)
];

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        user: {
            update: jest.fn().mockImplementation((dto) => {
                const user = {
                    id: dto.where.id
                }
                return {
                    ...user,
                    ...dto.data
                }
            }),
        },
        role: {
            findUnique: jest.fn().mockImplementation((dto) => {
                return null;
            }),
            create: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateRoleDto(dto.data.name),
                    ...dto
                }
            }),
            findFirst: jest.fn().mockImplementation((dto) => {
                if(dto.where.name === 'null')
                    return null;
                return {
                    ...mockGDto.generateRoleDto(dto.where.name),
                    id: dto.where.id ? dto.where.id : 'ididid'
                }
            }),
            delete: jest.fn().mockImplementation((dto) => {
                return dto.data
            }),
            findMany: jest.fn().mockImplementation((dto) => {
                return mockRoles
            })
        }
    }
});

describe('roles service', () => {
    it('should be defined', () => {
        expect(RolesService).toBeDefined();
    });
    it('should create a role', async () => {
        const dto = mockGDto.generateRoleDto(RoleTypes.ADMIN);
        expect(await RolesService.createRole(dto)).toMatchObject({
            data: {
                ...dto
            }
        })
    });
    it('should return all the roles', async () => {
        expect(await RolesService.getAll()).toEqual(expect.any(Array));
    });
    it('should return the role by name', async () => {
        const name = RoleTypes.ADMIN;
        expect(await RolesService.getRoleByName(name)).toMatchObject({
            name
        })
    });
    it('should return the role by id', async () => {
        const id = '123';
        expect(await RolesService.getRoleById(id)).toMatchObject({
            id
        })
    });
    it('should delete role by name', async () => {
        const name = RoleTypes.ADMIN;
        expect(await RolesService.deleteRoleByName(name)).toEqual(name);
    });
    it('should set the role to the user', async () => {
        const role = mockGDto.generateRoleDto(RoleTypes.ADMIN);
        const user = mockGDto.generateUserDto();
        expect(await RolesService.setRoleToUser(role, user)).toMatchObject({
            roleId: role.id,
            id: user.id
        })
    });
    it('should return the role id', async () => {
        expect(await RolesService.generateRoleId()).toEqual(expect.any(String));
    });
});
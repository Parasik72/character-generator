const GeneratorDto = require('../generators/generate-dto');
const RolesController = require('./roles.controller');
const {mockRequest, mockResponse} = require('../interceptors/interceptor');
const { RoleTypes } = require('./roles.type');

const mockGDto = new GeneratorDto('roles');
const mockRoles = [
    mockGDto.generateRoleDto(RoleTypes.USER),
    mockGDto.generateRoleDto(RoleTypes.ADMIN)
];

jest.mock('./roles.service', () => {
    return {
        getRoleByName: jest.fn().mockImplementation((name) => {
            return null;
        }),
        generateRoleId: jest.fn().mockImplementation(() => {
            return '123';
        }),
        createRole: jest.fn().mockImplementation((dto) => {
            return dto;
        }),
        deleteRoleByName: jest.fn().mockImplementation((name) => {
            return name;
        }),
        getAll: jest.fn().mockImplementation((req) => {
            return mockRoles;
        }),
        deleteRoleByName: jest.fn().mockImplementation((name) => {
            return name
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

describe('roles controller', () => {
    it('should be defined', () => {
        expect(RolesController).toBeDefined();
    });
    it('should create a role', async () => {
        const dto = mockGDto.generateRoleDto(RoleTypes.USER);
        let req = mockRequest();
        req.body = dto;
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        let res = mockResponse();
        await RolesController.create(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            name: dto.name
        }));
    });
    it('should return all the roles', async () => {
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        let res = mockResponse();
        await RolesController.getAll(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
    it('should delete the role', async () => {
        const name = RoleTypes.USER;
        let req = mockRequest();
        req.user = {
            id: '123',
            email: 'email',
            role: 'role'
        };
        req.params = {
            name
        }
        let res = mockResponse();
        await RolesController.delete(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            roleName: name
        }));
    });
});
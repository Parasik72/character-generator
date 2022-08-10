require('dotenv/config');
const rolesService = require('../roles/roles.service');
const tokensService = require('../tokens/tokens.service');
const usersService = require('../users/users.service');
const GeneratorDto = require('../generators/generate-dto');
const { v4 } = require('uuid');
const { RoleTypes } = require('../roles/roles.type');
const supertest = require('supertest');
const app = require('../app');
const activationLinksService = require('../activation-links/activation-links.service');

describe('auth', () => {
    const testId = v4().split('-')[0];
    const gDto = new GeneratorDto(testId);
    let adminToken;
    let userToken;
    let userUser;
    let adminUser;
    const createUser = async (userDto, role)=> {
        const userRole = await rolesService.getRoleByName(role);
        const userId = await usersService.generateUserId();
        let user = await usersService.createUser({...userDto, id: userId});
        user = await rolesService.setRoleToUser(userRole, user);
        const token = await tokensService.generateToken(user);
        await tokensService.saveToken(user.id, token);
        const activationLink = gDto.generateActivationLinkDto(user.id, v4(), 1234);
        activationLink.isActivated = true;
        await activationLinksService.createActiovationLink(activationLink);
        return [token, user, userRole];
    }
    beforeAll(async () => {
        jest.setTimeout(60000);
        [userToken, userUser] = await createUser(gDto.generateUserDto(), RoleTypes.USER);
        [adminToken, adminUser] = await createUser(gDto.generateUserDto(), RoleTypes.ADMIN);
    });
    describe('create role', () => {
        it('should return a role', async () => {
            const roleName = v4().split('-')[0];;
            const data = gDto.generateRoleDto(roleName);
            await supertest(app)
                .post(`/roles/create`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(data)
                .expect(201);
        });
        it('should return a 400 status code', async () => {
            await supertest(app)
                .post(`/roles/create`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return a 403 status code', async () => {
            const data = gDto.generateRoleDto(RoleTypes.ADMIN);
            await supertest(app)
                .post(`/roles/create`)
                .set("authorization", `Bearer ${userToken}`)
                .send(data)
                .expect(403);
        });
        it('should return a 401 status code', async () => {
            const data = gDto.generateRoleDto(RoleTypes.ADMIN);
            await supertest(app)
                .post(`/roles/create`)
                .send(data)
                .expect(401);
        });
    });
    describe('get all roles', () => {
        it('should return all roles', async () => {
            await supertest(app)
                .get(`/roles/all`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
        });
        it('should return a 403 status code', async () => {
            await supertest(app)
                .get(`/roles/all`)
                .set("authorization", `Bearer ${userToken}`)
                .expect(403);
        });
        it('should return a 401 status code', async () => {
            await supertest(app)
                .get(`/roles/all`)
                .expect(401);
        });
    });
    describe('delete role by value', () => {
        it('should return a deleted role information', async () => {
            const data = gDto.generateRoleDto(RoleTypes.ADMIN);
            const role = await rolesService.createRole(data);
            const {body} = await supertest(app)
                .delete(`/roles/delete/${role.name}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toEqual({
                roleName: role.name
            });
        });
        it('should return a deleted role information', async () => {
            const data = gDto.generateRoleDto(RoleTypes.USER);
            const role = await rolesService.createRole(data);
            const {body} = await supertest(app)
                .delete(`/roles/delete/${role.name}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toEqual({
                roleName: role.name
            });
        });
        it('should return a 400 status code', async () => {
            const data = gDto.generateRoleDto(RoleTypes.ADMIN);
            const role = await rolesService.createRole(data);
            await supertest(app)
                .delete(`/roles/delete/${role.name}aaa`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(404);
        });
        it('should return a 403 status code', async () => {
            const data = gDto.generateRoleDto(RoleTypes.USER);
            const role = await rolesService.createRole(data);
            await supertest(app)
                .delete(`/roles/delete/${role.name}`)
                .set("authorization", `Bearer ${userToken}`)
                .expect(403);
        });
        it('should return a 401 status code', async () => {
            const data = gDto.generateRoleDto(RoleTypes.USER);
            const role = await rolesService.createRole(data);
            await supertest(app)
                .delete(`/roles/delete/${role.name}`)
                .expect(401);
        });
    });
});
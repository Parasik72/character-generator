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
const statsService = require('./stats.service');

describe('stats', () => {
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
    describe('Get all the stats', () => {
        it('should return all the stats', async () => {
            const {body} = await supertest(app)
                .get('/stats')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toEqual(expect.any(Array))
        });
        it('should return 403 status code', async () => {
            await supertest(app)
                .get('/stats')
                .set("authorization", `Bearer ${userToken}`)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            await supertest(app)
                .get('/stats')
                .expect(401);
        });
    });
    describe('Create a stat', () => {
        it('should create a stat', async () => {
            const id = v4().split('-')[0];
            const name = v4().split('-')[0];
            const dto = {
                id,
                name
            }
            const {body} = await supertest(app)
                .post('/stats')
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(201);
            expect(body).toMatchObject({
                name: dto.name
            })
        });
        it('should return 400 status code', async () => {
            await supertest(app)
                .post('/stats')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const id = v4().split('-')[0];
            const name = v4().split('-')[0];
            const dto = {
                id,
                name
            }
            await supertest(app)
                .post('/stats')
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const id = v4().split('-')[0];
            const name = v4().split('-')[0];
            const dto = {
                id,
                name
            }
            await supertest(app)
                .post('/stats')
                .send(dto)
                .expect(401);
        });
    });
    describe('Update the stat', () => {
        it('should update the stat', async () => {
            const id = v4().split('-')[0];
            const name = v4().split('-')[0];
            const statDto = {
                id,
                name
            }
            const stat = await statsService.create(statDto);
            const newName = v4().split('-')[0];
            const dto = {
                name: newName
            }
            const {body} = await supertest(app)
                .patch(`/stats/${stat.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toMatchObject({
                name: dto.name
            })
        });
        it('should return 403 status code', async () => {
            const id = v4().split('-')[0];
            const name = v4().split('-')[0];
            const statDto = {
                id,
                name
            }
            const stat = await statsService.create(statDto);
            const newName = v4().split('-')[0];
            const dto = {
                name: newName
            }
            await supertest(app)
                .patch(`/stats/${stat.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const id = v4().split('-')[0];
            const name = v4().split('-')[0];
            const statDto = {
                id,
                name
            }
            const stat = await statsService.create(statDto);
            const newName = v4().split('-')[0];
            const dto = {
                name: newName
            }
            await supertest(app)
                .patch(`/stats/${stat.id}`)
                .send(dto)
                .expect(401);
        });
    });
    describe('Delete the stat', () => {
        it('should delete the stat', async () => {
            const id = v4().split('-')[0];
            const name = v4().split('-')[0];
            const statDto = {
                id,
                name
            }
            const stat = await statsService.create(statDto);
            const {body} = await supertest(app)
                .delete(`/stats/${stat.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toMatchObject({
                message: expect.any(String)
            })
        });
        it('should return 404 status code', async () => {
            await supertest(app)
                .delete(`/stats/a`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(404);
        });
        it('should return 403 status code', async () => {
            const id = v4().split('-')[0];
            const name = v4().split('-')[0];
            const statDto = {
                id,
                name
            }
            const stat = await statsService.create(statDto);
            await supertest(app)
                .delete(`/stats/${stat.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const id = v4().split('-')[0];
            const name = v4().split('-')[0];
            const statDto = {
                id,
                name
            }
            const stat = await statsService.create(statDto);
            await supertest(app)
                .delete(`/stats/${stat.id}`)
                .expect(401);
        });
    });
});
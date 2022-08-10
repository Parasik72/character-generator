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
const ammunitionTypeService = require('./ammunition-type.service');

describe('ammunition-type', () => {
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
    describe('Get all the ammunition', () => {
        it('should return all the ammunition', async () => {
            const {body} = await supertest(app)
                .get('/ammunition-type')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toEqual(expect.any(Array));
        });
        it('should return 403 status code', async () => {
            await supertest(app)
                .get('/ammunition-type')
                .set("authorization", `Bearer ${userToken}`)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            await supertest(app)
                .get('/ammunition-type')
                .expect(401);
        });
    });
    describe('Create an ammunition type', () => {
        it('should create an ammunition type', async () => {
            const type = v4().split('-')[0];
            const ammtypeDto = gDto.generateAmmunitionTypeDto(type)
            const {body} = await supertest(app)
                .post('/ammunition-type')
                .set("authorization", `Bearer ${adminToken}`)
                .send(ammtypeDto)
                .expect(201);
            expect(body).toMatchObject({
                type
            })
        });
        it('should return 400 status code', async () => {
            await supertest(app)
                .post('/ammunition-type')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const type = v4().split('-')[0];
            const ammtypeDto = gDto.generateAmmunitionTypeDto(type)
            await supertest(app)
                .post('/ammunition-type')
                .set("authorization", `Bearer ${userToken}`)
                .send(ammtypeDto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const type = v4().split('-')[0];
            const ammtypeDto = gDto.generateAmmunitionTypeDto(type)
            await supertest(app)
                .post('/ammunition-type')
                .send(ammtypeDto)
                .expect(401);
        });
    });
    describe('Update the ammunition type', () => {
        it('should update the ammunition type', async () => {
            const type = v4().split('-')[0];
            const ammtypeDto = gDto.generateAmmunitionTypeDto(type);
            const ammunitionType = await ammunitionTypeService.create(ammtypeDto);
            const dto = {
                type
            }
            const {body} = await supertest(app)
                .patch(`/ammunition-type/${ammunitionType.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toMatchObject({
                type
            })
        });
        it('should return 400 status code', async () => {
            const type = '';
            const ammtypeDto = gDto.generateAmmunitionTypeDto(type);
            const ammunitionType = await ammunitionTypeService.create(ammtypeDto);
            const dto = {
                type
            }
            await supertest(app)
                .patch(`/ammunition-type/${ammunitionType.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const type = v4().split('-')[0];
            const ammtypeDto = gDto.generateAmmunitionTypeDto(type);
            const ammunitionType = await ammunitionTypeService.create(ammtypeDto);
            const dto = {
                type
            }
            await supertest(app)
                .patch(`/ammunition-type/${ammunitionType.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const type = v4().split('-')[0];
            const ammtypeDto = gDto.generateAmmunitionTypeDto(type);
            const ammunitionType = await ammunitionTypeService.create(ammtypeDto);
            const dto = {
                type
            }
            await supertest(app)
                .patch(`/ammunition-type/${ammunitionType.id}`)
                .send(dto)
                .expect(401);
        });
    });
    describe('Delete the ammunition type', () => {
        it('should delete the ammunition type', async () => {
            const type = v4().split('-')[0];
            const ammtypeDto = gDto.generateAmmunitionTypeDto(type);
            const ammunitionType = await ammunitionTypeService.create(ammtypeDto);
            const {body} = await supertest(app)
                .delete(`/ammunition-type/${ammunitionType.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toMatchObject({
                message: expect.any(String)
            })
        });
        it('should return 404 status code', async () => {
            await supertest(app)
                .delete(`/ammunition-type/a`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(404);
        });
        it('should return 403 status code', async () => {
            const type = v4().split('-')[0];
            const ammtypeDto = gDto.generateAmmunitionTypeDto(type);
            const ammunitionType = await ammunitionTypeService.create(ammtypeDto);
            await supertest(app)
                .delete(`/ammunition-type/${ammunitionType.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const type = v4().split('-')[0];
            const ammtypeDto = gDto.generateAmmunitionTypeDto(type);
            const ammunitionType = await ammunitionTypeService.create(ammtypeDto);
            await supertest(app)
                .delete(`/ammunition-type/${ammunitionType.id}`)
                .expect(401);
        });
    });
});
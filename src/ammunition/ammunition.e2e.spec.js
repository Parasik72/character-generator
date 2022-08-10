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
const ammunitionService = require('./ammunition.service');
const ammunitionOnUserService = require('../ammunition-on-user/ammunition-on-user.service');

describe('ammunition', () => {
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
    describe('Return all the ammunition', () => {
        it('should return all the ammunition', async () => {
            const {body} = await supertest(app)
                .get('/ammunition/all')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toEqual(expect.any(Array));
        });
        it('should return 401 status code', async () => {
            await supertest(app)
                .get('/ammunition/all')
                .expect(401);
        });
    });
    describe('Create an ammunition', () => {
        it('should create an ammunition', async () => {
            let dto = gDto.generateAmmunitionDto(v4().split('-')[0]);
            dto.type = "Helmet";
            const {body} = await supertest(app)
                .post('/ammunition')
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(201);
            expect(body).toMatchObject({
                name: dto.name
            });
        });
        it('should return 400 status code', async () => {
            await supertest(app)
                .post('/ammunition')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            let dto = gDto.generateAmmunitionDto(v4().split('-')[0]);
            dto.type = "Helmet";
            await supertest(app)
                .post('/ammunition')
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            let dto = gDto.generateAmmunitionDto(v4().split('-')[0]);
            dto.type = "Helmet";
            await supertest(app)
                .post('/ammunition')
                .send(dto)
                .expect(401);
        });
    });
    describe('Add characteristics', () => {
        it('should add characteristics', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const characteristics = [{
                name: 'Strength',
                value: 10
            }]
            await ammunitionService.removeCharacteristics(characteristics, ammunition.id);
            const {body} = await supertest(app)
                .post(`/ammunition/add-characteristics/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(characteristics)
                .expect(200);
            expect(body).toEqual(expect.arrayContaining([expect.objectContaining({
                ammunitionId: ammunition.id,
                upValue: characteristics[0].value
            })]))
        });
        it('should return 400 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            await supertest(app)
                .post(`/ammunition/add-characteristics/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const characteristics = [{
                name: 'Strength',
                value: 10
            }]
            await supertest(app)
                .post(`/ammunition/add-characteristics/${ammunition.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(characteristics)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const characteristics = [{
                name: 'Strength',
                value: 10
            }]
            await supertest(app)
                .post(`/ammunition/add-characteristics/${ammunition.id}`)
                .send(characteristics)
                .expect(401);
        });
    });
    describe('Add stats', () => {
        it('should add stats', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const stats = [{
                name: 'Protection',
                value: 10
            }]
            await ammunitionService.removeStats(stats, ammunition.id);
            const {body} = await supertest(app)
                .post(`/ammunition/add-stats/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(stats)
                .expect(200);
            expect(body).toEqual(expect.arrayContaining([expect.objectContaining({
                ammunitionId: ammunition.id,
                upValue: stats[0].value
            })]))
        });
        it('should return 400 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            await supertest(app)
                .post(`/ammunition/add-stats/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const stats = [{
                name: 'Protection',
                value: 10
            }]
            await supertest(app)
                .post(`/ammunition/add-stats/${ammunition.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(stats)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const stats = [{
                name: 'Protection',
                value: 10
            }]
            await supertest(app)
                .post(`/ammunition/add-stats/${ammunition.id}`)
                .send(stats)
                .expect(401);
        });
    });
    describe('Add skills', () => {
        it('should add skills', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const skills = [{
                name: 'Strongman'
            }]
            await ammunitionService.removeSkills(skills, ammunition.id);
            const {body} = await supertest(app)
                .post(`/ammunition/add-skills/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(skills)
                .expect(200);
            expect(body).toEqual(expect.arrayContaining([expect.objectContaining({
                ammunitionId: ammunition.id
            })]))
        });
        it('should return 400 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            await supertest(app)
                .post(`/ammunition/add-skills/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const skills = [{
                name: 'Strongman'
            }]
            await supertest(app)
                .post(`/ammunition/add-skills/${ammunition.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(skills)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const skills = [{
                name: 'Strongman'
            }]
            await supertest(app)
                .post(`/ammunition/add-skills/${ammunition.id}`)
                .send(skills)
                .expect(401);
        });
    });
    describe('Remove characteristics', () => {
        it('should remove characteristics', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const characteristics = [{
                name: 'Strength',
                value: 10
            }]
            await ammunitionService.addCharacteristics(characteristics, ammunition.id);
            const {body} = await supertest(app)
                .delete(`/ammunition/remove-characteristics/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(characteristics)
                .expect(200);
            expect(body).toEqual(expect.arrayContaining([expect.objectContaining({
                ammunitionId: ammunition.id
            })]))
        });
        it('should return 400 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            await supertest(app)
                .delete(`/ammunition/remove-characteristics/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const characteristics = [{
                name: 'Strength'
            }]
            await supertest(app)
                .delete(`/ammunition/remove-characteristics/${ammunition.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(characteristics)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const characteristics = [{
                name: 'Strength'
            }]
            await supertest(app)
                .delete(`/ammunition/remove-characteristics/${ammunition.id}`)
                .send(characteristics)
                .expect(401);
        });
    });
    describe('Remove stats', () => {
        it('should remove stats', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const stats = [{
                name: 'Protection',
                value: 10
            }]
            await ammunitionService.addStats(stats, ammunition.id);
            const {body} = await supertest(app)
                .delete(`/ammunition/remove-stats/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(stats)
                .expect(200);
            expect(body).toEqual(expect.arrayContaining([expect.objectContaining({
                ammunitionId: ammunition.id
            })]))
        });
        it('should return 400 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            await supertest(app)
                .delete(`/ammunition/remove-stats/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const stats = [{
                name: 'Protection'
            }]
            await supertest(app)
                .delete(`/ammunition/remove-stats/${ammunition.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(stats)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const stats = [{
                name: 'Protection'
            }]
            await supertest(app)
                .delete(`/ammunition/remove-stats/${ammunition.id}`)
                .send(stats)
                .expect(401);
        });
    });
    describe('Remove skills', () => {
        it('should remove skills', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const skills = [{
                name: 'Strongman'
            }]
            await ammunitionService.addSkills(skills, ammunition.id);
            const {body} = await supertest(app)
                .delete(`/ammunition/remove-skills/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(skills)
                .expect(200);
            expect(body).toEqual(expect.arrayContaining([expect.objectContaining({
                ammunitionId: ammunition.id
            })]))
        });
        it('should return 400 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            await supertest(app)
                .delete(`/ammunition/remove-skills/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const skills = [{
                name: 'Strongman'
            }]
            await supertest(app)
                .delete(`/ammunition/remove-skills/${ammunition.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(skills)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const skills = [{
                name: 'Strongman'
            }]
            await supertest(app)
                .delete(`/ammunition/remove-skills/${ammunition.id}`)
                .send(skills)
                .expect(401);
        });
    });
    describe('Update the ammunition', () => {
        it('should update the ammunition', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const name = v4().split('-')[0];
            const dto = {
                name
            }
            const {body} = await supertest(app)
                .patch(`/ammunition/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toMatchObject({
                id: ammunition.id,
                name: dto.name
            });
        });
        it('should return 404 status code', async () => {
            const name = v4().split('-')[0];
            const dto = {
                name
            }
            await supertest(app)
                .patch(`/ammunition/a`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(404);
        });
        it('should return 403 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const name = v4().split('-')[0];
            const dto = {
                name
            }
            await supertest(app)
                .patch(`/ammunition/${ammunition.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const ammunition = (await ammunitionService.getAll())[0];
            const name = v4().split('-')[0];
            const dto = {
                name
            }
            await supertest(app)
                .patch(`/ammunition/${ammunition.id}`)
                .send(dto)
                .expect(401);
        });
    });
    describe('Delete the ammunition', () => {
        it('should delete the ammunition', async () => {
            const name = v4().split('-')[0];
            const ammunitionDto = gDto.generateAmmunitionDto(name)
            const ammunition = await ammunitionService.create(ammunitionDto);
            const {body} = await supertest(app)
                .delete(`/ammunition/${ammunition.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toMatchObject({
                message: expect.any(String)
            });
        });
        it('should return 404 status code', async () => {
            await supertest(app)
                .delete(`/ammunition/a`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(404);
        });
        it('should return 403 status code', async () => {
            const name = v4().split('-')[0];
            const ammunitionDto = gDto.generateAmmunitionDto(name)
            const ammunition = await ammunitionService.create(ammunitionDto);
            await supertest(app)
                .delete(`/ammunition/${ammunition.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const ammunitionDto = gDto.generateAmmunitionDto(name)
            const ammunition = await ammunitionService.create(ammunitionDto);
            await supertest(app)
                .delete(`/ammunition/${ammunition.id}`)
                .expect(401);
        });
    });
    describe('Add the ammunition to the user', () => {
        it('should add the ammunition to the user', async () => {
            const name = v4().split('-')[0];
            const ammunitionDto = gDto.generateAmmunitionDto(name)
            const ammunition = await ammunitionService.create(ammunitionDto);
            const dto = {
                name: ammunition.name
            }
            const {body} = await supertest(app)
                .post(`/ammunition/add`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toMatchObject({
                ammunitionId: ammunition.id,
                userId: adminUser.id
            });
        });
        it('should return 400 status code', async () => {
            await supertest(app)
                .post(`/ammunition/add`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const ammunitionDto = gDto.generateAmmunitionDto(name)
            const ammunition = await ammunitionService.create(ammunitionDto);
            const dto = {
                name: ammunition.name
            }
            await supertest(app)
                .post(`/ammunition/add`)
                .send(dto)
                .expect(401);
        });
    });
    describe('Remove the ammunition from the user', () => {
        it('should remove the ammunition from the user', async () => {
            const name = v4().split('-')[0];
            const ammunitionDto = gDto.generateAmmunitionDto(name)
            const ammunition = await ammunitionService.create(ammunitionDto);
            await ammunitionOnUserService.create({ammunitionId: ammunition.id, userId: adminUser.id});
            const dto = {
                name: ammunition.name
            }
            const {body} = await supertest(app)
                .delete(`/ammunition/remove`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toMatchObject({
                message: expect.any(String)
            });
        });
        it('should return 400 status code', async () => {
            const name = v4().split('-')[0];
            const ammunitionDto = gDto.generateAmmunitionDto(name)
            const ammunition = await ammunitionService.create(ammunitionDto);
            await ammunitionOnUserService.create({ammunitionId: ammunition.id, userId: adminUser.id});
            await supertest(app)
                .delete(`/ammunition/remove`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const ammunitionDto = gDto.generateAmmunitionDto(name)
            const ammunition = await ammunitionService.create(ammunitionDto);
            await ammunitionOnUserService.create({ammunitionId: ammunition.id, userId: adminUser.id});
            const dto = {
                name: ammunition.name
            }
            await supertest(app)
                .delete(`/ammunition/remove`)
                .send(dto)
                .expect(401);
        });
    });
});
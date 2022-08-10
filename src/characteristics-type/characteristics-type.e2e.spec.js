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
const characteristicsTypeService = require('./characteristics-type.service');
const statsService = require('../stats/stats.service');
const characteristicTypeOnStatService = require('../characteristic-type-on-stat/characteristic-type-on-stat.service');

describe('characteristics-type', () => {
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
    describe('Get all the characterisitic types', () => {
        it('should return all the characterisitic types', async () => {
            const {body} = await supertest(app)
                .get('/characteristics-type')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toEqual(expect.any(Array));
        });
        it('should return 403 status code', async () => {
            await supertest(app)
                .get('/characteristics-type')
                .set("authorization", `Bearer ${userToken}`)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            await supertest(app)
                .get('/characteristics-type')
                .expect(401);
        });
    });
    describe('Create an ammunition type', () => {
        it('should create an ammunition type', async () => {
            const name = v4().split('-')[0];
            const dto = gDto.generateCharacteristicTypeDto(name);
            const {body} = await supertest(app)
                .post('/characteristics-type')
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(201);
            expect(body).toMatchObject({
                name
            });
        });
        it('should return 400 status code', async () => {
            await supertest(app)
                .post('/characteristics-type')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const name = v4().split('-')[0];
            const dto = gDto.generateCharacteristicTypeDto(name);
            await supertest(app)
                .post('/characteristics-type')
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const dto = gDto.generateCharacteristicTypeDto(name);
            await supertest(app)
                .post('/characteristics-type')
                .send(dto)
                .expect(401);
        });
    });
    describe('Add stats to the characteristic type', () => {
        it('should add stats to the characteristic type', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            const dto = [{
                name: 'Protection',
                eachDivider: 2,
                eachUp: 1
            }];
            const {body} = await supertest(app)
                .post(`/characteristics-type/add-stats/${characteristicType.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toEqual(expect.arrayContaining([expect.objectContaining({
                characteristicTypeId: characteristicType.id,
                eachDivider: dto[0].eachDivider,
                eachUp: dto[0].eachUp
            })]))
        });
        it('should return 403 status code', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            const dto = [{
                name: 'Protection',
                eachDivider: 2,
                eachUp: 1
            }];
            await supertest(app)
                .post(`/characteristics-type/add-stats/${characteristicType.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            const dto = [{
                name: 'Protection',
                eachDivider: 2,
                eachUp: 1
            }];
            await supertest(app)
                .post(`/characteristics-type/add-stats/${characteristicType.id}`)
                .send(dto)
                .expect(401);
        });
    });
    describe('Remove stats from the characteristic type', () => {
        it('should remove stats from the characteristic type', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            const statId = v4().split('-')[0];
            const statName = v4().split('-')[0];
            const statDto = [{
                name: statName,
                id: statId
            }];
            const stat = await statsService.create(statDto[0]);
            const charTypeOnStatDto = {
                characteristicTypeId: characteristicType.id,
                statId: stat.id,
                eachDivider: 2,
                eachUp: 1
            }
            await characteristicTypeOnStatService.create(charTypeOnStatDto);
            const {body} = await supertest(app)
                .delete(`/characteristics-type/remove-stats/${characteristicType.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(statDto)
                .expect(200);
            expect(body).toEqual(expect.arrayContaining([expect.objectContaining({
                characteristicTypeId: characteristicType.id
            })]))
        });
        it('should return 400 status code', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            const statId = v4().split('-')[0];
            const statName = v4().split('-')[0];
            const statDto = [{
                name: statName,
                id: statId
            }];
            const stat = await statsService.create(statDto[0]);
            const charTypeOnStatDto = {
                characteristicTypeId: characteristicType.id,
                statId: stat.id,
                eachDivider: 2,
                eachUp: 1
            }
            await characteristicTypeOnStatService.create(charTypeOnStatDto);
            await supertest(app)
                .delete(`/characteristics-type/remove-stats/${characteristicType.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            const statId = v4().split('-')[0];
            const statName = v4().split('-')[0];
            const statDto = [{
                name: statName,
                id: statId
            }];
            const stat = await statsService.create(statDto[0]);
            const charTypeOnStatDto = {
                characteristicTypeId: characteristicType.id,
                statId: stat.id,
                eachDivider: 2,
                eachUp: 1
            }
            await characteristicTypeOnStatService.create(charTypeOnStatDto);
            await supertest(app)
                .delete(`/characteristics-type/remove-stats/${characteristicType.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(statDto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            const statId = v4().split('-')[0];
            const statName = v4().split('-')[0];
            const statDto = [{
                name: statName,
                id: statId
            }];
            const stat = await statsService.create(statDto[0]);
            const charTypeOnStatDto = {
                characteristicTypeId: characteristicType.id,
                statId: stat.id,
                eachDivider: 2,
                eachUp: 1
            }
            await characteristicTypeOnStatService.create(charTypeOnStatDto);
            await supertest(app)
                .delete(`/characteristics-type/remove-stats/${characteristicType.id}`)
                .send(statDto)
                .expect(401);
        });
    });
    describe('Update the characteristic type', () => {
        it('should update the characteristic type', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            const newName = v4().split('-')[0];
            const dto = {
                name: newName
            };
            const {body} = await supertest(app)
                .patch(`/characteristics-type/${characteristicType.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toMatchObject({
                id: characteristicType.id,
                name: dto.name
            });
        });
        it('should return 400 status code', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            const newName = v4().split('-')[0];
            const dto = {
                name: newName
            };
            await supertest(app)
                .patch(`/characteristics-type/${characteristicType.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            const newName = v4().split('-')[0];
            const dto = {
                name: newName
            };
            await supertest(app)
                .patch(`/characteristics-type/${characteristicType.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            const newName = v4().split('-')[0];
            const dto = {
                name: newName
            };
            await supertest(app)
                .patch(`/characteristics-type/${characteristicType.id}`)
                .send(dto)
                .expect(401);
        });
    });
    describe('Delete the characteristic type', () => {
        it('should delete the characteristic type', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            const {body} = await supertest(app)
                .delete(`/characteristics-type/${characteristicType.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toMatchObject({
                message: expect.any(String)
            });
        });
        it('should return 404 status code', async () => {
            await supertest(app)
                .delete(`/characteristics-type/a`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(404);
        });
        it('should return 403 status code', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            await supertest(app)
                .delete(`/characteristics-type/${characteristicType.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const dtoCharType = gDto.generateCharacteristicTypeDto(name);
            const characteristicType = await characteristicsTypeService.create(dtoCharType);
            await supertest(app)
                .delete(`/characteristics-type/${characteristicType.id}`)
                .expect(401);
        });
    });
});
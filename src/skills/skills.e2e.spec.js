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
const skillsService = require('./skills.service');
const skillOnUsersService = require('../skill-on-users/skill-on-users.service');
const skillOnCharacteristicsService = require('../skill-on-characteristics/skill-on-characteristics.service');
const characteristicsTypeService = require('../characteristics-type/characteristics-type.service');
const statsService = require('../stats/stats.service');
const skillOnStatsService = require('../skill-on-stats/skill-on-stats.service');

describe('skills', () => {
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
    describe('Get all the skills', () => {
        it('should return all the skills', async () => {
            const {body} = await supertest(app)
                .get('/skills')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toEqual(expect.any(Array));
        });
        it('should return 401 status code', async () => {
            await supertest(app)
                .get('/skills')
                .expect(401);
        });
    });
    describe('Create an ammunition', () => {
        it('should create an ammunition', async () => {
            const name = v4().split('-')[0];
            const dto = gDto.generateSkillDto(name);
            const {body} = await supertest(app)
                .post('/skills')
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(201);
            expect(body).toMatchObject({
                name
            });
        });
        it('should return 400 status code', async () => {
            await supertest(app)
                .post('/skills')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const name = v4().split('-')[0];
            const dto = gDto.generateSkillDto(name);
            await supertest(app)
                .post('/skills')
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const dto = gDto.generateSkillDto(name);
            await supertest(app)
                .post('/skills')
                .send(dto)
                .expect(401);
        });
    });
    describe('Add the skill to the user', () => {
        it('should add the skill to the user', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const dto = {
                name: skill.name
            }
            const {body} = await supertest(app)
                .post('/skills/add')
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toMatchObject({
                skillId: skill.id,
                userId: adminUser.id
            });
        });
        it('should return 400 status code', async () => {
            await supertest(app)
                .post('/skills/add')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const dto = {
                name: skill.name
            }
            await supertest(app)
                .post('/skills/add')
                .send(dto)
                .expect(401);
        });
    });
    describe('Remove the skill from the user', () => {
        it('should remove the skill from the user', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            await skillOnUsersService.create(skill.id, adminUser.id);
            const dto = {
                name: skill.name
            }
            const {body} = await supertest(app)
                .delete('/skills/remove')
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toMatchObject({
                message: expect.any(String)
            });
        });
        it('should return 400 status code', async () => {
            await supertest(app)
                .delete('/skills/remove')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            await skillOnUsersService.create(skill.id, adminUser.id);
            const dto = {
                name: skill.name
            }
            await supertest(app)
                .delete('/skills/remove')
                .send(dto)
                .expect(401);
        });
    });
    describe('Add the characteristics', () => {
        it('should add the characteristics', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const dto = [{
                name: 'Strength',
                value: 10
            }]
            const {body} = await supertest(app)
                .post(`/skills/add-characteristics/${skill.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toEqual(expect.arrayContaining([expect.objectContaining({
                skillId: skill.id,
                upValue: dto[0].value
            })]));
        });
        it('should return 400 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            await supertest(app)
                .post(`/skills/add-characteristics/${skill.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const dto = [{
                name: 'Strength',
                value: 10
            }]
            await supertest(app)
                .post(`/skills/add-characteristics/${skill.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const dto = [{
                name: 'Strength',
                value: 10
            }]
            await supertest(app)
                .post(`/skills/add-characteristics/${skill.id}`)
                .send(dto)
                .expect(401);
        });
    });
    describe('Remove the characteristics', () => {
        it('should remove the characteristics', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const chartypeName = v4().split('-')[0];
            const charTypeDto = gDto.generateCharacteristicTypeDto(chartypeName);
            const characteristicType = await characteristicsTypeService.create(charTypeDto);
            await skillOnCharacteristicsService.create({characteristicTypeId: characteristicType.id, skillId: skill.id, upValue: 10});
            const dto = [{
                name: characteristicType.name
            }];
            const {body} = await supertest(app)
                .delete(`/skills/remove-characteristics/${skill.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toEqual(expect.arrayContaining([expect.objectContaining({
                skillId: skill.id,
                characteristicTypeId: characteristicType.id
            })]));
        });
        it('should return 400 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const chartypeName = v4().split('-')[0];
            const charTypeDto = gDto.generateCharacteristicTypeDto(chartypeName);
            const characteristicType = await characteristicsTypeService.create(charTypeDto);
            await skillOnCharacteristicsService.create({characteristicTypeId: characteristicType.id, skillId: skill.id, upValue: 10});
            await supertest(app)
                .delete(`/skills/remove-characteristics/${skill.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const chartypeName = v4().split('-')[0];
            const charTypeDto = gDto.generateCharacteristicTypeDto(chartypeName);
            const characteristicType = await characteristicsTypeService.create(charTypeDto);
            await skillOnCharacteristicsService.create({characteristicTypeId: characteristicType.id, skillId: skill.id, upValue: 10});
            const dto = [{
                name: characteristicType.name
            }];
            await supertest(app)
                .delete(`/skills/remove-characteristics/${skill.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const chartypeName = v4().split('-')[0];
            const charTypeDto = gDto.generateCharacteristicTypeDto(chartypeName);
            const characteristicType = await characteristicsTypeService.create(charTypeDto);
            await skillOnCharacteristicsService.create({characteristicTypeId: characteristicType.id, skillId: skill.id, upValue: 10});
            const dto = [{
                name: characteristicType.name
            }];
            await supertest(app)
                .delete(`/skills/remove-characteristics/${skill.id}`)
                .send(dto)
                .expect(401);
        });
    });
    describe('Add the stats', () => {
        it('should add the stats', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const statName = v4().split('-')[0];
            const statId = v4().split('-')[0];
            const statDto = {
                id: statId,
                name: statName
            };
            const stat = await statsService.create(statDto);
            const dto = [{
                name: stat.name,
                value: 10
            }];
            const {body} = await supertest(app)
                .post(`/skills/add-stats/${skill.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toEqual(expect.arrayContaining([expect.objectContaining({
                skillId: skill.id,
                statId: stat.id
            })]));
        });
        it('should return 400 satus code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const statName = v4().split('-')[0];
            const statId = v4().split('-')[0];
            const statDto = {
                id: statId,
                name: statName
            };
            await statsService.create(statDto);
            await supertest(app)
                .post(`/skills/add-stats/${skill.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 satus code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const statName = v4().split('-')[0];
            const statId = v4().split('-')[0];
            const statDto = {
                id: statId,
                name: statName
            };
            const stat = await statsService.create(statDto);
            const dto = [{
                name: stat.name,
                value: 10
            }];
             await supertest(app)
                .post(`/skills/add-stats/${skill.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 satus code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const statName = v4().split('-')[0];
            const statId = v4().split('-')[0];
            const statDto = {
                id: statId,
                name: statName
            };
            const stat = await statsService.create(statDto);
            const dto = [{
                name: stat.name,
                value: 10
            }];
             await supertest(app)
                .post(`/skills/add-stats/${skill.id}`)
                .send(dto)
                .expect(401);
        });
    });
    describe('Remove the stats', () => {
        it('should remove the stats', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const statName = v4().split('-')[0];
            const statId = v4().split('-')[0];
            const statDto = {
                id: statId,
                name: statName
            };
            const stat = await statsService.create(statDto);
            await skillOnStatsService.create({statId: stat.id, skillId: skill.id, upValue: 10});
            const dto = [{
                name: stat.name
            }];
            const {body} = await supertest(app)
                .delete(`/skills/remove-stats/${skill.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toEqual(expect.arrayContaining([expect.objectContaining({
                skillId: skill.id,
                statId: stat.id
            })]));
        });
        it('should return 400 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const statName = v4().split('-')[0];
            const statId = v4().split('-')[0];
            const statDto = {
                id: statId,
                name: statName
            };
            const stat = await statsService.create(statDto);
            await skillOnStatsService.create({statId: stat.id, skillId: skill.id, upValue: 10});
            await supertest(app)
                .delete(`/skills/remove-stats/${skill.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 403 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const statName = v4().split('-')[0];
            const statId = v4().split('-')[0];
            const statDto = {
                id: statId,
                name: statName
            };
            const stat = await statsService.create(statDto);
            await skillOnStatsService.create({statId: stat.id, skillId: skill.id, upValue: 10});
            const dto = [{
                name: stat.name
            }];
            await supertest(app)
                .delete(`/skills/remove-stats/${skill.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const statName = v4().split('-')[0];
            const statId = v4().split('-')[0];
            const statDto = {
                id: statId,
                name: statName
            };
            const stat = await statsService.create(statDto);
            await skillOnStatsService.create({statId: stat.id, skillId: skill.id, upValue: 10});
            const dto = [{
                name: stat.name
            }];
            await supertest(app)
                .delete(`/skills/remove-stats/${skill.id}`)
                .send(dto)
                .expect(401);
        });
    });
    describe('Update the skill', () => {
        it('should update the skill', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const newName = v4().split('-')[0];
            const dto = {
                name: newName
            };
            const {body} = await supertest(app)
                .patch(`/skills/${skill.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toMatchObject({
                id: skill.id,
                name: dto.name
            })
        });
        it('should return 403 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const newName = v4().split('-')[0];
            const dto = {
                name: newName
            };
            await supertest(app)
                .patch(`/skills/${skill.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .send(dto)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const newName = v4().split('-')[0];
            const dto = {
                name: newName
            };
            await supertest(app)
                .patch(`/skills/${skill.id}`)
                .send(dto)
                .expect(401);
        });
    });
    describe('Remove the skill', () => {
        it('should remove the skill', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            const {body} = await supertest(app)
                .delete(`/skills/${skill.id}`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toMatchObject({
                message: expect.any(String)
            })
        });
        it('should return 404 status code', async () => {
            await supertest(app)
                .delete(`/skills/a`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(404);
        });
        it('should return 403 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            await supertest(app)
                .delete(`/skills/${skill.id}`)
                .set("authorization", `Bearer ${userToken}`)
                .expect(403);
        });
        it('should return 401 status code', async () => {
            const name = v4().split('-')[0];
            const dtoSKill = gDto.generateSkillDto(name);
            const skill = await skillsService.create(dtoSKill);
            await supertest(app)
                .delete(`/skills/${skill.id}`)
                .expect(401);
        });
    });
});
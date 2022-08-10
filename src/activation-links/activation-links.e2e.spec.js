require('dotenv/config');
const rolesService = require('../roles/roles.service');
const tokensService = require('../tokens/tokens.service');
const usersService = require('../users/users.service');
const GeneratorDto = require('../generators/generate-dto');
const { v4 } = require('uuid');
const { RoleTypes } = require('../roles/roles.type');
const supertest = require('supertest');
const app = require('../app');
const activationLinksService = require('./activation-links.service');

describe('actlinks', () => {
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
        return [token, user, userRole];
    }
    beforeAll(async () => {
        [userToken, userUser] = await createUser(gDto.generateUserDto(), RoleTypes.USER);
        [adminToken, adminUser] = await createUser(gDto.generateUserDto(), RoleTypes.ADMIN);
    });
    describe('Verificate the phone number', () => {
        it('should verificate the phone number', async () => {
            const dtoActLink = gDto.generateActivationLinkDto(adminUser.id, v4(), null);
            const actLink = await activationLinksService.createActiovationLink(dtoActLink);
            const dto = {
                phoneNumber: '+380111111111'
            }
            const {body} = await supertest(app)
                .post(`/activation-links/phone/${actLink.userId}/${actLink.link}`)
                .send(dto)
                .expect(200);
            expect(body).toMatchObject({
                link: expect.any(String)
            })
        });
        it('should return 404 status code', async () => {
            const dto = {
                phoneNumber: '+380111111111'
            }
            await supertest(app)
                .post(`/activation-links/phone/a/a`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(404);
        });
    });
    describe('Accept registration', () => {
        it('should accept registration', async () => {
            const dtoUser = gDto.generateUserDto();
            const newUser = await usersService.createUser(dtoUser);
            const dtoActLink = gDto.generateActivationLinkDto(newUser.id, v4(), 1234);
            const actLink = await activationLinksService.createActiovationLink(dtoActLink);
            const dto = {
                phoneCode: 1234
            }
            await supertest(app)
                .post(`/activation-links/activationReg/${actLink.userId}/${actLink.link}`)
                .send(dto)
                .expect(200);
        });
        it('should return 400 status code', async () => {
            const dtoUser = gDto.generateUserDto();
            const newUser = await usersService.createUser(dtoUser);
            const dtoActLink = gDto.generateActivationLinkDto(newUser.id, v4(), 1234);
            const actLink = await activationLinksService.createActiovationLink(dtoActLink);
            await supertest(app)
                .post(`/activation-links/activationReg/${actLink.userId}/${actLink.link}`)
                .expect(400);
        });
        it('should return 404 status code', async () => {
            const dto = {
                phoneCode: 1234
            }
            await supertest(app)
                .post(`/activation-links/activationReg/a/a`)
                .send(dto)
                .expect(404);
        });
    });
    describe('Accept login', () => {
        it('should accept login', async () => {
            const dtoUser = gDto.generateUserDto();
            const newUser = await usersService.createUser(dtoUser);
            const dtoActLink = gDto.generateActivationLinkDto(newUser.id, v4(), 1234);
            dtoActLink.isActivated = true;
            const actLink = await activationLinksService.createActiovationLink(dtoActLink);
            const dto = {
                phoneCode: 1234
            }
            const {body} = await supertest(app)
                .post(`/activation-links/activationLog/${actLink.userId}`)
                .send(dto)
                .expect(200);
            expect(body).toMatchObject({
                token: expect.any(String)
            })
        });
        it('should return 400 status code', async () => {
            const dtoUser = gDto.generateUserDto();
            const newUser = await usersService.createUser(dtoUser);
            const dtoActLink = gDto.generateActivationLinkDto(newUser.id, v4(), 1234);
            dtoActLink.isActivated = true;
            const actLink = await activationLinksService.createActiovationLink(dtoActLink);
            await supertest(app)
                .post(`/activation-links/activationLog/${actLink.userId}`)
                .expect(400);
        });
        it('should return 404 status code', async () => {
            const dto = {
                phoneCode: 1234
            }
            await supertest(app)
                .post(`/activation-links/activationLog/a`)
                .send(dto)
                .expect(404);
        });
    });
});
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
    describe('Register user', () => {
        it('should register user', async () => {
            let dto = gDto.generateUserDto();
            dto.password = '12345';
            const {body} = await supertest(app)
                .post('/auth/registration')
                .send(dto)
                .expect(201);
            expect(body).toMatchObject({
                message: expect.any(String)
            });
        });
        it('should return 400 status code', async () => {
            await supertest(app)
                .post('/auth/registration')
                .expect(400);
        });
    });
    describe('Login user', () => {
        it('should login user', async () => {
            let dto = {
                email: adminUser.email,
                password: '12345'
            }
            const {body} = await supertest(app)
                .post('/auth/login')
                .send(dto)
                .expect(200);
            expect(body).toMatchObject({
                link: expect.any(String)
            });
        });
        it('should return 400 status code', async () => {
            await supertest(app)
                .post('/auth/login')
                .expect(400);
        });
    });
    describe('Logout user', () => {
        it('should logout user', async () => {
            const {body} = await supertest(app)
                .get('/auth/logout')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toMatchObject({
                message: expect.any(String)
            });
        });
        it('should return 401 status code', async () => {
            await supertest(app)
                .get('/auth/logout')
                .expect(401);
        });
    });
});
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

describe('profiles', () => {
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
    describe('Get the user profile', () => {
        it('should return the user profile', async () => {
            const {body} = await supertest(app)
                .get('/profiles')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toMatchObject({
                id: adminUser.id
            });
        });
        it('should return 401 status code', async () => {
            await supertest(app)
                .get('/profiles')
                .expect(401);
        });
    });
    describe('Update the user profile', () => {
        it('should update the user profile', async () => {
            const dto = {
                description: 'new description'
            };
            const {body} = await supertest(app)
                .patch('/profiles')
                .set("authorization", `Bearer ${adminToken}`)
                .send(dto)
                .expect(200);
            expect(body).toMatchObject({
                id: adminUser.id,
                description: dto.description
            });
        });
        it('should return 401 status code', async () => {
            const dto = {
                description: 'new description 2'
            };
            await supertest(app)
                .patch('/profiles')
                .send(dto)
                .expect(401);
        });
    });
});
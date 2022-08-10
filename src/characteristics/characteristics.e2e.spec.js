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
const characteristicsTypeService = require('../characteristics-type/characteristics-type.service');
const characteristicsService = require('./characteristics.service');

describe('characteristics', () => {
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
    describe('Update the user characterisitcs', () => {
        it('should update the user characterisitcs', async () => {
            const charType = v4().split('-')[0];
            const characteristicsTypeDto = gDto.generateCharacteristicTypeDto(charType);
            const characteristicType = await characteristicsTypeService.create(characteristicsTypeDto);
            const id = await characteristicsService.generateCharacteristicId();
            await characteristicsService.create({
                id,
                value: 10,
                userId: adminUser.id,
                characteristicTypeId: characteristicType.id
            });
            const dto = [{
                name: characteristicType.name,
                value: 15
            }];
            const {body} = await supertest(app)
                .patch('/characteristics')
                .send(dto)
                .set("authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(body).toEqual(expect.arrayContaining([expect.objectContaining({
                characteristicType: {
                    name: dto[0].name
                },
                value: dto[0].value
            })]))
        });
        it('should return 400 status code', async () => {
            await supertest(app)
                .patch('/characteristics')
                .set("authorization", `Bearer ${adminToken}`)
                .expect(400);
        });
        it('should return 401 status code', async () => {
            const charType = v4().split('-')[0];
            const characteristicsTypeDto = gDto.generateCharacteristicTypeDto(charType);
            const characteristicType = await characteristicsTypeService.create(characteristicsTypeDto);
            const dto = [{
                name: characteristicType.name,
                value: 15
            }];
            await supertest(app)
                .patch('/characteristics')
                .send(dto)
                .expect(401);
        });
    });
});
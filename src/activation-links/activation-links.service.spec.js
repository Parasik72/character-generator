const GeneratorDto = require('../generators/generate-dto');
const ActivationLinksService = require('./activation-links.service');

const mockGDto = new GeneratorDto('actlinks');

jest.mock('../db/postgreSQL.prisma.service', () => {
    return {
        activationlink: {
            create: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateActivationLinkDto('', '', ''),
                    ...dto.data
                }
            }),
            findUnique: jest.fn().mockImplementation((dto) => {
                return null
            }),
            findFirst: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateActivationLinkDto('', '', ''),
                    ...dto.where
                }
            }),
            update: jest.fn().mockImplementation((dto) => {
                return {
                    ...mockGDto.generateActivationLinkDto('', '', ''),
                    ...dto.where,
                    ...dto.data,
                }
            }),
        }
    }
});

describe('activation-links service', () => {
    it('should be defined', () => {
        expect(ActivationLinksService).toBeDefined();
    });
    it('should generate a link', async () => {
        expect(await ActivationLinksService.generateLink()).toEqual(expect.any(String));
    });
    it('should create a phone verification link url', async () => {
        expect(await ActivationLinksService.createPhoneVerificationLinkUrl('' ,'')).toEqual(expect.any(String));
    });
    it('should create an activation reg link url', async () => {
        expect(await ActivationLinksService.createActivationRegLinkUrl('' ,'')).toEqual(expect.any(String));
    });
    it('should create an activation log link url', async () => {
        expect(await ActivationLinksService.createActivationLogLinkUrl('')).toEqual(expect.any(String));
    });
    it('should create an activation link', async () => {
        const dto = mockGDto.generateActivationLinkDto('123', 'link', 1234);
        expect(await ActivationLinksService.createActiovationLink(dto)).toMatchObject({
            ...dto
        });
    });
    it('should return an user by userId and link', async () => {
        const dto = {
            userId: '123',
            link: 'link'
        };
        expect(await ActivationLinksService.getOneByUserIdAndLink(dto.userId, dto.link)).toMatchObject({
            ...dto
        });
    });
    it('should return an user by userId', async () => {
        const dto = {
            userId: '123'
        };
        expect(await ActivationLinksService.getOneByUserId(dto.userId)).toMatchObject({
            ...dto
        });
    });
    it('should generate a phone code', async () => {
        expect(await ActivationLinksService.generatePhoneCode()).toEqual(expect.any(Number));
    });
    it('should update the activation link', async () => {
        const actlink = mockGDto.generateActivationLinkDto('', '', 1235);
        const dto = {
            link: 'link'
        };
        expect(await ActivationLinksService.updateActivationLink(dto, actlink)).toMatchObject({
            link: dto.link
        });
    });
});
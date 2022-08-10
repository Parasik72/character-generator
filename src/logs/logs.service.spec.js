const GeneratorDto = require('../generators/generate-dto');
const LogsService = require('./logs.service');

const mockGDto = new GeneratorDto('logs');
const mockLogs = [
    mockGDto.generateLogDto('123'),
    mockGDto.generateLogDto('123'),
    mockGDto.generateLogDto('123')
]

jest.mock('../db/mongoDB.prisma.service', () => {
    return {
        log: {
            findMany: jest.fn().mockImplementation(() => {
                return mockLogs
            }),
            create: jest.fn().mockImplementation((dto) => {
                return dto.data
            })
        }
    }
});

describe('logs service', () => {
    it('should be defined', () => {
        expect(LogsService).toBeDefined();
    });
    it('should return all the logs', async () => {
        expect(await LogsService.getAll()).toEqual(expect.any(Array))
    });
    it('should create a log', async () => {
        const dto = mockGDto.generateLogDto('123');
        expect(await LogsService.create(dto)).toMatchObject({
            id: dto.id
        })
    });
});
const MailTransporterService = require('./mail-transporter.service');

jest.mock('../mail-transporter/transporter', () => {
    return {
        sendMail: jest.fn().mockImplementation((dto) => {
            return dto
        }),
    }
});

describe('logs service', () => {
    it('should be defined', () => {
        expect(MailTransporterService).toBeDefined();
    });
    it('should send an email', async () => {
        expect(await MailTransporterService.sendEmail());
    });
});
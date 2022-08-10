const Transporter = require('../mail-transporter/transporter');

class MailTransporterService {
    async sendEmail(to, subject, text){
        await Transporter.sendMail({
            to,
            subject,
            text
        });
    }
}

module.exports = new MailTransporterService();
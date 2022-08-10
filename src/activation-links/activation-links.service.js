const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");
const { v4 } = require('uuid');

class ActivationLinksService {
    async generateLink() {
        let activationlink, link;
        do {
            link = v4();
            activationlink = await PostgreSQLPrisma.activationlink.findUnique({where: {link}});
        } while (activationlink);
        return link;
    }

    createPhoneVerificationLinkUrl(userId, link) {
        return `http://localhost:5000/activation-links/phone/${userId}/${link}`;
    }

    createActivationRegLinkUrl(userId, link) {
        return `http://localhost:5000/activation-links/activationReg/${userId}/${link}`;
    }

    createActivationLogLinkUrl(userId) {
        return `http://localhost:5000/activation-links/activationLog/${userId}`;
    }

    async createActiovationLink(dto) {
        return PostgreSQLPrisma.activationlink.create({data: dto});
    }

    async getOneByUserIdAndLink(userId, link){
        return PostgreSQLPrisma.activationlink.findFirst({where: {userId, link}});
    }

    async getOneByUserId(userId){
        return PostgreSQLPrisma.activationlink.findFirst({where: {userId}});
    }

    generatePhoneCode(){
        return Math.floor(Math.random() * (9999 - 1111) + 1111);
    }

    async updateActivationLink(dto, activationlink) {
        return PostgreSQLPrisma.activationlink.update({data: dto, where: {link: activationlink.link}});
    }
}

module.exports = new ActivationLinksService();
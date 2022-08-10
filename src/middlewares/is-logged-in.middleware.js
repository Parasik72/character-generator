const HttpException = require('../exceptions/HttpException');
const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret123';

const isLoggedIn = async (req, res, next) => {
    try {
        if(req.method === 'OPTIONS')
            return next();
        const token = req.headers.authorization.split(' ')[1];
        if(!token || token === 'null')
            throw new HttpException('No authorization', 401);
        const user = jwt.verify(token, JWT_SECRET);
        if(!user)
            throw new HttpException('No authorization', 401);
        const tokenDB = await PostgreSQLPrisma.token.findFirst({where: {userId: user.id}});
        if(!tokenDB || !tokenDB.isActive)
            throw new HttpException('No authorization', 401);
        req.user = user;
        return next();
    } catch (error) {
        if(error instanceof HttpException)
            return res.status(error.statusCode).json({message: error.message});
        return res.status(401).json({message: 'No authorization'});
    }
}

module.exports = isLoggedIn;
class HttpException {
    statusCode;
    message;
    constructor(message, statusCode){
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = HttpException;
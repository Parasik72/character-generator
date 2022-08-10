const fs = require('fs');
const uuid = require('uuid');
const path = require('path');

class FileUploadService {
    uploadFile(file, dirPath) {
        const filePath = this.generateFileName(file, dirPath);
        if(!fs.existsSync(dirPath))
            fs.mkdirSync(dirPath, {recursive: true});
        fs.writeFileSync(filePath, file.data);
        return filePath;
    }

    generateFileName(file, dirPath) {
        const extension = file.name.split('.').pop();
        let filePath;
        do {
            const fileName = uuid.v4();
            filePath = path.resolve(dirPath, fileName) + `.${extension}`;
        } while (fs.existsSync(filePath));
        return filePath;
    }

    deleteFile(filePath) {
        if(!fs.existsSync(filePath))
            return null;
        fs.unlinkSync(filePath);
        return filePath;
    }
}

module.exports = new FileUploadService();
require('dotenv/config');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server has been started on port: ${PORT}`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();
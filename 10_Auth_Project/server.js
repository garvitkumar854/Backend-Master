const app = require('./src/app');
const connectDB = require('./src/config/database');
const config = require('./src/config/config');


async function startServer() {
    try {
        await connectDB();
        app.listen(config.PORT, () => {
            console.log(`Server is running on port ${config.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server', error.message);
        process.exit(1);
    }
}

startServer();

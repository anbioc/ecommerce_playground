const { expressApp, PORT } = require('./config/setup');
const { dbConnect } = require('./config/dbConnect');
const router = require('./router/authRoute');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');

dbConnect();

expressApp.use('/api/user', router)

expressApp.use(notFound);
expressApp.use(errorHandler);
expressApp.use(cookieParser())

expressApp.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running at PORT ${PORT}`);
});
const { expressApp, PORT } = require('./config/setup');
const { dbConnect } = require('./config/dbConnect');
const {userRouter} = require('./router/authRoute');
const {router: productRouter} = require('./router/productRoute');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require("morgan");


dbConnect();

// request logging
expressApp.use(morgan("combined"));

// routers
expressApp.use('/api/user', userRouter)
expressApp.use('/api/product', productRouter);

expressApp.use(notFound);
expressApp.use(errorHandler);
expressApp.use(cookieParser())

expressApp.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running at PORT ${PORT}`);
});
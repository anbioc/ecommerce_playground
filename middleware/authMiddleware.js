const User = require('../model/user');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization?.split(' ')[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // console.log(decoded);
                req.user = await User.findById(decoded?.id);
                // console.log(req.user);
                next();
            }
            
        } catch (e) {
            throw new Error("not Authorized, token expired. please login again: "+e.message);
        }
    } else {
        throw new Error('there is no token attached to the header');
    }
})


const isAdmin = asyncHandler( async (req, res, next) => {
    const adminUser = await User.findById(req.user.id);
    if (adminUser.role !== "admin") {
        throw new Error("user is not admin");
    }
    next();
});
module.exports = {authMiddleware, isAdmin}; 
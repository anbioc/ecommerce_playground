const User = require('../model/user');
const asyncHandler = require('express-async-handler');
const {generateToken} = require("../config/jwtToken");
const {generateRefreshToken} = require("../config/refreshToken");
const jwt = require("jsonwebtoken");


// Register
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    await createUserOrReturnFailure(user, res, req);
})

async function createUserOrReturnFailure(user, res, req) {
    if (!user) {
        const result = await User.create(req.body);
        result.password = null;
        res.status(201).json(
            {
                result: "success",
                user: result
            }
        );
    } else {
        throw new Error('User already exists');
    }
}

const handleRefreshToken = asyncHandler(async (req, res) => {
    try {
        const refreshToken = req.headers.cookie.split('=')[1];
        if (!refreshToken) {
            throw new Error("refresh token not found");
        }
        // console.log(refreshToken);  
        const user = await User.findOne({refreshToken});


        if (!user){
            throw new Error("No refresh token present in db or not matched agains it");
        }
        
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err || user.id !== decoded.id){
                throw new error("wrong refresh token")
            } else {
                const newRefreshToken = generateRefreshToken(decoded.id);
                User.findByIdAndUpdate(decoded.id, {refreshToken: newRefreshToken})
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000
                }).status(201).json({
                    status: "success",
                    accessToken: newRefreshToken
                });
            }
        });

    } catch (e) {
        throw new Error(e);
    }

});


// login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
     
    const foundUser = await User.findOne({ email: email });

    if (!foundUser) {
        throw Error("User doesn't exists");
    } else {
        try {
            if (await foundUser.comparePassword(password)) {
                const refreshToken = await generateRefreshToken(foundUser?.id);
                const updatedUser = await User.findByIdAndUpdate(foundUser?.id, {
                    refreshToken: refreshToken
                });

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 72*60*60*1000,
                }).status(200).json({ 
                    _id: updatedUser?.id,
                    firstname: updatedUser?.firstname,
                    lastname: updatedUser?.lastname,
                    email: updatedUser?.email,
                    mobile: updatedUser?.mobile,
                    role: updatedUser?.role,
                    // refreshToken: refreshToken,
                    token: generateToken(updatedUser?.id),
                 });
            } else {
                res.status(404).json({ result: "failure", message: "passwords doesn\'t match" });
            }

        } catch (e) {
            throw Error("Error while login the user " + e.message);
        }
    }
});

const logout = asyncHandler(async (req, res) => {

    try {
        const cookie = req.headers.cookie;
        console.log(cookie);
        if (!cookie) {
            throw new Error("no refresh token");
        }

        const refreshToken = cookie.split('=')[1];
        console.log(refreshToken);

        const user = await User.findOne({refreshToken});

        if (user) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true
            });
            res.status(204);
        } 
        
        const result = User.findOneAndUpdate(refreshToken, {
            refreshToken: ""
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        });
        res.status(201).json({
            status: "success"
        });

    
    } catch(e) {
        throw new Error("can't log out: "+e.message);
    }

})

module.exports = { loginUser, createUser, handleRefreshToken, logout };

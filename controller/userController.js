const { response } = require('express');
const User = require('../model/user');
const asyncHandler = require('express-async-handler');
const {validateMongoDbID: idValidator} = require("../util/validateMongoDbID");


const getUser = asyncHandler(async (req, res) => {
    const user = req.user;
    user.password = null;
    res.status(200).json({
        result: "success", users: user
    });
});

const getUsers = asyncHandler(async (req, res) => {
    res.status(200).json({
        result: "success", users: await User.find()
    });
});

const deleteUsers = asyncHandler(async (req, res) => {
    const result = await User.deleteMany({
        role: { $ne: 'admin' }
    });
    res.status(200).json({
        result: "success",
        deleted: result.deletedCount
    });
})


const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.params.email });

    console.log(user);
    if (user && user.role == "admin") {
        res.status(404)
            .json({
                result: "failure",
                deleted: 0,
                message: "Can't delete an admin",
            });
    } else if (user && user.role == "user") {
        const result = await User.deleteOne({ email: req.params.email });
        res.status(200)
            .json({
                result: result.deletedCount == 1 ? "success" : "failure",
                deleted: result.deletedCount
            });
    } else {
        res.status(404)
            .json({
                result: "failure",
                deleted: 0,
                message: "Can't delete items",
            });
    }
})

const updateUser = asyncHandler(async (req, res) => {

    try {
        idValidator(req.user.id);
        const update = await User.findByIdAndUpdate(req.user.id, {
            firstname: req.params.firstname,
            lastname: req.params.lastname,
            mobile: req.params.mobile
        }, {
            new: true
        });
        res.status(201).json(update);
    } catch (e) {
        throw new Error("can\'n update the item: " + e.message);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;

    try {
        idValidator(req.user.id);
        const result = await User.findByIdAndUpdate(id, {
            isBlocked: true
        }, {new : true});
        res.status(201).json({
            status: "success",
            result: result
        })
    } catch (e) {
        throw new Error("can't block user: "+e.message);
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    idValidator(req.user.id);

    try {
        const result = await User.findByIdAndUpdate(id, {
            isBlocked: false,
        }, {new : true});
    
        res.status(201).json({
            status: "success",
            result: result
        });
    } catch (e) {
        throw new Error("can't unblock user: "+e.message);
    }
});



module.exports = { updateUser, deleteUser, 
    deleteUsers, getUser, 
    getUsers, blockUser,
    unblockUser };

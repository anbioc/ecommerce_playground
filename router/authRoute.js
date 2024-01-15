const { loginUser, handleRefreshToken, createUser, logout } = require('../controller/authController');

const {
    updateUser, deleteUser,
     deleteUsers, getUser, 
     getUsers, blockUser, 
     unblockUser } = require('../controller/userController');
     
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const userRouter = require('express').Router()



userRouter.post('/register', createUser);
userRouter.post('/login', loginUser);
userRouter.put('/logout', logout);
userRouter.get('/user', authMiddleware, getUser);
userRouter.get('/users', authMiddleware, isAdmin, getUsers);
userRouter.delete('/users', authMiddleware, isAdmin, deleteUsers);
userRouter.delete('/user/:email', authMiddleware, isAdmin, deleteUser);
userRouter.put('/user', authMiddleware, updateUser)
userRouter.put('/blockUser/:id/', authMiddleware, isAdmin, blockUser)
userRouter.put('/unblockuser/:id/', authMiddleware, isAdmin, unblockUser)
userRouter.get('/refresh' , handleRefreshToken)

module.exports = {userRouter};
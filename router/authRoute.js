const { loginUser, handleRefreshToken, createUser, logout } = require('../controller/authController');

const {
    updateUser, deleteUser,
     deleteUsers, getUser, 
     getUsers, blockUser, 
     unblockUser } = require('../controller/userController');
     
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const router = require('express').Router()



router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/logout', logout);
router.get('/user', authMiddleware, getUser);
router.get('/users', authMiddleware, isAdmin, getUsers);
router.delete('/users', authMiddleware, isAdmin, deleteUsers);
router.delete('/user/:email', authMiddleware, isAdmin, deleteUser);
router.put('/user', authMiddleware, updateUser)
router.put('/blockUser/:id/', authMiddleware, isAdmin, blockUser)
router.put('/unblockuser/:id/', authMiddleware, isAdmin, unblockUser)
router.get('/refresh' , handleRefreshToken)

module.exports = router;
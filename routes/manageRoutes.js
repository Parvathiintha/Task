const express = require('express');
const { register, login, logout } = require('../Controller/authcontroller');
const { authenticate,authorize } = require('../Middleware/middle');

const { getAllUsers,getUsers,deleteUser } = require('../Controller/userController.cjs');
const { createTask, getTasks, updateTask ,} = require('../Controller/taskController');
const router = express.Router();
//auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);

//userroutes
router.get('/users', authenticate, getAllUsers);
router.patch('/update/:id', authenticate ,updateTask);
router.get('/getUsers', authenticate , getUsers);
//delete user

router.delete('/deleteUser/:id', authenticate , deleteUser)


router.post('/create', authenticate, createTask);
router.get('/tasks',authenticate , authorize,getTasks);
router.patch('/:id', authenticate ,updateTask);

module.exports = router;




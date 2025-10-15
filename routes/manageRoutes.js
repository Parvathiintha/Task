const express = require('express');
const { register, login, logout } = require('../Controller/authcontroller');
const { authenticateToken,authorize } = require('../Middleware/middle');

const { getAllUsers,getUsers,deleteUser ,} = require('../Controller/userController.js');
const { createTask, getTasks, updateTask ,deleteTask} = require('../Controller/taskController');
const router = express.Router();
//auth routes
router.post('/register', register);
router.post('/login', login);
// router.post('/logout', authenticate, logout);

//userroutes
router.get('/users', authenticateToken, getAllUsers);

router.patch('/update/:id', authenticateToken ,updateTask);
router.get('/getUsers', authenticateToken , getUsers);
router.delete('/deleteUser/:id', authenticateToken , deleteUser)

//taskroutes
router.post('/create', authenticateToken, createTask);
router.get('/tasks',authenticateToken , authorize("admin"),getTasks);
router.patch('/updatetask/:id', authenticateToken,updateTask);
router.delete('/delete/:id', authenticateToken, deleteTask);

module.exports = router;




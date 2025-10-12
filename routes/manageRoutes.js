const express = require('express');
const { register, login } = require('../Controller/authcontroller');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

//user routes

const { getAllUsers, updateUser } = require('../Controller/userController');
const { authenticate } = require('../Middleware/middle');

const { createTask, getTasks, updateTask } = require('../Controller/taskController');
router.get('/users', authenticate, getAllUsers);
router.patch('/update/:id', authenticate ,updateTask);
//task 


 
router.post('/create', authenticate, createTask);

router.get('/tasks',authenticate ,getTasks);
router.patch('/:id', authenticate ,updateTask);

module.exports = router;




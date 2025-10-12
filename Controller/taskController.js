const Task = require('../Models/taskModel');
const User = require('../Models/UserModel');
//create task
exports.createTask = async (req, res) => {
  const { title, description, assignedTo, priority, dueDate } = req.body;
 const assignee= await User.findById(assignedTo);

  if (!assignee) return res.status(404).json({ message: 'Assignee not found' });
  // if (req.user.role === 'manager' && !req.user.team.includes(assignedTo))
  //   return res.status(403).json({ message: 'You can assign only to your team' });

  const task = await Task.create({
    title,
    description,
    assignedTo,
    assignedBy: req.user._id,
    priority,
    dueDate,
    createdBy: req.user._id,
    updatedBy: req.user._id
}); 

  res.status(201).json(task);
};
//get task
exports.getTasks = async (req, res) => {
  let filter = { isActive: true };

  if (req.user.role === 'employee') filter.assignedTo = req.user._id;
 if (req.user.role === 'manager') filter.$or = [{ assignedBy: req.user._id }, { assignedTo: { $in: req.user.team } }];

  const tasks = await Task.find(filter).populate('assignedTo assignedBy', 'username role');
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (req.user.role === 'employee' && String(task.assignedTo) !== String(req.user._id))
    return res.status(403).json({ message: 'Not your task' });

  Object.assign(task, req.body);
  task.updatedBy = req.user._id;
  await task.save();

  res.json({ message: 'Task updated', task });
};
//admin
exports.updateTaskByEmployee = async (req, res) => {
  try {
    //  Find the task by ID
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role-based access control
    // Employees can only edit their own tasks
    if (
      req.user.role === 'employee' &&
      String(task.assignedTo) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not your task' });
    }
    Object.assign(task, req.body);
    task.updatedBy = req.user._id;
    await task.save();
    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

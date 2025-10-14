const Task = require('../Models/taskModel');
const User = require('../Models/UserModel');
//create task
exports.createTask = async (req, res) => {
  const { title, description, assignedTo, priority, dueDate  } = req.body;
 const assignee= await User.findById(assignedTo); 
 if(req.user.role!=='admin'&& req.user.role!=='manager')
  return res.status(403).json({ message: 'Only admin or manager can create tasks' });

  if (!assignee) return res.status(404).json({ message: 'Assignee not found' });
   if (req.user.role === 'manager' && !req.user.team.includes(assignedTo))
   return res.status(403).json({ message: 'You can assign only to your team' });

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

//update task

    exports.updateTask  = async(req,res) =>{
    try{
        const {id} = req.params;
        const {title , description , assignedTo , status , priority , dueDate} = req.body;
        const updatedTaskData = {title , description , assignedTo , status , priority , dueDate};

        const task = await Task.findById(id);
        if(!task){
            return res.status(404).json({message : "Task Not Found"})
        }

        if(req.user.role === "admin"){
            const updateTask = Task.findByIdAndUpdate(id , updatedTaskData , {new:true});
            return res.status(401).json({message : "Task Updated Success" , updateTask})
        }

        else if(req.user.role === "manager"){
          if(task.assignedBy != req.user.id){
            return res.status(403).json({message : "Access Denied only manager is accessed"})
          }

          const updateTask = Task.findByIdAndUpdate(id , updatedTaskData , {new:true});
            return res.status(401).json({message : "Task Updated Success" , updateTask})
        }

        else if(req.user.role === "employee"){
            if(task.assignedTo != req.user.id){
                return res.status(403).json({ message: "Access Denied You can only update your task" });
            }

            const updateTask =  await Task.findByIdAndUpdate(id, { status }, { new: true });
            return res.status(401).json({message : "Task Updated Success" , updateTask})
        }

        else {
             return res.status(403).json({ message: "No Role" });
        }
        
    }
    catch(err){
        res.status(500).json({ message: "Internal Server Error" });
    }
}
exports.deleteTask  = async(req,res)=>{
    try{
        const  {id} = req.params;
        const task = await Task.findById(id);
        if(!task){
            return res.status(404).json({message : "Task Not Found"});
        }

        if(req.user.role === "admin"){
            task.isDeleted = true;
            await task.save();
            return res.status(200).json({message : "Deleted Success by admin"})
        }

        else if(req.user.role === "manager"){
            if(task.assignedBy != req.user.id){
                return res.status(401).json({message : "Access Denied can not delete"})
            }

            task.isDeleted = true;
            await task.save();
            return res.status(200).json({message : "Deleted Success By Manager"})
        }

        else if(req.user.role === "employee"){
            return res.status(403).json({message : "Employee cannot delete"})
        }
        else{
            return res.status(403).json({message : "No Role"})
        }
    }
    catch(err){
        res.status(500).json({ message: "Internal Server Error" });
    }

}
    const mongoose = require('mongoose');
    const TaskSchema = new mongoose.Schema({
    title: {
        type: String, required: true 
    },
    description: String,


    assignedTo:
    { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },

    assignedBy: 
    {
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },

    status:
    { 
    type: String, enum: ['open', 'in_progress', 'completed'], default: 'open'
    },

    priority:
    { 
    type: String, enum: ['low', 'medium', 'high'], default: 'medium' 
    },
    dueDate: Date,

    isActive:
    {
        type: Boolean, default: true
    },

    createdBy: 
    {
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },
    updatedBy:
    {
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }
    },
    { timestamps: true });

    module.exports = mongoose.model('Task', TaskSchema);
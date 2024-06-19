import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Low' 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'In-Progress', 'Completed'],
    default: 'Pending' 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true
});

const Tasks = mongoose.model('Task', taskSchema);

export  {Tasks}; 

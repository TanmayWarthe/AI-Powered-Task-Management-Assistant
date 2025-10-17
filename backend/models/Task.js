const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  // === BASIC INFORMATION (Required) ===
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  // === BASIC INFORMATION (Optional) ===
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'study', 'health', 'shopping', 'finance', 'other'],
    default: 'personal'
  },

  // === STATUS & PRIORITY ===
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed', 'cancelled'],
    default: 'todo',
    required: true
  },
  completed: {
    type: Boolean,
    default: false,
    required: true
  },
  completionDate: {
    type: Date
  },
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  // === TIME MANAGEMENT ===
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  startDate: {
    type: Date
  },
  estimatedHours: {
    type: Number,
    min: 0,
    max: 100,
    default: 1
  },
  actualHours: {
    type: Number,
    min: 0,
    default: 0
  },
  reminder: {
    type: Date
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'none'],
    default: 'none'
  },

  // === ORGANIZATION & RELATIONSHIPS ===
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  project: {
    type: String,
    trim: true
  },
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],

  // === AI & ANALYTICS ===
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  energyLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  focusRequired: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  aiPriorityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },

  // === ADDITIONAL FEATURES ===
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [{
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
  }],
  timeSlots: [{
    date: Date,
    startTime: String,
    endTime: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],

  // === METADATA ===
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastViewed: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

// Update the updatedAt field before saving
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt field before updating
taskSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
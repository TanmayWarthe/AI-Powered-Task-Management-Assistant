const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// All routes are protected - require authentication
router.use(authMiddleware);

// === CREATE A NEW TASK ===
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      dueDate,
      startDate,
      estimatedHours,
      reminder,
      tags,
      project,
      difficulty,
      energyLevel,
      focusRequired
    } = req.body;

    // Create new task
    const task = new Task({
      title,
      description,
      category,
      priority,
      dueDate,
      startDate,
      estimatedHours,
      reminder,
      tags,
      project,
      difficulty,
      energyLevel,
      focusRequired,
      userId: req.user._id // From auth middleware
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating task'
    });
  }
});

// === GET ALL TASKS FOR USER ===
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      category, 
      search,
      sortBy = 'dueDate',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    let filter = { userId: req.user._id };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(filter).sort(sort);

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
});

// === GET SINGLE TASK BY ID ===
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      task
    });

  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task'
    });
  }
});

// === UPDATE A TASK ===
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { 
        _id: req.params.id, 
        userId: req.user._id 
      },
      req.body,
      { 
        new: true, // Return updated document
        runValidators: true 
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task'
    });
  }
});

// === DELETE A TASK ===
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task'
    });
  }
});

// === UPDATE TASK STATUS ===
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const task = await Task.findOneAndUpdate(
      { 
        _id: req.params.id, 
        userId: req.user._id 
      },
      { 
        status,
        ...(status === 'completed' && { 
          completed: true,
          completionDate: new Date(),
          completionPercentage: 100 
        }),
        ...(status !== 'completed' && { 
          completed: false,
          completionPercentage: 0 
        })
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: `Task marked as ${status}`,
      task
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task status'
    });
  }
});

// === GET TASK STATISTICS ===
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] } },
          highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          criticalPriority: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } }
        }
      }
    ]);

    const statusStats = await Task.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || { totalTasks: 0, completedTasks: 0, highPriority: 0, criticalPriority: 0 },
      statusStats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

module.exports = router;
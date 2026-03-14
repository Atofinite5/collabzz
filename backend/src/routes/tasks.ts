import { Router, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Task from '../models/Task';
import auth from '../middleware/auth';
import { AuthRequest, TaskStatus } from '../types';

const router = Router();

// All routes require authentication
router.use(auth);

// GET /api/tasks — fetch all tasks (with optional search/filter)
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, status } = req.query;

    const filter: Record<string, unknown> = {};

    if (status && ['todo', 'in-progress', 'done'].includes(status as string)) {
      filter.status = status;
    }

    if (search && typeof search === 'string' && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter)
      .populate('creator', 'name email')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      message: 'Tasks fetched successfully',
      data: tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks',
    });
  }
});

// POST /api/tasks — create a task
router.post(
  '/',
  [
    body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required (max 100 chars)'),
    body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description is required (max 500 chars)'),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'done'])
      .withMessage('Status must be: todo, in-progress, or done'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          data: errors.array(),
        });
        return;
      }

      const { title, description, status } = req.body;

      const task = await Task.create({
        title,
        description,
        status: status || 'todo',
        creator: req.user!._id,
      });

      const populated = await task.populate('creator', 'name email');

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: populated,
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error creating task',
      });
    }
  }
);

// PUT /api/tasks/:id — update a task (only creator)
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title max 100 chars'),
    body('description').optional().trim().isLength({ min: 1, max: 500 }).withMessage('Description max 500 chars'),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'done'])
      .withMessage('Status must be: todo, in-progress, or done'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          data: errors.array(),
        });
        return;
      }

      const task = await Task.findById(req.params.id);

      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found',
        });
        return;
      }

      if (task.creator.toString() !== req.user!._id) {
        res.status(403).json({
          success: false,
          message: 'You can only edit tasks you created',
        });
        return;
      }

      const { title, description, status } = req.body;

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (status !== undefined) task.status = status as TaskStatus;

      await task.save();
      const updated = await task.populate('creator', 'name email');

      res.json({
        success: true,
        message: 'Task updated successfully',
        data: updated,
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error updating task',
      });
    }
  }
);

// PATCH /api/tasks/:id/status — update only status (for drag-and-drop, creator only)
router.patch(
  '/:id/status',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('status')
      .isIn(['todo', 'in-progress', 'done'])
      .withMessage('Status must be: todo, in-progress, or done'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          data: errors.array(),
        });
        return;
      }

      const task = await Task.findById(req.params.id);

      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found',
        });
        return;
      }

      if (task.creator.toString() !== req.user!._id) {
        res.status(403).json({
          success: false,
          message: 'You can only update tasks you created',
        });
        return;
      }

      task.status = req.body.status as TaskStatus;
      await task.save();
      const updated = await task.populate('creator', 'name email');

      res.json({
        success: true,
        message: 'Task status updated',
        data: updated,
      });
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error updating task status',
      });
    }
  }
);

// DELETE /api/tasks/:id — delete a task (only creator)
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          data: errors.array(),
        });
        return;
      }

      const task = await Task.findById(req.params.id);

      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found',
        });
        return;
      }

      if (task.creator.toString() !== req.user!._id) {
        res.status(403).json({
          success: false,
          message: 'You can only delete tasks you created',
        });
        return;
      }

      await task.deleteOne();

      res.json({
        success: true,
        message: 'Task deleted successfully',
        data: { id: req.params.id },
      });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error deleting task',
      });
    }
  }
);

export default router;

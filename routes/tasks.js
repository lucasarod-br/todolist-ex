const express = require('express');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../services/taskService');
const {body, validationResult} = require('express-validator');
const { isAuthenticated } = require('../middlewares/auth');


const router = express.Router();
router.post('/', isAuthenticated, [
  body('title').notEmpty().withMessage('Title is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { userId } = req.payload;
  const { title, description } = req.body;
  createTask({ title, description, userId })
    .then((task) => res.status(201).json(task))
    .catch((error) => res.status(500).json({ error: error.message }));
});

router.get('/', isAuthenticated, (req, res) => {
    const { userId } = req.payload;
  getTasks(userId)
    .then((tasks) => res.status(200).json(tasks))
    .catch((error) => res.status(500).json({ error: error.message }));
});

router.get('/:id', isAuthenticated, (req, res) => {
  const { userId } = req.payload;
  const { id } = req.params;
  getTaskById(id)
    .then((task) => {
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      if (task.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      res.status(200).json(task);
    })
    .catch((error) => res.status(500).json({ error: error.message }));
});

router.put('/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { title, description } = req.body;
  console.log(req.body);
  const { userId } = req.payload;
  console.log(userId);
  getTaskById(id)
  .then((task) => {
    if (task.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    updateTask(id, { title, description, userId })
      .then((task) => {
        console.log(task);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json(task);
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}).catch((error) => res.status(500).json({ error: error.message }));
});

router.delete('/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { userId } = req.payload;
  const task = getTaskById(id).then((task) => {
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (task.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    deleteTask(id)
      .then(() => res.status(204).send())
      .catch((error) => res.status(500).json({ error: error.message }));
  }).catch((error) => res.status(500).json({ error: error.message }));
});

module.exports = router;

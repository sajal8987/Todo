const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes under this require auth
router.use(auth);

// Create
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Title and description are required' });
    const todo = await Todo.create({ user: req.user._id, title, description });
    return res.status(201).json({ todo });
  } catch (err) {
    console.error('Create todo error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Read all for user, with optional status filter
router.get('/', async (req, res) => {
  try {
    const { status } = req.query; // All | Pending | Completed
    const query = { user: req.user._id };
    if (status && (status === 'Pending' || status === 'Completed')) {
      query.status = status;
    }
    const todos = await Todo.find(query).sort({ createdAt: -1 });
    const counts = await Todo.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const counter = counts.reduce((acc, c) => { acc[c._id] = c.count; return acc; }, { Pending: 0, Completed: 0 });
    return res.json({ todos, counter });
  } catch (err) {
    console.error('List todo error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const todo = await Todo.findOne({ _id: id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (status !== undefined && (status === 'Pending' || status === 'Completed')) todo.status = status;

    await todo.save();
    return res.json({ todo });
  } catch (err) {
    console.error('Update todo error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Toggle status convenience
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    todo.status = todo.status === 'Pending' ? 'Completed' : 'Pending';
    await todo.save();
    return res.json({ todo });
  } catch (err) {
    console.error('Toggle todo error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete todo error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

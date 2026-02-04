const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending', index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Todo', todoSchema);

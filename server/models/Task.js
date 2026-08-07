import mongoose from 'mongoose';

const { Schema } = mongoose;

const TaskSchema = new Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'review', 'done', 'blocked', 'reconsideration'],
    default: 'todo'
  },
  assignee: { type: String, default: '' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  last_summary: { type: String, default: '' },
  reconsideration_reason: { type: String, default: '' },
  confidence: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  last_updated: { type: Date, default: Date.now }
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);

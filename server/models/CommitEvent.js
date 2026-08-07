import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommitEventSchema = new Schema({
  sha: { type: String, required: true, unique: true },
  message: String,
  matched_task_id: { type: Schema.Types.ObjectId, ref: 'Task' },
  confidence: { type: String, enum: ['high', 'medium', 'low'] },
  status_update: String,
  summary: String,
  author: String,
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.CommitEvent || mongoose.model('CommitEvent', CommitEventSchema);

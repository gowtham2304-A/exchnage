import { connectDb } from './db.js';
import TaskModel from './models/Task.js';

async function seed() {
  await connectDb();

  const existing = await TaskModel.find().limit(1).lean();
  if (existing && existing.length) {
    console.log('[Seed] Tasks already exist; skipping seeding.');
    const all = await TaskModel.find().lean();
    console.log('[Seed] Current tasks:', all);
    process.exit(0);
  }

  const tasks = [
    { title: 'Implement user authentication', status: 'todo', assignee: 'Khidmat', priority: 'high' },
    { title: 'Create Kanban board UI', status: 'in_progress', assignee: 'Vansh', priority: 'medium' },
    { title: 'Add GitHub poller', status: 'review', assignee: '', priority: 'high' },
    { title: 'LLM commit analyzer integration', status: 'todo', assignee: '', priority: 'high' }
  ];

  const created = await TaskModel.insertMany(tasks);
  console.log('[Seed] Inserted tasks:', created.map(t => ({ id: t._id.toString(), title: t.title })));
  const all = await TaskModel.find().lean();
  console.log('[Seed] All tasks now:', all);
  process.exit(0);
}

seed().catch(err => {
  console.error('[Seed] Error:', err.message);
  process.exit(1);
});

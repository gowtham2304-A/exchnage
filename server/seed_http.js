import fetch from 'node-fetch';

const tasks = [
  { title: 'Implement user authentication', status: 'todo', assignee: 'Khidmat', priority: 'high' },
  { title: 'Create Kanban board UI', status: 'in_progress', assignee: 'Vansh', priority: 'medium' },
  { title: 'Add GitHub poller', status: 'review', assignee: '', priority: 'high' },
  { title: 'LLM commit analyzer integration', status: 'todo', assignee: '', priority: 'high' }
];

async function seed() {
  for (const t of tasks) {
    const res = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t)
    });
    const json = await res.json();
    console.log('Created:', json.task ? json.task.title : json);
  }
}

seed().catch(err => { console.error(err); process.exit(1); });

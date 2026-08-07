export const COLUMNS = [
  { id: 'todo', title: 'TO DO', max: null },
  { id: 'in_progress', title: 'IN PROGRESS', max: 3 },
  { id: 'review', title: 'IN REVIEW', max: null },
  { id: 'done', title: 'DONE', max: null },
  { id: 'reconsideration', title: 'RECONSIDERATION', max: null },
];

export const TEAM_MEMBERS = [
  { id: 'khidmat', name: 'Khidmat', role: 'Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { id: 'vansh', name: 'Vansh', role: 'Developer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
];

import mongoose from 'mongoose';
import TaskModel from './models/Task.js';
import CommitEventModel from './models/CommitEvent.js';

class Store {
  constructor() {
    this.tasks = [];
    this.activityLog = [];
    this.processedSHAs = new Set();
    this.useDb = !!process.env.MONGODB_URI;
  }

  async getTasks() {
    if (this.useDb && mongoose.connection && mongoose.connection.readyState) {
      return TaskModel.find().sort({ last_updated: -1 }).lean();
    }
    return this.tasks;
  }

  async getActivityLog() {
    if (this.useDb && mongoose.connection && mongoose.connection.readyState) {
      return CommitEventModel.find().sort({ created_at: -1 }).lean();
    }
    return this.activityLog;
  }

  async addTask(task) {
    if (this.useDb && mongoose.connection && mongoose.connection.readyState) {
      const t = await TaskModel.create({ ...task, last_updated: new Date() });
      return t.toObject();
    }
    this.tasks.unshift(task);
    return task;
  }

  async clearTasks() {
    if (this.useDb && mongoose.connection && mongoose.connection.readyState) {
      await TaskModel.deleteMany({});
      await CommitEventModel.deleteMany({});
      this.processedSHAs.clear();
      return;
    }
    this.tasks = [];
    this.activityLog = [];
    this.processedSHAs.clear();
  }

  async updateTaskStatus(taskId, updates) {
    if (this.useDb && mongoose.connection && mongoose.connection.readyState) {
      const updated = await TaskModel.findByIdAndUpdate(taskId, { ...updates, last_updated: new Date() }, { new: true }).lean();
      return updated;
    }

    let updatedTask = null;
    this.tasks = this.tasks.map(t => {
      if (t.id === taskId) {
        updatedTask = {
          ...t,
          ...updates,
          last_updated: new Date().toISOString()
        };
        return updatedTask;
      }
      return t;
    });
    return updatedTask;
  }

  async addActivityLog(logEntry) {
    if (logEntry.sha) {
      this.processedSHAs.add(logEntry.sha);
    }
    if (this.useDb && mongoose.connection && mongoose.connection.readyState) {
      await CommitEventModel.create({
        sha: logEntry.sha,
        message: logEntry.message,
        matched_task_id: logEntry.matchedTaskId || null,
        confidence: logEntry.confidence,
        status_update: logEntry.statusShift,
        summary: logEntry.summary,
        author: logEntry.author,
        created_at: logEntry.timestamp ? new Date(logEntry.timestamp) : new Date()
      });
      return;
    }
    this.activityLog.unshift(logEntry);
  }

  hasProcessedSHA(sha) {
    return this.processedSHAs.has(sha);
  }
}

export const store = new Store();

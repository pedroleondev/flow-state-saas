export type TaskType = 'PENSAR' | 'RESPONDER' | 'EXECUTAR';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  duration: number; // estimated duration in minutes
  elapsedTime: number; // banked time in seconds (accumulated from previous sessions)
  lastStartedAt?: number; // timestamp when the current session started (if running)
  isRunning: boolean; // current state
  person?: string;
  deadline?: number; // timestamp (optional)
  description?: string;
  status: 'TODO' | 'DONE';
  createdAt: number;
}

export type TimeSlot = 15 | 30 | 45 | 60 | 90;

export interface Metrics {
  totalOpen: number;
  totalDone: number;
  totalTimeSpent: number; // in minutes
  avgTimePerTask: number;
}
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskType } from '../types';
import { supabase } from '../lib/supabase';

interface Notification {
  message: string;
  type: 'success' | 'error';
  action?: {
    label: string;
    path: string;
    filterType?: TaskType;
  };
}

interface AddTaskResult {
  success: boolean;
  message?: string;
}

interface AddTaskOptions {
  showToast?: boolean;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status' | 'elapsedTime' | 'isRunning'>, options?: AddTaskOptions) => Promise<AddTaskResult>;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  toggleTaskTimer: (id: string) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  isLoading: boolean;
  notification: Notification | null;
  clearNotification: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const LIMITS: Record<TaskType, number> = {
  EXECUTAR: 7,
  PENSAR: 10,
  RESPONDER: 15
};

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Analisar proposta de parceria',
    type: 'PENSAR',
    duration: 60,
    elapsedTime: 0,
    isRunning: false,
    status: 'TODO',
    createdAt: Date.now(),
    deadline: Date.now() + 7200000 // + 2 hours
  },
  {
    id: '2',
    title: 'Responder email do João sobre projeto',
    type: 'RESPONDER',
    duration: 15,
    elapsedTime: 0,
    isRunning: false,
    person: 'João',
    status: 'TODO',
    createdAt: Date.now(),
    deadline: Date.now() + 7200000
  },
  {
    id: '3',
    title: 'Criar apresentação para cliente',
    type: 'EXECUTAR',
    duration: 90,
    elapsedTime: 1200, // 20 mins banked
    isRunning: false,
    status: 'TODO',
    createdAt: Date.now(),
    deadline: Date.now() + 7200000
  },
  {
    id: '4',
    title: 'Estruturar novo serviço',
    type: 'PENSAR',
    duration: 45,
    elapsedTime: 0,
    isRunning: false,
    status: 'TODO',
    createdAt: Date.now(),
    deadline: Date.now() + 7200000
  },
  {
    id: '5',
    title: 'Estruturar Agente Comportamental',
    type: 'PENSAR',
    duration: 30,
    elapsedTime: 0,
    isRunning: false,
    person: 'Michele',
    status: 'TODO',
    createdAt: Date.now(),
    deadline: Date.now() + 7200000
  },
  {
    id: '6',
    title: 'Backdrop Feijoada',
    type: 'EXECUTAR',
    duration: 60,
    elapsedTime: 0,
    isRunning: false,
    person: 'Liza',
    status: 'TODO',
    createdAt: Date.now(),
    deadline: Date.now() + 10800000
  },
  {
    id: '7',
    title: 'Estruturar Lançamento',
    type: 'EXECUTAR',
    duration: 90,
    elapsedTime: 0,
    isRunning: false,
    person: 'Roberta',
    status: 'TODO',
    createdAt: Date.now(),
    deadline: Date.now() + 10800000
  },
  {
    id: '8',
    title: 'Email de Follow-up',
    type: 'RESPONDER',
    duration: 5,
    elapsedTime: 300,
    isRunning: false,
    status: 'DONE',
    createdAt: Date.now() - 100000,
  }
];

// Mappers para converter snake_case (DB) <-> camelCase (App)
const fromDb = (dbTask: any): Task => ({
  id: dbTask.id,
  title: dbTask.title,
  type: dbTask.type as TaskType,
  duration: dbTask.duration,
  elapsedTime: dbTask.elapsed_time,
  lastStartedAt: dbTask.last_started_at || undefined,
  isRunning: dbTask.is_running,
  person: dbTask.person || undefined,
  deadline: dbTask.deadline || undefined,
  description: dbTask.description || undefined,
  status: dbTask.status as 'TODO' | 'DONE',
  createdAt: dbTask.created_at
});

const toDb = (task: Partial<Task>) => {
  const dbObj: any = {};
  if (task.id !== undefined) dbObj.id = task.id;
  if (task.title !== undefined) dbObj.title = task.title;
  if (task.type !== undefined) dbObj.type = task.type;
  if (task.duration !== undefined) dbObj.duration = task.duration;
  if (task.elapsedTime !== undefined) dbObj.elapsed_time = task.elapsedTime;
  if (task.lastStartedAt !== undefined) dbObj.last_started_at = task.lastStartedAt;
  if (task.isRunning !== undefined) dbObj.is_running = task.isRunning;
  if (task.person !== undefined) dbObj.person = task.person;
  if (task.deadline !== undefined) dbObj.deadline = task.deadline;
  if (task.description !== undefined) dbObj.description = task.description;
  if (task.status !== undefined) dbObj.status = task.status;
  if (task.createdAt !== undefined) dbObj.created_at = task.createdAt;
  // Handle explicit nulls for optional fields if needed, but undefined is usually skipped in patches
  return dbObj;
};

export const TaskProvider = ({ children }: { children?: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Load tasks from Supabase and Seed if empty
  useEffect(() => {
    const fetchAndSeedTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching tasks:', error);
          return;
        }

        if (data && data.length > 0) {
          setTasks(data.map(fromDb));
        } else {
          // SEED DATA IF EMPTY
          console.log('Database empty, seeding initial tasks...');
          
          // Generate slightly different timestamps to maintain sort order
          const now = Date.now();
          const seedData = INITIAL_TASKS.map((t, index) => ({
             ...t,
             createdAt: now - (index * 1000)
          }));
          
          const { error: insertError } = await supabase
            .from('tasks')
            .insert(seedData.map(toDb));

          if (insertError) {
            console.error('Error seeding tasks:', insertError);
          } else {
            console.log('Seeding complete.');
            setTasks(seedData);
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSeedTasks();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const clearNotification = () => setNotification(null);

  const addTask = async (
    newTask: Omit<Task, 'id' | 'createdAt' | 'status' | 'elapsedTime' | 'isRunning'>, 
    options: AddTaskOptions = { showToast: true }
  ): Promise<AddTaskResult> => {
    
    // 1. LIMIT CHECK
    const typeCount = tasks.filter(t => t.type === newTask.type && t.status === 'TODO').length;
    const limit = LIMITS[newTask.type];

    if (typeCount >= limit) {
      const message = `Você já tem muitas demandas de ${newTask.type} abertas (${typeCount}). Finalize algumas para liberar espaço.`;
      
      if (options.showToast) {
        setNotification({
          message,
          type: 'error',
          action: {
            label: `Ver demandas de ${newTask.type}`,
            path: '/backlog',
            filterType: newTask.type
          }
        });
      }
      return { success: false, message };
    }

    // 2. CREATE TASK
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      status: 'TODO',
      elapsedTime: 0,
      isRunning: false
    };

    // Optimistic update
    setTasks((prev) => [task, ...prev]);

    // DB Insert
    const { error } = await supabase.from('tasks').insert(toDb(task));
    if (error) console.error('Error adding task:', error);
    
    return { success: true, message: 'Demanda criada com sucesso' };
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));

    // DB Update
    const { error } = await supabase.from('tasks').update(toDb(updates)).eq('id', id);
    if (error) console.error('Error updating task:', error);
  };

  const deleteTask = async (id: string) => {
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    // DB Delete
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) console.error('Error deleting task:', error);
  };

  const toggleTaskTimer = async (id: string) => {
    let newTaskState: Task | undefined;

    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;

      const now = Date.now();
      let updatedTask: Task;
      
      if (t.isRunning) {
        // PAUSE
        const deltaSeconds = t.lastStartedAt ? Math.floor((now - t.lastStartedAt) / 1000) : 0;
        updatedTask = {
          ...t,
          isRunning: false,
          elapsedTime: t.elapsedTime + deltaSeconds,
          lastStartedAt: undefined
        };
      } else {
        // RESUME
        updatedTask = {
          ...t,
          isRunning: true,
          lastStartedAt: now
        };
      }
      newTaskState = updatedTask;
      return updatedTask;
    }));

    // Sync to DB if we found the task
    if (newTaskState) {
      const dbPayload = toDb({
        isRunning: newTaskState.isRunning,
        elapsedTime: newTaskState.elapsedTime,
        lastStartedAt: newTaskState.lastStartedAt
      });
      if (newTaskState.lastStartedAt === undefined) {
         dbPayload.last_started_at = null;
      }

      const { error } = await supabase.from('tasks').update(dbPayload).eq('id', id);
      if (error) console.error('Error toggling timer:', error);
    }
  };

  const completeTask = async (id: string) => {
    let newTaskState: Task | undefined;

    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      
      let finalElapsed = t.elapsedTime;
      if (t.isRunning && t.lastStartedAt) {
         finalElapsed += Math.floor((Date.now() - t.lastStartedAt) / 1000);
      }

      const updatedTask = { 
        ...t, 
        status: 'DONE' as const, 
        isRunning: false, 
        elapsedTime: finalElapsed,
        lastStartedAt: undefined 
      };
      newTaskState = updatedTask;
      return updatedTask;
    }));

     if (newTaskState) {
       const dbPayload = toDb({
         status: 'DONE',
         isRunning: false,
         elapsedTime: newTaskState.elapsedTime,
         lastStartedAt: undefined
       });
       dbPayload.last_started_at = null;

       const { error } = await supabase.from('tasks').update(dbPayload).eq('id', id);
       if (error) console.error('Error completing task:', error);

       // SUCCESS FEEDBACK
       setNotification({
         message: `Demanda concluída: ${newTaskState?.title || 'Tarefa'} 🎉`,
         type: 'success'
       });
     }
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask, 
      completeTask, 
      toggleTaskTimer, 
      toggleDarkMode, 
      isDarkMode, 
      isLoading,
      notification,
      clearNotification
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
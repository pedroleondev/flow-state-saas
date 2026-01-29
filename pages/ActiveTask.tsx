import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { ArrowLeft, Clock, Pause, Play, Check, Zap, MessageSquare, Lightbulb } from '../components/Icon';

const ActiveTask = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { tasks, completeTask, toggleTaskTimer } = useTasks();
  const navigate = useNavigate();
  
  const task = tasks.find(t => t.id === taskId);
  
  // Local state ONLY for display purposes. 
  // Source of truth is always task.elapsedTime + (now - task.lastStartedAt)
  const [displaySeconds, setDisplaySeconds] = useState(0);

  // Update the display timer frequently
  useEffect(() => {
    if (!task) return;

    const calculateDisplayTime = () => {
      let currentTotal = task.elapsedTime;
      if (task.isRunning && task.lastStartedAt) {
        const delta = Math.floor((Date.now() - task.lastStartedAt) / 1000);
        currentTotal += delta;
      }
      setDisplaySeconds(currentTotal);
    };

    // Initial calc
    calculateDisplayTime();

    let interval: number | undefined;
    if (task.isRunning) {
      // Update UI every 500ms (smooth enough for seconds)
      // We do NOT modify the task state here, just the local display
      interval = window.setInterval(calculateDisplayTime, 500);
    }

    return () => clearInterval(interval);
  }, [task]);

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl mb-4">Tarefa não encontrada</p>
        <button onClick={() => navigate('/')} className="text-blue-500 hover:underline">Voltar</button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    completeTask(task.id);
    navigate('/dashboard'); // Go to Metrics (Dashboard) on complete
  };

  const handleBack = () => {
    // Rule 4.1: Voltar dentro de uma demanda -> Backlog (/backlog)
    navigate('/backlog');
  };

  const handleToggle = () => {
    toggleTaskTimer(task.id);
  };

  const getTaskIcon = () => {
     switch (task.type) {
       case 'EXECUTAR': return <Zap className="w-5 h-5" />;
       case 'RESPONDER': return <MessageSquare className="w-5 h-5" />;
       case 'PENSAR': return <Lightbulb className="w-5 h-5" />;
     }
  };

  const getColorClass = () => {
      switch (task.type) {
          case 'EXECUTAR': return 'text-green-500';
          case 'RESPONDER': return 'text-blue-500';
          case 'PENSAR': return 'text-yellow-500';
      }
  };

  return (
    <div className="h-full flex flex-col font-sans">
      <header className="w-full px-8 py-6">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Voltar</span>
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full -mt-20">
        <div className={`flex items-center gap-2 mb-8 ${task.isRunning ? 'animate-pulse' : ''} ${getColorClass()}`}>
          {getTaskIcon()}
          <span className="text-sm font-medium uppercase tracking-wide">{task.type}</span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-12 text-gray-900 dark:text-white">
          {task.title}
        </h1>

        <div className="flex flex-col items-center mb-16">
          <div className="text-7xl md:text-8xl lg:text-9xl font-mono font-light tracking-wider text-gray-900 dark:text-white mb-4 tabular-nums">
            {formatTime(displaySeconds)}
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-light">Estimativa: {task.duration} min</span>
          </div>
        </div>

        {/* Visual Progress Bar (Optional context for estimate) */}
        <div className="w-64 h-px bg-gray-200 dark:bg-gray-700 mb-16 relative overflow-hidden rounded-full">
           <div 
             className={`absolute left-0 top-0 h-full ${task.type === 'EXECUTAR' ? 'bg-green-500' : task.type === 'RESPONDER' ? 'bg-blue-500' : 'bg-yellow-500'} opacity-50 transition-all duration-1000 ease-linear`}
             style={{ width: `${Math.min(100, (displaySeconds / (task.duration * 60)) * 100)}%` }}
           ></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <button 
            onClick={handleToggle}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-3 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group"
          >
            {task.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span className="font-medium text-gray-900 dark:text-white">{task.isRunning ? 'Pausar' : 'Continuar'}</span>
          </button>
          
          <button 
            onClick={handleComplete}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-3 bg-primary hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white rounded-lg shadow-lg hover:shadow-xl transition-all group"
          >
            <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Concluir</span>
          </button>
        </div>
      </main>

      {/* Ambient Background Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden opacity-30 dark:opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full blur-3xl mix-blend-multiply filter"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-100 dark:bg-green-900 rounded-full blur-3xl mix-blend-multiply filter"></div>
      </div>
    </div>
  );
};

export default ActiveTask;
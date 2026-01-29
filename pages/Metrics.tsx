import React from 'react';
import { useTasks } from '../contexts/TaskContext';
import { ArrowLeft, Clock, CheckCircle, TrendingUp, BarChart2, MessageSquare, Lightbulb, Zap } from '../components/Icon';
import { useNavigate } from 'react-router-dom';

const Metrics = () => {
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const stats = React.useMemo(() => {
    const totalOpen = tasks.filter(t => t.status === 'TODO').length;
    const totalDone = tasks.filter(t => t.status === 'DONE').length;
    
    // Calculate actual time spent based on elapsedTime
    const totalTimeSpent = Math.round(tasks
      .filter(t => t.status === 'DONE')
      .reduce((acc, curr) => acc + (curr.elapsedTime / 60), 0)); // convert seconds to minutes

    const avgTime = totalDone > 0 ? Math.round(totalTimeSpent / totalDone) : 0;

    const byType = {
        RESPONDER: {
            open: tasks.filter(t => t.type === 'RESPONDER' && t.status === 'TODO').length,
            done: tasks.filter(t => t.type === 'RESPONDER' && t.status === 'DONE').length,
            spent: Math.round(tasks.filter(t => t.type === 'RESPONDER' && t.status === 'DONE').reduce((acc, curr) => acc + (curr.elapsedTime / 60), 0))
        },
        PENSAR: {
            open: tasks.filter(t => t.type === 'PENSAR' && t.status === 'TODO').length,
            done: tasks.filter(t => t.type === 'PENSAR' && t.status === 'DONE').length,
            spent: Math.round(tasks.filter(t => t.type === 'PENSAR' && t.status === 'DONE').reduce((acc, curr) => acc + (curr.elapsedTime / 60), 0))
        },
        EXECUTAR: {
            open: tasks.filter(t => t.type === 'EXECUTAR' && t.status === 'TODO').length,
            done: tasks.filter(t => t.type === 'EXECUTAR' && t.status === 'DONE').length,
            spent: Math.round(tasks.filter(t => t.type === 'EXECUTAR' && t.status === 'DONE').reduce((acc, curr) => acc + (curr.elapsedTime / 60), 0))
        }
    }

    return { totalOpen, totalDone, totalTimeSpent, avgTime, byType };
  }, [tasks]);

  return (
    <div className="max-w-5xl mx-auto w-full p-8 md:p-12 pb-24">
      {/* Header */}
      <div className="flex items-start mb-10">
        <button 
          onClick={() => navigate('/')}
          className="mt-1 p-1 mr-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-normal text-gray-900 dark:text-white mb-1">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 font-light">Visão analítica de execução</p>
        </div>
      </div>

      {/* Main Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: Open Tasks with Breakdown */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Demandas Abertas</span>
          </div>
          <div className="text-5xl font-light text-gray-900 dark:text-white mb-6">{stats.totalOpen}</div>
          
          <div className="grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400 mb-1">Executar</span>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <Zap className="w-3 h-3" />
                <span className="font-semibold">{stats.byType.EXECUTAR.open}</span>
              </div>
            </div>
            <div className="flex flex-col items-center border-l border-r border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-400 mb-1">Pensar</span>
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <Lightbulb className="w-3 h-3" />
                <span className="font-semibold">{stats.byType.PENSAR.open}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400 mb-1">Responder</span>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <MessageSquare className="w-3 h-3" />
                <span className="font-semibold">{stats.byType.RESPONDER.open}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Total Real Time (Completed) */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Tempo Real Total</span>
          </div>
          <div className="text-5xl font-light text-gray-900 dark:text-white mb-6">{stats.totalTimeSpent}m</div>
          
          <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-4 text-sm">
            <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
               <span>Executar</span>
               <span className="font-medium text-gray-900 dark:text-white">{stats.byType.EXECUTAR.spent}m</span>
            </div>
            <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
               <span>Pensar</span>
               <span className="font-medium text-gray-900 dark:text-white">{stats.byType.PENSAR.spent}m</span>
            </div>
            <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
               <span>Responder</span>
               <span className="font-medium text-gray-900 dark:text-white">{stats.byType.RESPONDER.spent}m</span>
            </div>
          </div>
        </div>

        {/* Card 3: Average Time (Real) */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart2 className="w-5 h-5 text-yellow-500" />
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Média / Tarefa</span>
          </div>
          <div className="text-5xl font-light text-gray-900 dark:text-white mb-6">{stats.avgTime}m</div>

           <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-4 text-sm">
            <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
               <span>Executar</span>
               <span className="font-medium text-gray-900 dark:text-white">
                 {stats.byType.EXECUTAR.done > 0 ? Math.round(stats.byType.EXECUTAR.spent / stats.byType.EXECUTAR.done) : 0}m
               </span>
            </div>
            <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
               <span>Pensar</span>
               <span className="font-medium text-gray-900 dark:text-white">
                 {stats.byType.PENSAR.done > 0 ? Math.round(stats.byType.PENSAR.spent / stats.byType.PENSAR.done) : 0}m
               </span>
            </div>
            <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
               <span>Responder</span>
               <span className="font-medium text-gray-900 dark:text-white">
                 {stats.byType.RESPONDER.done > 0 ? Math.round(stats.byType.RESPONDER.spent / stats.byType.RESPONDER.done) : 0}m
               </span>
            </div>
          </div>
        </div>

      </div>
      
      {/* Footer Info */}
      <div className="text-center text-sm text-gray-400 dark:text-gray-600">
        <p>Todos os tempos são baseados na execução real, não nas estimativas.</p>
      </div>

    </div>
  );
};

export default Metrics;
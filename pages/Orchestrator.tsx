import React, { useState, useRef } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { useNavigate } from 'react-router-dom';
import { Clock, Search, Plus, Play, Calendar, ArrowLeft, CheckCircle, X } from '../components/Icon';
import { Task, TaskType } from '../types';

const Orchestrator = () => {
  const { tasks, addTask } = useTasks();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [suggestedTasks, setSuggestedTasks] = useState<Task[] | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  
  // New state for inline feedback
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Quick Capture Logic (AI Parsing Simulation)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleCreateTask();
    }
  };

  const handleCreateTask = async () => {
     if(!inputValue.trim()) return;
     await parseAndAddTask(inputValue);
  }

  const parseAndAddTask = async (text: string) => {
    // Expected format: "Title, Person, Time" or just "Title"
    const parts = text.split(',').map(p => p.trim());
    
    let title = parts[0];
    let person = '';
    let duration = 30; // Default
    let type: TaskType = 'EXECUTAR'; // Default

    // Infer Type based on keywords
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('analisar') || lowerTitle.includes('pensar') || lowerTitle.includes('planejar') || lowerTitle.includes('estruturar')) {
      type = 'PENSAR';
    } else if (lowerTitle.includes('responder') || lowerTitle.includes('enviar') || lowerTitle.includes('retornar') || lowerTitle.includes('email')) {
      type = 'RESPONDER';
    } else if (lowerTitle.includes('escrever') || lowerTitle.includes('criar') || lowerTitle.includes('produzir') || lowerTitle.includes('fazer')) {
      type = 'EXECUTAR';
    }

    // Process other parts
    if (parts.length > 1) {
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        // Check if it looks like time (digits)
        if (/\d+/.test(part)) {
           const nums = part.match(/\d+/);
           if (nums) duration = parseInt(nums[0]);
        } else {
           // Assume person
           person = part;
        }
      }
    }

    // Use suppressToast: true to handle feedback locally
    const result = await addTask({
      title,
      type,
      duration,
      person,
      description: 'Criado via Quick Capture'
    }, { showToast: false });

    if (result.success) {
      setInputValue('');
      setFeedback({ text: 'Demanda criada com sucesso.', type: 'success' });
      // Auto-hide success message
      setTimeout(() => setFeedback(null), 3000);
    } else {
      // Error persists to guide user
      setFeedback({ text: result.message || 'Erro ao criar demanda', type: 'error' });
    }
  };

  // Orchestration Logic
  const handleTimeSelection = (minutes: number) => {
    setSelectedTime(minutes);
    const todoTasks = tasks.filter(t => t.status === 'TODO');
    
    // Filter fitting tasks
    let suitable = todoTasks.filter(t => t.duration <= minutes);
    
    // Sort by Priority (Rule 5)
    suitable.sort((a, b) => {
       if (a.deadline && b.deadline) return a.deadline - b.deadline;
       if (a.deadline && !b.deadline) return -1;
       if (!a.deadline && b.deadline) return 1;
       return b.createdAt - a.createdAt;
    });

    setSuggestedTasks(suitable);
  };

  const resetSelection = () => {
    setSuggestedTasks(null);
    setSelectedTime(null);
  };

  const timeOptions = [
    { label: '15 min', value: 15, sub: 'Uma tarefa rápida' },
    { label: '30 min', value: 30, sub: 'Foco moderado' },
    { label: '45 min', value: 45, sub: 'Sessão produtiva' },
    { label: '1 hora', value: 60, sub: 'Trabalho profundo' },
    { label: '90+ min', value: 90, sub: 'Imersão total' },
  ];

  // Render Suggestions View
  if (suggestedTasks !== null && selectedTime !== null) {
    return (
      <div className="h-full p-8 flex flex-col items-center max-w-4xl mx-auto">
        <div className="w-full flex items-center justify-between mb-8">
           <button onClick={resetSelection} className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-lg">Voltar</span>
           </button>
           <div className="text-right">
             <h2 className="text-2xl font-light text-gray-900 dark:text-white">{selectedTime} min</h2>
             <p className="text-sm text-gray-500">Tempo disponível</p>
           </div>
        </div>

        <h1 className="text-3xl font-light text-gray-800 dark:text-gray-100 mb-8 text-center">
           Sugestões para agora
        </h1>

        <div className="w-full space-y-4">
           {suggestedTasks.length === 0 ? (
             <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
               <p className="text-gray-500">Nenhuma tarefa cabe neste tempo.</p>
               <p className="text-sm text-gray-400 mt-2">Que tal criar uma tarefa rápida?</p>
             </div>
           ) : (
             suggestedTasks.map(task => (
               <div 
                 key={task.id}
                 onClick={() => navigate(`/active/${task.id}`)}
                 className={`bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition-all group relative ${task.deadline ? 'border-orange-200 dark:border-orange-900 ring-1 ring-orange-100 dark:ring-orange-900/30' : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
               >
                 {task.deadline && (
                    <div className="absolute -top-3 left-6 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      PRIORIDADE
                    </div>
                  )}

                 <div className="flex justify-between items-center">
                    <div>
                       <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{task.title}</h3>
                       <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                             <Clock className="w-4 h-4" />
                             {task.duration} min
                          </div>
                          {task.deadline && (
                            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                              <Calendar className="w-4 h-4" />
                              {new Date(task.deadline).toLocaleDateString()}
                            </div>
                          )}
                          <span className="uppercase text-xs font-bold tracking-wide px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{task.type}</span>
                       </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors">
                       <Play className="w-6 h-6 ml-1" />
                    </div>
                 </div>
               </div>
             ))
           )}
        </div>
      </div>
    )
  }

  // Default View (Home)
  return (
    <div className="h-full p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Header Title */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-light text-gray-800 dark:text-gray-100">Orquestrador</h1>
            <p className="text-gray-500 dark:text-gray-400 font-light mt-1">Transforme tempo em execução</p>
          </div>
        </div>

        {/* Quick Capture Input */}
        <div className="relative mb-20 group">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              className={`block w-full pl-12 pr-12 py-4 bg-white dark:bg-card-dark border-transparent focus:border-gray-300 dark:focus:border-gray-600 rounded-2xl shadow-sm text-gray-700 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 focus:ring-0 text-lg outline-none transition-all ${feedback?.type === 'error' ? 'ring-2 ring-red-100 dark:ring-red-900/30' : ''}`} 
              placeholder="Escrever roteiro, Roberta, 60min (Enter para salvar)" 
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                // Clear error on type
                if (feedback?.type === 'error') setFeedback(null);
              }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button 
              onClick={handleCreateTask}
              className="absolute inset-y-0 right-2 flex items-center"
            >
              <div className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg p-1 flex items-center justify-center transition-colors w-8 h-8">
                <Plus className="w-5 h-5" />
              </div>
            </button>
          </div>
          
          {/* Inline Feedback Message */}
          {feedback && (
             <div className={`absolute top-full left-0 mt-2 w-full flex items-center px-2 animate-in fade-in slide-in-from-top-1 ${feedback.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
               <span className="text-sm font-medium flex items-center gap-1.5">
                  {feedback.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  {feedback.text}
               </span>
             </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center space-y-8 mt-10">
          <div className="text-gray-400 dark:text-gray-500">
            <Clock className="w-10 h-10" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-light text-gray-700 dark:text-gray-200">Quanto tempo você tem agora?</h2>
            <p className="text-gray-400 dark:text-gray-500 font-light">Vou sugerir o que encaixa melhor</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full mt-8">
            {timeOptions.map((option) => (
              <button 
                key={option.value}
                onClick={() => handleTimeSelection(option.value)}
                className="bg-white dark:bg-card-dark hover:shadow-md transition-all p-6 rounded-2xl text-left border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group relative transform hover:-translate-y-1"
              >
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-green-400 transition-colors"></div>
                <h3 className="text-2xl font-light text-gray-800 dark:text-gray-100 mb-1">{option.label}</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                  {option.sub}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orchestrator;
import React, { useState, useMemo, useEffect } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { Task, TaskType } from '../types';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Clock, 
  User, 
  Play, 
  Pause,
  Lightbulb, 
  MessageSquare, 
  Zap,
  LayoutDashboard,
  Calendar,
  CheckCircle,
  Trash2
} from '../components/Icon';
import { TaskTypeIcon } from '../components/Icon';
import TaskModal from '../components/TaskModal';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [filterType, setFilterType] = useState<TaskType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // State for Delete Confirmation Modal
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Listen for navigation state to auto-filter (from Toast action)
  useEffect(() => {
    if (location.state && location.state.filterType) {
       setFilterType(location.state.filterType);
       // Clear state to avoid stuck filter
       window.history.replaceState({}, document.title);
    }
  }, [location]);

  const filteredTasks = useMemo(() => {
    const result = tasks.filter(task => {
      const matchesType = filterType === 'ALL' || task.type === filterType;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = task.status === 'TODO';
      return matchesType && matchesSearch && matchesStatus;
    });

    return result.sort((a, b) => {
      if (a.deadline && b.deadline) return a.deadline - b.deadline;
      if (a.deadline && !b.deadline) return -1;
      if (!a.deadline && b.deadline) return 1;
      return b.createdAt - a.createdAt;
    });
  }, [tasks, filterType, searchQuery]);

  const counts = useMemo(() => {
    const all = tasks.filter(t => t.status === 'TODO').length;
    const responder = tasks.filter(t => t.type === 'RESPONDER' && t.status === 'TODO').length;
    const pensar = tasks.filter(t => t.type === 'PENSAR' && t.status === 'TODO').length;
    const executar = tasks.filter(t => t.type === 'EXECUTAR' && t.status === 'TODO').length;
    return { all, responder, pensar, executar };
  }, [tasks]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setIsModalOpen(false);
    } else {
      const result = await addTask(taskData as any);
      if (result.success) {
        setIsModalOpen(false);
      }
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    setIsModalOpen(false);
  };

  // Trigger the delete modal instead of browser confirm
  const requestDelete = (id: string) => {
    setTaskToDelete(id);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const getTagStyles = (type: TaskType) => {
    switch (type) {
      case 'PENSAR': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'RESPONDER': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'EXECUTAR': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFilterButtonClass = (type: TaskType | 'ALL', active: boolean) => {
    const base = "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 border ";
    if (active) {
      return base + "bg-primary text-white border-transparent shadow-md";
    }
    return base + "bg-card-light dark:bg-card-dark border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <div className="mb-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Voltar</span>
        </button>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">Backlog</h1>
        <p className="text-gray-500 dark:text-gray-400">Todas as suas demandas</p>
      </div>

      <div className="mb-8 relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-11 pr-12 py-3.5 bg-card-light dark:bg-card-dark border border-transparent focus:border-gray-300 dark:focus:border-gray-600 rounded-2xl shadow-sm text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:ring-0 transition-all"
          placeholder="Análise do Instagram da Maria, pensar, 30..."
        />
        <button 
          onClick={handleCreate}
          className="absolute inset-y-0 right-2 flex items-center my-auto"
        >
          <div className="h-8 w-8 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5" />
          </div>
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button 
          onClick={() => setFilterType('ALL')}
          className={getFilterButtonClass('ALL', filterType === 'ALL')}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Todas</span>
          <span className={`px-1.5 py-0.5 rounded text-xs ml-1 ${filterType === 'ALL' ? 'bg-gray-700 bg-opacity-50' : 'bg-gray-100 dark:bg-gray-700'}`}>{counts.all}</span>
        </button>
        <button 
          onClick={() => setFilterType('RESPONDER')}
          className={getFilterButtonClass('RESPONDER', filterType === 'RESPONDER')}
        >
          <MessageSquare className={`w-4 h-4 ${filterType !== 'RESPONDER' ? 'text-blue-500' : ''}`} />
          <span>Responder</span>
          <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs ml-1 font-semibold text-gray-500 dark:text-gray-400">{counts.responder}</span>
        </button>
        <button 
          onClick={() => setFilterType('PENSAR')}
          className={getFilterButtonClass('PENSAR', filterType === 'PENSAR')}
        >
          <Lightbulb className={`w-4 h-4 ${filterType !== 'PENSAR' ? 'text-yellow-500' : ''}`} />
          <span>Pensar</span>
          <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs ml-1 font-semibold text-gray-500 dark:text-gray-400">{counts.pensar}</span>
        </button>
        <button 
          onClick={() => setFilterType('EXECUTAR')}
          className={getFilterButtonClass('EXECUTAR', filterType === 'EXECUTAR')}
        >
          <Zap className={`w-4 h-4 ${filterType !== 'EXECUTAR' ? 'text-green-500' : ''}`} />
          <span>Executar</span>
          <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs ml-1 font-semibold text-gray-500 dark:text-gray-400">{counts.executar}</span>
        </button>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div 
            key={task.id}
            className={`bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border transition-all relative pb-5 ${task.deadline && task.status === 'TODO' ? 'border-orange-200 dark:border-orange-900' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
          >
            {/* Rule 2: Admin Actions (Top-Right) */}
            <div className="absolute top-4 right-5 flex items-center gap-3 z-10">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(task);
                }}
                className="text-xs font-medium text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                Editar
              </button>
              <span className="text-gray-200 dark:text-gray-700 text-xs select-none">|</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  requestDelete(task.id);
                }}
                className="text-xs font-medium text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
              >
                Excluir
              </button>
            </div>

            {task.deadline && task.status === 'TODO' && (
              <div className="absolute -top-2 left-5 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 text-xs font-bold px-2 py-0.5 rounded shadow-sm z-20">
                PRIORIDADE
              </div>
            )}
            
            <div className="flex items-start justify-between p-5 pb-2">
              <div className="flex-1 pr-4"> 
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center justify-center p-1 rounded-md ${getTagStyles(task.type)}`}>
                    <TaskTypeIcon type={task.type} className="w-3.5 h-3.5" />
                  </span>
                  <span className={`text-xs font-bold tracking-wide uppercase ${getTagStyles(task.type).split(' ')[1]}`}>
                    {task.type}
                  </span>
                  {task.status === 'DONE' && (
                     <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 ml-2">
                       <CheckCircle className="w-3 h-3" /> Concluída
                     </span>
                  )}
                </div>
                
                <h3 className={`text-base font-semibold mb-3 ${task.status === 'DONE' ? 'text-gray-500 line-through dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                  {task.title}
                </h3>
                
                <div className="flex items-center flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className={`flex items-center gap-1 ${task.status === 'DONE' ? 'font-medium text-gray-700 dark:text-gray-300' : ''}`}>
                    <Clock className="w-4 h-4" />
                    <span>
                      {task.status === 'DONE' 
                        ? `Real: ${Math.round(task.elapsedTime / 60)} min`
                        : `${task.duration} min est.`
                      }
                    </span>
                  </div>

                  {task.person && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{task.person}</span>
                    </div>
                  )}
                  {task.deadline && task.status === 'TODO' && (
                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(task.deadline)}</span>
                    </div>
                  )}
                  
                  {(task.elapsedTime > 0 || task.isRunning) && task.status === 'TODO' && (
                     <div className="flex items-center gap-1.5 pl-2 border-l border-gray-300 dark:border-gray-600">
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-mono transition-colors ${task.isRunning ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                           {task.isRunning ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                           <span>{formatTime(task.elapsedTime + (task.isRunning && task.lastStartedAt ? Math.floor((Date.now() - task.lastStartedAt) / 1000) : 0))}</span>
                        </div>
                     </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Play Button (Bottom-Right, Primary Action) */}
            {task.status === 'TODO' && (
              <div className="absolute bottom-4 right-5 z-20">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/active/${task.id}`);
                  }}
                  className={`w-11 h-11 rounded-full text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg ${task.isRunning ? 'bg-green-500' : 'bg-primary dark:bg-white dark:text-black'}`}
                  title={task.isRunning ? 'Pausar' : 'Iniciar execução'}
                >
                  {task.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredTasks.length === 0 && (
           <div className="text-center py-12 text-gray-400">
             <p>Nenhuma tarefa encontrada.</p>
           </div>
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        initialData={editingTask}
      />

      {/* Delete Confirmation Modal (Pop-up) */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
           <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-xl max-w-sm w-full border border-gray-100 dark:border-gray-700 transform transition-all scale-100">
              <div className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                    <Trash2 className="w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Excluir demanda?</h3>
                 <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                   Esta ação é permanente e removerá a demanda da sua lista.
                 </p>
                 <div className="flex gap-3 w-full">
                    <button 
                      onClick={() => setTaskToDelete(null)} 
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={confirmDelete} 
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors"
                    >
                      Excluir
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
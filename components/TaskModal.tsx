import React, { useState, useEffect } from 'react';
import { Task, TaskType } from '../types';
import { X, Calendar, Trash2, Filter } from './Icon';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  onDelete?: (id: string) => void;
  initialData?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, onDelete, initialData }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    type: 'PENSAR',
    duration: 60,
    person: '',
    deadline: undefined,
    description: ''
  });

  const timestampToString = (ts?: number) => {
    if (!ts) return '';
    const date = new Date(ts);
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const stringToTimestamp = (str: string) => {
    if (!str) return undefined;
    return new Date(str).getTime();
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        type: 'PENSAR',
        duration: 60,
        person: '',
        deadline: undefined,
        description: ''
      });
    }
  }, [initialData, isOpen]);

  const timeOptions = [];
  for (let i = 5; i <= 120; i += 5) {
    timeOptions.push(i);
  }

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(formData);
  };

  const handleDelete = () => {
    if (onDelete && initialData?.id) {
      // Rule 3: Confirm before delete
      if (window.confirm("Tem certeza que deseja excluir esta demanda?")) {
        onDelete(initialData.id);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-card-dark w-full max-w-lg rounded-2xl shadow-2xl transform transition-all flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-2 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Editar demanda' : 'Nova demanda'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {/* Title */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
              placeholder="Ex: Analisar proposta..."
            />
          </div>

          {/* Type & Duration */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
              <div className="relative">
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as TaskType})}
                  className="appearance-none w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="PENSAR">Pensar</option>
                  <option value="EXECUTAR">Executar</option>
                  <option value="RESPONDER">Responder</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tempo estimado</label>
              <div className="relative">
                <select 
                   value={formData.duration}
                   onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  className="appearance-none w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  {timeOptions.map(min => (
                    <option key={min} value={min}>{min} min</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Person */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pessoa relacionada (opcional)</label>
            <input 
              type="text" 
              value={formData.person || ''}
              onChange={(e) => setFormData({...formData, person: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
              placeholder="Ex: Maria, João..."
            />
          </div>

          {/* Deadline */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prazo de entrega (opcional)</label>
            <div className="relative">
              <input 
                type="datetime-local" 
                value={timestampToString(formData.deadline)}
                onChange={(e) => setFormData({...formData, deadline: stringToTimestamp(e.target.value)})}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">Demandas com prazo têm prioridade máxima</p>
          </div>

          {/* Description */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações (opcional)</label>
            <div className="relative">
              <textarea 
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder-gray-400"
                placeholder="Detalhes adicionais..."
                rows={4}
              />
              <div className="absolute bottom-2 right-2 pointer-events-none">
                <Filter className="w-3 h-3 text-gray-400 rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 pt-2 shrink-0">
          {initialData ? (
            <button 
              onClick={handleDelete}
              className="flex items-center text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </button>
          ) : <div></div>}
          
          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              className="px-5 py-2 text-sm font-medium text-white bg-primary hover:bg-gray-800 rounded-lg shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
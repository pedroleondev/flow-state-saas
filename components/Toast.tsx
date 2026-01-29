import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { X, CheckCircle, ArrowLeft } from './Icon';

export const Toast = () => {
  const { notification, clearNotification } = useTasks();
  const navigate = useNavigate();

  useEffect(() => {
    if (notification && notification.type === 'success') {
      const timer = setTimeout(() => {
        clearNotification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  const handleAction = () => {
    if (notification.action) {
      // If we need to pass state (like filterType), we can use the state prop in navigate
      navigate(notification.action.path, { state: { filterType: notification.action.filterType } });
      clearNotification();
    }
  };

  const isError = notification.type === 'error';

  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center w-full max-w-md px-4 animate-in slide-in-from-top-4 duration-300`}>
      <div className={`w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border ${isError ? 'border-red-100 dark:border-red-900/50' : 'border-green-100 dark:border-green-900/50'} p-4 flex items-start gap-3`}>
        <div className={`mt-0.5 rounded-full p-1 ${isError ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
          {isError ? <X className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {notification.message}
          </p>
          
          {notification.action && (
            <button 
              onClick={handleAction}
              className="mt-2 text-xs font-semibold text-primary hover:underline dark:text-blue-400 flex items-center gap-1"
            >
              {notification.action.label} <ArrowLeft className="w-3 h-3 rotate-180" />
            </button>
          )}
        </div>

        <button 
          onClick={clearNotification}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
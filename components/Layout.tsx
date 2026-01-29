import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home,
  List,
  BarChart2,
  Moon, 
  Sun,
  LogOut
} from './Icon';
import { useTasks } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from './Toast';

interface LayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideHeader = false }) => {
  const { toggleDarkMode, isDarkMode } = useTasks();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Rule 1: Navbar Final - Only 3 items
  const navItems = [
    { label: 'Home', path: '/', icon: <Home className="w-4 h-4"/> },
    { label: 'Backlog', path: '/backlog', icon: <List className="w-4 h-4"/> },
    { label: 'Dashboard', path: '/dashboard', icon: <BarChart2 className="w-4 h-4"/> },
  ];

  if (hideHeader) return (
    <>
      <Toast />
      {children}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <Toast />
      <header className="bg-white dark:bg-card-dark border-b border-gray-200 dark:border-gray-700 py-3 px-4 md:px-6 flex justify-between items-center sticky top-0 z-10 transition-colors duration-200">
        
        {/* Navigation Items */}
        <div className="flex items-center">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 text-sm font-medium">
            {navItems.map((item) => (
              <button 
                key={item.path}
                onClick={() => navigate(item.path)}
                // Rule 5: Direct navigation
                className={`px-3 py-1.5 flex items-center gap-2 rounded-md transition-all ${
                  location.pathname === item.path 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Alternar tema"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-500" />}
          </button>
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

          <button 
            onClick={logout} 
            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;
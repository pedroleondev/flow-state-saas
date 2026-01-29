import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, ArrowLeft } from '../components/Icon';

const Login = () => {
  const { login } = useAuth();
  const [key, setKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setError(false);
    setIsSubmitting(true);

    const success = await login(key);

    if (!success) {
      setError(true);
      setIsSubmitting(false);
    }
    // If success, the App router will handle the redirect automatically due to state change
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 font-sans transition-colors duration-200">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        
        {/* Card Container */}
        <div className="bg-white dark:bg-card-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 text-gray-900 dark:text-white">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Bem-vindo(a).
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Digite sua chave de acesso para continuar.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    if (error) setError(false);
                  }}
                  className={`block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border ${error ? 'border-red-300 dark:border-red-900 focus:ring-red-200' : 'border-gray-200 dark:border-gray-700 focus:border-primary dark:focus:border-white'} rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                  placeholder="Chave de acesso"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="text-xs text-red-500 dark:text-red-400 font-medium pl-1 animate-in slide-in-from-top-1">
                  Chave incorreta. Tente novamente.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !key}
              className={`w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-medium text-white transition-all transform active:scale-[0.98] ${
                isSubmitting || !key 
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg'
              }`}
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8">
           <p className="text-xs text-gray-400 dark:text-gray-600 font-mono">
             Acesso pessoal e seguro
           </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
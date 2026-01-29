import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './contexts/TaskContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orchestrator from './pages/Orchestrator';
import Metrics from './pages/Metrics';
import ActiveTask from './pages/ActiveTask';
import Login from './pages/Login';

// Componente para proteger rotas
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black dark:border-gray-700 dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <Login />
      } />

      {/* Rule 3: Home is Orchestrator */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Orchestrator />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Backlog points to the Task List (formerly Dashboard component) */}
      <Route path="/backlog" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Dashboard points to Metrics (formerly Metrics component) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Metrics />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/active/:taskId" element={
        <ProtectedRoute>
          <Layout hideHeader>
            <ActiveTask />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <AppRoutes />
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;
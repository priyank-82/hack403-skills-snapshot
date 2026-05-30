import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider, useAuth } from './services/auth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NotificationManager from './components/NotificationManager';
import APITester from './components/APITester';
import AuthTester from './components/AuthTester';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Skills from './pages/Skills';
import AI from './pages/AI';
import Login from './pages/Login';
import PhoenixLogin from './pages/PhoenixLogin';
import CompanySelection from './pages/CompanySelection';
import Loading from './pages/Loading';
import LoadingDemo from './pages/LoadingDemo';
import { motion } from 'framer-motion';
import './styles/globals.css';
import './App.css';

// Authentication-required route wrapper
function AuthRequiredRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has selected a company
  // Commented out to skip company selection requirement
  // if (!user?.companySelected) {
  //   return <Navigate to="/company-selection" />;
  // }
  
  return children;
}

function AppLayout({ children }) {
  const { isAuthenticated } = useAuth();
  
  // Don't show layout for unauthenticated users
  // Commented out company selection requirement
  // if (!isAuthenticated || !user?.companySelected) {
  //   return children;
  // }
  if (!isAuthenticated) {
    return children;
  }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <motion.main 
          className="page-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

function AppContent() {
  const { loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/phoenix-login" element={<PhoenixLogin />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/loading-demo" element={<LoadingDemo />} />
          <Route path="/company-selection" element={
            <AuthRequiredRoute>
              <CompanySelection />
            </AuthRequiredRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          } />
          <Route path="/skills" element={
            <ProtectedRoute>
              <Skills />
            </ProtectedRoute>
          } />
          <Route path="/api-tester" element={
            <ProtectedRoute>
              <APITester />
            </ProtectedRoute>
          } />
          <Route path="/ai" element={
            <ProtectedRoute>
              <AI />
            </ProtectedRoute>
          } />
          <Route path="/auth-tester" element={<AuthTester />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AppLayout>
      <NotificationManager />
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Provider>
  );
}

export default App;

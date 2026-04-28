import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'

import Layout from './components/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'

const Dashboard = lazy(() => import('./components/Dashboard'))
const InventoryPage = lazy(() => import('./components/InventoryPage'))
const UsagePage = lazy(() => import('./components/UsagePage'))
const LedgerPage = lazy(() => import('./components/LedgerPage'))
const ReportsPage = lazy(() => import('./components/ReportsPage'))
const SettingsPage = lazy(() => import('./components/SettingsPage'))
const LoginPage = lazy(() => import('./components/auth/LoginPage'))
const SignupPage = lazy(() => import('./components/auth/SignupPage'))

const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
  </div>
);

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <InventoryPage searchQuery={searchQuery} />;
      case 'usage': return <UsagePage />;
      case 'ledger': return <LedgerPage searchQuery={searchQuery} />;
      case 'reports': return <ReportsPage />;
      case 'settings': return (
        <SettingsPage 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        />
      );
      default: return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={
              <Layout 
                activeItem={activeItem} 
                onItemSelect={(id) => {
                  setActiveItem(id);
                  setSearchQuery('');
                }}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              >
                <Suspense fallback={<PageLoader />}>
                  {renderContent()}
                </Suspense>
              </Layout>
            } />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default App

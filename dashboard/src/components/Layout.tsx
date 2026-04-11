import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import DashboardPage from './Dashboard';
import InventoryPage from './InventoryPage';
import UsagePage from './UsagePage';
import LedgerPage from './LedgerPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';
import { settingsService } from '../services/settingsService';
import type { UserProfile } from '../services/settingsService';

type Page = 'dashboard' | 'inventory' | 'usage' | 'ledger' | 'reports' | 'settings';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mb-4">
      <span className="text-3xl">🚧</span>
    </div>
    <h2 className="text-xl font-bold text-slate-700">{title}</h2>
    <p className="text-slate-400 text-sm mt-2">This page is coming soon.</p>
  </div>
);

const Layout: React.FC = () => {
  const [activePage, _setActivePage] = useState<Page>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const setActivePage = (page: Page) => {
    _setActivePage(page);
    setSearchQuery(''); // Clear search when switching pages
  };

  const fetchProfile = async () => {
    try {
      const profile = await settingsService.getProfile();
      setUserProfile(profile);
    } catch (err) {
      console.error('Core Layout: Failed to fetch profile:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'inventory': return <InventoryPage searchQuery={searchQuery} />;
      case 'usage':    return <UsagePage />;
      case 'ledger':   return <LedgerPage searchQuery={searchQuery} />;
      case 'reports':  return <ReportsPage />;
      case 'settings': return <SettingsPage 
                                isDarkMode={isDarkMode} 
                                onToggleDarkMode={toggleDarkMode} 
                                onProfileUpdate={fetchProfile}
                              />;
    }
  };

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-50 selection:bg-sky-100 dark:selection:bg-sky-500/30 transition-colors duration-300">
      <div className="print:hidden">
        <Sidebar activeItem={activePage} onItemSelect={(id) => setActivePage(id as Page)} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="print:hidden">
          <Navbar 
            userName={userProfile?.full_name} 
            userRole={userProfile?.role} 
            onProfileClick={() => setActivePage('settings')}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300 print:p-0 print:overflow-visible">
          <div className="max-w-[1440px] mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

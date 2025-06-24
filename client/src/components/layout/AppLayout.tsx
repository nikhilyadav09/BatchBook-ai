import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { Footer } from './Footer';
import { useAuth } from '../../hooks/useAuth';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const handleThemeToggle = () => {
    console.log('Toggling theme...');
    // Implement theme toggling logic
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user || undefined}
          onSignOut={logout}
          onThemeToggle={handleThemeToggle}
        />
        <MainContent>
          {children}
        </MainContent>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;

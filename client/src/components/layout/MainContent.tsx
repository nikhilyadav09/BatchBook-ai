// components/layout/MainContent.tsx
import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const MainContent: React.FC<MainContentProps> = ({
  children,
  className = '',
  maxWidth = 'xl',
  padding = 'md',
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <main className={`flex-1 overflow-hidden ${className}`}>
      <div className={`h-full ${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses[padding]}`}>
        <div className="h-full">
          {children}
        </div>
      </div>
    </main>
  );
};
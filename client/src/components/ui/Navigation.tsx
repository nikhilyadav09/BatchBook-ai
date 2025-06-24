// components/ui/Navigation.tsx
import React from 'react';

interface NavigationProps {
  items: Array<{
    label: string;
    href: string;
    active?: boolean;
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex space-x-1 ${className}`}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            item.active
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
        </a>
      ))}
    </nav>
  );
};
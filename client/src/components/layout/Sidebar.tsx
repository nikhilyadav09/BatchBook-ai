// components/layout/Sidebar.tsx
import React, { useState } from 'react';

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse: () => void;
}

// Dummy data for friends
const dummyFriends: Friend[] = [
  { id: '1', name: 'Alice Johnson', isOnline: true, avatar: '/path/to/avatar1.png' },
  { id: '2', name: 'Bob Williams', isOnline: false, avatar: '/path/to/avatar2.png' },
  { id: '3', name: 'Charlie Brown', isOnline: true, avatar: '/path/to/avatar3.png' },
  { id: '4', name: 'Diana Miller', isOnline: true, avatar: '/path/to/avatar4.png' },
  { id: '5', name: 'Ethan Davis', isOnline: false, avatar: '/path/to/avatar5.png' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [friends] = useState<Friend[]>(dummyFriends);

  return (
    <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Friends
              </h2>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {friends.map((friend) => (
              <a
                href={`/profile/${friend.id}`}
                key={friend.id}
                className="w-full flex items-center p-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {friend.name.charAt(0).toUpperCase()}
                      </span>
                  </div>
                  {friend.isOnline && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                  )}
                </div>
                
                {!isCollapsed && (
                  <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{friend.name}</p>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
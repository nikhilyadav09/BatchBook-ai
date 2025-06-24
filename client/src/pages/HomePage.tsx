import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import MemorySlideshow from '../components/memory/MemorySlideshow';

const quotes = [
  "The beautiful thing about learning is that no one can take it away from you.",
  "The roots of education are bitter, but the fruit is sweet.",
  "Education is the most powerful weapon which you can use to change the world.",
  "Live as if you were to die tomorrow. Learn as if you were to live forever.",
];

// Mock data for recent memories
const recentMemories = [
  {
    id: '1',
    user: { name: 'Sarah Lee', avatar: '/path/to/sarah-avatar.png' },
    action: 'added a new memory',
    title: 'Graduation Day Fun',
    timestamp: '2 hours ago',
    thumbnail: '/path/to/grad-thumb.png',
  },
  {
    id: '2',
    user: { name: 'Mike Chen', avatar: '/path/to/mike-avatar.png' },
    action: 'commented on a memory',
    title: 'Annual Sports Fest',
    timestamp: '5 hours ago',
    thumbnail: '/path/to/sports-thumb.png',
  },
  {
    id: '3',
    user: { name: 'Emily White', avatar: '/path/to/emily-avatar.png' },
    action: 'added a new memory',
    title: 'Our First College Trip',
    timestamp: '1 day ago',
    thumbnail: '/path/to/trip-thumb.png',
  },
];

const HomePage = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user } = authContext;
  const [quote, setQuote] = React.useState('');

  React.useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      {/* Welcome Header */}
      <div className="flex items-center mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {user?.avatar ? (
          <img src={user.avatar} alt="User Avatar" className="w-20 h-20 rounded-full mr-6 border-4 border-blue-500" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mr-6">
            {user?.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg italic">"{quote}"</p>
        </div>
      </div>

      {/* Featured Memories Slideshow */}
      <MemorySlideshow />

      {/* Recent Activity Feed */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">What's New in Your Batch</h2>
        <div className="space-y-4">
          {recentMemories.map((memory) => (
            <div key={memory.id} className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 mr-4">
                {/* User avatar for the memory */}
              </div>
              <div className="flex-grow">
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-semibold">{memory.user.name}</span> {memory.action}: <span className="text-blue-600 dark:text-blue-400 font-medium">{memory.title}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{memory.timestamp}</p>
              </div>
              <div className="w-16 h-16 rounded-md bg-gray-300 ml-4 flex-shrink-0">
                 {/* Memory thumbnail */}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HomePage; 
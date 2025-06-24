import React, { useState } from 'react';

interface Memory {
  id: string;
  title: string;
  image: string;
  category: string;
  date: string;
  likes: number;
  comments: number;
}

// Categories with emojis
const categories = [
  { id: 'all', name: 'All Memories', emoji: '📸' },
  { id: 'classroom', name: 'Classroom', emoji: '📚' },
  { id: 'farewell', name: 'Farewell', emoji: '👋' },
  { id: 'sports', name: 'Sports Events', emoji: '🏆' },
  { id: 'cultural', name: 'Cultural Events', emoji: '🎭' },
  { id: 'mess', name: 'Mess & Canteen', emoji: '🍽️' },
  { id: 'teachers', name: 'With Teachers', emoji: '👨‍🏫' },
  { id: 'trips', name: 'College Trips', emoji: '🚌' },
  { id: 'festivals', name: 'Festivals', emoji: '🎉' },
];

// Mock memories data
const mockMemories: Memory[] = [
  {
    id: '1',
    title: 'Last Day of College',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94',
    category: 'farewell',
    date: '2024-03-15',
    likes: 156,
    comments: 24,
  },
  {
    id: '2',
    title: 'Annual Sports Meet',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
    category: 'sports',
    date: '2024-02-20',
    likes: 89,
    comments: 12,
  },
  {
    id: '3',
    title: 'Cultural Night Performance',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    category: 'cultural',
    date: '2024-01-30',
    likes: 234,
    comments: 45,
  },
  {
    id: '4',
    title: 'Physics Lab Session',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353',
    category: 'classroom',
    date: '2024-03-10',
    likes: 67,
    comments: 8,
  },
  {
    id: '5',
    title: 'Lunch Break Stories',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
    category: 'mess',
    date: '2024-03-05',
    likes: 92,
    comments: 15,
  },
  {
    id: '6',
    title: 'Teachers Day Celebration',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754',
    category: 'teachers',
    date: '2023-09-05',
    likes: 145,
    comments: 28,
  },
  // Add more mock memories as needed
];

const MemoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMemories = mockMemories.filter(memory => {
    const matchesCategory = selectedCategory === 'all' || memory.category === selectedCategory;
    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Batch Memories</h1>
        <p className="text-gray-600 dark:text-gray-400">Relive your college moments through these captured memories.</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full flex items-center space-x-2 whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMemories.map((memory) => (
          <div
            key={memory.id}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative aspect-w-16 aspect-h-12">
              <img
                src={memory.image}
                alt={memory.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{memory.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{new Date(memory.date).toLocaleDateString()}</span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {memory.likes}
                  </span>
                  <span className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {memory.comments}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoriesPage; 
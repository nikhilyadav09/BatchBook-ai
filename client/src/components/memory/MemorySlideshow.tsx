import React, { useState, useEffect } from 'react';

interface SlideshowMemory {
  id: string;
  image: string;
  tag: string;
  quote: string;
}

const slideshowMemories: SlideshowMemory[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
    tag: 'Graduation Day',
    quote: 'The future belongs to those who believe in the beauty of their dreams.',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1541123356219-2849c672b838?q=80&w=2070&auto=format&fit=crop',
    tag: 'Annual Fest',
    quote: 'Life is a festival, only to the wise.',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
    tag: 'Farewell Party',
    quote: "Don't be dismayed at goodbyes. A farewell is necessary before you can meet again.",
  },
];

const MemorySlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slideshowMemories.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(timer);
  }, []);

  const currentMemory = slideshowMemories[currentIndex];

  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-2xl mb-8">
      {slideshowMemories.map((memory, index) => (
        <div
          key={memory.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={memory.image} alt={memory.tag} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-8">
            <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full self-start mb-2">{memory.tag}</span>
            <p className="text-white text-2xl font-bold italic">"{memory.quote}"</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemorySlideshow; 
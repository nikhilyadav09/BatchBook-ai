// components/ui/MemoryCard.tsx
import React from 'react';
import { Card } from './Card';

interface MemoryCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  tags?: string[];
  onLike?: () => void;
  onComment?: () => void;
  onClick?: () => void;
  className?: string;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  title,
  imageUrl,
  description,
  author,
  date,
  likes,
  comments,
  tags = [],
  onLike,
  onComment,
  onClick,
  className = '',
}) => {
  return (
    <Card hover onClick={onClick} padding="none" className={className}>
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{description}</p>
        )}
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>By {author}</span>
          <span>{date}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike?.();
              }}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likes}</span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComment?.();
              }}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.953 9.953 0 01-4.951-1.32L3 21l2.3-6.958C4.487 12.875 4 11.492 4 10c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
              <span>{comments}</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default', 
  text = 'Loading...',
  className = '',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const variantClasses = {
    default: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  const spinnerClasses = `animate-spin ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 className={spinnerClasses} />
      {showText && text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Full screen loading component
export const FullScreenLoader = ({ text = 'Loading...' }) => (
  <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
    <div className="text-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  </div>
);

// Inline loading component
export const InlineLoader = ({ size = 'sm', variant = 'default' }) => (
  <LoadingSpinner size={size} variant={variant} showText={false} />
);

// Button loading component
export const ButtonLoader = ({ size = 'sm' }) => (
  <LoadingSpinner size={size} variant="white" showText={false} />
);

// Page loading component
export const PageLoader = ({ text = 'Loading page...' }) => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="xl" text={text} />
  </div>
);

// Table loading component
export const TableLoader = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);

// Card loading component
export const CardLoader = () => (
  <div className="card animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// Skeleton loader for content
export const SkeletonLoader = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
      </div>
    ))}
  </div>
);

export default LoadingSpinner;
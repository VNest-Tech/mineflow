import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' | 'orange';
  size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ children, variant, size = 'sm' }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        {
          'px-2.5 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
          'bg-green-100 text-green-800': variant === 'success' || variant === 'green',
          'bg-yellow-100 text-yellow-800': variant === 'warning' || variant === 'yellow',
          'bg-red-100 text-red-800': variant === 'danger' || variant === 'red',
          'bg-blue-100 text-blue-800': variant === 'info' || variant === 'blue',
          'bg-gray-100 text-gray-800': variant === 'secondary' || variant === 'gray',
          'bg-purple-100 text-purple-800': variant === 'purple',
          'bg-orange-100 text-orange-800': variant === 'orange',
        }
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
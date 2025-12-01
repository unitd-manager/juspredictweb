import React from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps {
  children: React.ReactNode;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ children, className = '' }) => {
  return (
    <div
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
        className
      )}
    >
      {children}
    </div>
  );
};

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center w-full h-full font-medium text-sm',
        className
      )}
    >
      {children}
    </div>
  );
};

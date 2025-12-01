import React from 'react';
import { cn } from '../../lib/utils';

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = '',
}) => {
  return (
    <p className={cn('text-sm text-gray-text', className)}>
      {children}
    </p>
  );
};

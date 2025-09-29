
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8 transition-shadow hover:shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;

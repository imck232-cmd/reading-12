
import React from 'react';

const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 5a3 3 0 1 0-5.993.142" />
    <path d="M18 5a3 3 0 1 0-5.993.142" />
    <path d="M12 12a3 3 0 1 0-5.993.142" />
    <path d="M18 12a3 3 0 1 0-5.993.142" />
    <path d="M12 19a3 3 0 1 0-5.993.142" />
    <path d="M18 19a3 3 0 1 0-5.993.142" />
    <path d="M12 5v7" />
    <path d="M12 12v7" />
    <path d="M6 5v7" />
    <path d="M6 12v7" />
    <path d="M18 5v7" />
    <path d="M18 12v7" />
    <path d="M12 12h-6" />
    <path d="M12 5h6" />
    <path d="M12 19h6" />
    <path d="M12 19H6" />
    <path d="M12 5H6" />
    <path d="M12 12h6" />
  </svg>
);
export default BrainCircuitIcon;

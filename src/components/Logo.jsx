import React from 'react';
import iconImage from '../assets/Icon.png';

function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-lg',
      container: 'gap-1',
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-xl',
      container: 'gap-0',
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-3xl',
      container: 'gap-2',
    },
  };

  const { icon, text, container } = sizes[size];

  return (
    <div className={`flex items-center ${container} ${className}`}>
      {/* Logo Icon */}
      <img
        src={iconImage}
        alt="SprintDeck Logo"
        className={`${icon} object-contain shrink-0`}
      />

      {/* Logo Text */}
      {showText && (
        <h1 className={`font-extrabold ${text} bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`}>
          SprintDeck
        </h1>
      )}
    </div>
  );
}

export default Logo;
import { useState } from 'react';

export const OffScreenToggle = () => {
  const [isOffScreen, setIsOffScreen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOffScreen(!isOffScreen)}
        className="p-2 text-white rounded-full transition-all duration-300 relative z-[60]"
        aria-label="Toggle off screen mode"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-colors duration-300 ${isOffScreen ? 'text-white' : 'text-gray-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </button>
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 ${
          isOffScreen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
      />
    </>
  );
}; 
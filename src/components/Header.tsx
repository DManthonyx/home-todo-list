import { useState, useEffect } from 'react';
import { MinimizedDateTime } from './MinimizedDateTime';
import { MinimizedWeather } from './MinimizedWeather';
import { OffScreenToggle } from './OffScreenToggle';
import { DateTime } from './DateTime';
import { Weather } from './Weather';
import { useAuth } from '../hooks/auth-hooks';

export const Header = () => {
  const { logout } = useAuth();
  const [dateTime, setDateTime] = useState(new Date());
  const [isWeatherMinimized, setIsWeatherMinimized] = useState(true);
  const [isDateTimeMinimized, setIsDateTimeMinimized] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setLogoutError(null);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      setLogoutError('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-end items-center gap-4 p-4">
        <div className="flex items-center gap-4">
          {isDateTimeMinimized ? (
            <MinimizedDateTime 
              dateTime={dateTime} 
              onMaximize={() => setIsDateTimeMinimized(false)} 
            />
          ) : (
            <div className="fixed top-4 right-[calc(50%+8rem)] transition-opacity duration-500">
              <DateTime onMinimize={() => setIsDateTimeMinimized(true)} />
            </div>
          )}
          {isWeatherMinimized ? (
            <MinimizedWeather 
              onMaximize={() => setIsWeatherMinimized(false)} 
            />
          ) : (
            <div className="fixed top-4 right-[calc(50%-8rem)] transition-opacity duration-500">
              <Weather 
                onMinimize={() => setIsWeatherMinimized(true)} 
              />
            </div>
          )}
          <OffScreenToggle />
          <div className="relative">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${
                isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
            {logoutError && (
              <div className="absolute right-0 top-full mt-2 p-2 bg-red-500 text-white text-sm rounded shadow-lg">
                {logoutError}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}; 
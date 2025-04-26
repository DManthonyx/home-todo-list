import { useState } from 'react';
import { DateTimeIconButtonToggle } from './DateTimeIconButtonToggle';
import { WeatherIconButtonToggle } from './WeatherIconButtonToggle';
import { OffScreenToggle } from './OffScreenToggle';
import { DateTimeWidget } from './DateTimeWidget';
import { WeatherWidget } from './WeatherWidget';
import { useAuth } from '../hooks/auth-hooks';

export const Header = () => {
  const { logout } = useAuth();
  // States for visibility of widgets
  const [isWeatherVisible, setIsWeatherVisible] = useState(false);
  const [isDateTimeVisible, setIsDateTimeVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);


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
        <div className="fixed top-4 left-2 transition-opacity duration-500">
          <DateTimeWidget isDateTimeVisible={isDateTimeVisible} onMinimize={() => setIsDateTimeVisible(false)} />
        </div>
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <WeatherWidget 
            isWeatherVisible={isWeatherVisible}
            onMinimize={() => setIsWeatherVisible(false)} 
         />
        </div>
        <div className="widget-icon-button-container flex items-center gap-4">
            <DateTimeIconButtonToggle 
              isDateTimeVisible={isDateTimeVisible}
              onMaximize={() => setIsDateTimeVisible(true)} 
            />
            <WeatherIconButtonToggle 
              isWeatherVisible={isWeatherVisible}
              onMaximize={() => setIsWeatherVisible(true)} 
            />
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
          <OffScreenToggle />
        </div>
      </div>
    </header>
  );
}; 
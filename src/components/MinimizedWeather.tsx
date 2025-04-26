import { useWeather } from '../hooks/weather-hooks';

interface MinimizedWeatherProps {
  onMaximize: () => void;
}

export const MinimizedWeather = ({ onMaximize }: MinimizedWeatherProps) => {
  const { currentWeather, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-3 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-3 text-white">
        <div className="text-red-400">Error</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-3 text-white">
      <button
        onClick={onMaximize}
        className="flex items-center gap-2 hover:bg-gray-700 rounded-lg p-2 transition-colors"
      >
        {currentWeather && (
          <>
            <img
              src={`http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
              alt={currentWeather.description}
              className="w-8 h-8"
            />
            <div className="text-sm">
              <div className="font-semibold">{currentWeather.temp}°F</div>
              <div className="text-xs text-gray-400">{currentWeather.description}</div>
            </div>
          </>
        )}
      </button>
    </div>
  );
}; 
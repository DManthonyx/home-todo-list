import { useWeather } from '../hooks/weather-hooks';
import { WeatherData } from '../types/weather';

interface WeatherWidgetProps {
  onMinimize: () => void;
  isWeatherVisible: boolean;
}

export const WeatherWidget = ({ onMinimize, isWeatherVisible }: WeatherWidgetProps) => {
  const { currentWeather, weather, loading, error } = useWeather();
  if (!isWeatherVisible) return null;

  if (loading) {
    return (
      <div className="border border-white rounded-lg shadow-lg p-3 text-white/100">
        Loading weather...
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-white rounded-lg shadow-lg p-3 text-white/100">
        <div className="text-red-400">Error: {error}</div>
        <div className="text-xs text-white/70 mt-1">
          Please check your API key and try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-lg p-3 text-white/100 relative">
      <button
        onClick={onMinimize}
        className="absolute top-2 right-2 p-1 rounded-full transition-colors"
        aria-label="Minimize weather"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-white/70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="flex items-start gap-4">
        {currentWeather && (
          <div className="flex items-center gap-3">
            <img
              src={`http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
              alt={currentWeather.description}
              className="w-12 h-12"
            />
            <div>
              <div className="text-xl font-bold text-white/100">
                West Covina {currentWeather.temp}°F
              </div>
              <div className="text-xs text-white/70">{currentWeather.description}</div>
              <div className="text-xs text-white/70">
                Humidity: {currentWeather.humidity}% | Wind: {currentWeather.windSpeed} mph
              </div>
            </div>
          </div>
        )}
        <div className="border-l border-white/30 pl-4">
          <div className="grid grid-cols-7 gap-1">
            {weather.map((day: WeatherData) => (
              <div key={day.date} className="text-center">
                <div className="text-xs font-semibold text-white/100">{day.date}</div>
                <img
                  src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className="w-8 h-8 mx-auto"
                />
                <div className="text-xs text-white/100">{day.temp}°F</div>
                <div className="text-xs text-white/70">{day.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

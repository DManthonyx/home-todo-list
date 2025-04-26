import { useWeather } from '../hooks/weather-hooks';

interface WeatherIconButtonToggleProps {
  onMaximize: () => void;
  isWeatherVisible: boolean;
}

export const WeatherIconButtonToggle = ({ onMaximize, isWeatherVisible }: WeatherIconButtonToggleProps) => {
  const { currentWeather } = useWeather();
  if (isWeatherVisible) return null;
  return (
      <button
        onClick={onMaximize}
        className="rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        {currentWeather && (
            <img
              src={`http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
              alt={currentWeather.description}
              className="w-8 h-8"
            />
        )}
      </button>
  );
}; 
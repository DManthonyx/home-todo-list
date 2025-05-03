import { useWeather } from '../hooks/weather-hooks';

interface WeatherIconButtonToggleProps {
  onMaximize: () => void;
}

export const WeatherIconButtonToggle = ({ onMaximize }: WeatherIconButtonToggleProps) => {
  const { currentWeather } = useWeather();
  return (
    <button onClick={onMaximize} className="rounded-full transition-colors">
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

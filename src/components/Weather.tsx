import { useState, useEffect } from 'react';

interface WeatherData {
  date: string;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export const Weather = () => {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

        if (!apiKey) {
          throw new Error('Weather API key is missing');
        }

        // Fetch current weather for West Covina
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=West Covina,US&units=imperial&appid=${apiKey}`
        );
        
        if (!currentResponse.ok) {
          const errorData = await currentResponse.json();
          console.error('API Error:', errorData); // Debug log
          throw new Error(`Weather API error: ${errorData.message || currentResponse.statusText}`);
        }

        const currentData: WeatherResponse = await currentResponse.json();
        
        setCurrentWeather({
          date: 'Now',
          temp: Math.round(currentData.main.temp),
          description: currentData.weather[0].description,
          icon: currentData.weather[0].icon,
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed)
        });

        // Fetch 5-day forecast for West Covina
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=West Covina,US&units=imperial&appid=${apiKey}`
        );

        if (!forecastResponse.ok) {
          const errorData = await forecastResponse.json();
          console.error('Forecast API Error:', errorData); // Debug log
          throw new Error(`Forecast API error: ${errorData.message || forecastResponse.statusText}`);
        }

        const forecastData: ForecastResponse = await forecastResponse.json();

        // Process the data to get daily forecasts
        console.log('forecastData', forecastData);
        const dailyForecasts = forecastData.list.reduce((acc: WeatherData[], item: ForecastResponse['list'][0]) => {
          const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          
          // Only add if we don't have this day yet
          if (!acc.find(forecast => forecast.date === date)) {
            acc.push({
              date,
              temp: Math.round(item.main.temp),
              description: item.weather[0].description,
              icon: item.weather[0].icon,
              humidity: item.main.humidity,
              windSpeed: Math.round(item.wind.speed)
            });
          }
          return acc;
        }, []).slice(0, 7); // Get only 7 days

        setWeather(dailyForecasts);
        setLoading(false);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-4 left-64 bg-gray-800 rounded-lg shadow-lg p-4 text-white">
        Loading weather...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 left-64 bg-gray-800 rounded-lg shadow-lg p-4 text-white">
        <div className="text-red-400">Error: {error}</div>
        <div className="text-sm text-gray-400 mt-2">
          Please check your API key and try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-64 bg-gray-800 rounded-lg shadow-lg p-4 text-white">
      <div className="flex items-start gap-8">
        {currentWeather && (
          <div className="flex items-center gap-4">
            <img
              src={`http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
              alt={currentWeather.description}
              className="w-16 h-16"
            />
            <div>
              <div className="text-2xl font-bold">West Covina {currentWeather.temp}°F</div>
              <div className="text-sm text-gray-400">{currentWeather.description}</div>
              <div className="text-xs text-gray-400">
                Humidity: {currentWeather.humidity}% | Wind: {currentWeather.windSpeed} mph
              </div>
            </div>
          </div>
        )}
        <div className="border-l border-gray-700 pl-8">
          <div className="grid grid-cols-7 gap-2">
            {weather.map((day) => (
              <div key={day.date} className="text-center">
                <div className="text-sm font-semibold">{day.date}</div>
                <img
                  src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className="w-12 h-12 mx-auto"
                />
                <div className="text-sm">{day.temp}°F</div>
                <div className="text-xs text-gray-400">{day.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 
import { useState, useEffect } from 'react';
import { WeatherData, WeatherResponse, ForecastResponse } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const CITY = 'West Covina';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!API_KEY) {
        console.error('Weather API key is missing. Please check your .env file.');
        setError('Weather API key is not configured');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch current weather
        const currentUrl = `${BASE_URL}/weather?q=${CITY},US&units=imperial&appid=${API_KEY}`;
        console.log('Fetching current weather from:', currentUrl);
        
        const currentResponse = await fetch(currentUrl);
        
        if (!currentResponse.ok) {
          const errorData = await currentResponse.json();
          console.error('Current weather API error:', errorData);
          throw new Error(`Failed to fetch current weather: ${errorData.message || currentResponse.statusText}`);
        }
        
        const currentData: WeatherResponse = await currentResponse.json();
        console.log('Current weather data:', currentData);
        
        // Fetch 7-day forecast
        const forecastUrl = `${BASE_URL}/forecast?q=${CITY},US&units=imperial&appid=${API_KEY}`;
        console.log('Fetching forecast from:', forecastUrl);
        
        const forecastResponse = await fetch(forecastUrl);
        
        if (!forecastResponse.ok) {
          const errorData = await forecastResponse.json();
          console.error('Forecast API error:', errorData);
          throw new Error(`Failed to fetch weather forecast: ${errorData.message || forecastResponse.statusText}`);
        }
        
        const forecastData: ForecastResponse = await forecastResponse.json();
        console.log('Forecast data:', forecastData);

        // Transform current weather data
        const transformedCurrent: WeatherData = {
          date: 'Now',
          temp: Math.round(currentData.main.temp),
          description: currentData.weather[0].description,
          icon: currentData.weather[0].icon,
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed)
        };

        // Transform forecast data (get one forecast per day)
        const transformedForecast: WeatherData[] = forecastData.list
          .filter((item, index) => index % 8 === 0) // Get one forecast per day
          .map(item => ({
            date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
            temp: Math.round(item.main.temp),
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed)
          }));

        setCurrentWeather(transformedCurrent);
        setWeather(transformedForecast);
        setError(null);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return { currentWeather, weather, loading, error };
}; 
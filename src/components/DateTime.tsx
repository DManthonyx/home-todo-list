import { useState, useEffect } from 'react';

export const DateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed top-4 right-4 bg-gray-800 rounded-lg shadow-lg p-4 text-white">
      <div className="text-2xl font-bold">{formatTime(dateTime)}</div>
      <div className="text-sm text-gray-400">{formatDate(dateTime)}</div>
    </div>
  );
}; 
import { useState, useEffect } from 'react';

interface DateTimeWidgetProps {
  onMinimize: () => void;
  isDateTimeVisible: boolean;
}

export const DateTimeWidget = ({ onMinimize, isDateTimeVisible }: DateTimeWidgetProps) => {
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

  if (!isDateTimeVisible) return null;

  return (
    <div className="rounded-lg shadow-lg p-4 text-white">
      <div className="relative">
        <div className="text-2xl font-bold">{formatTime(dateTime)}</div>
        <div className="text-sm text-gray-400">{formatDate(dateTime)}</div>
        <button
          onClick={onMinimize}
          className="absolute -top-4 -right-2 p-1 rounded-full transition-colors"
          aria-label="Minimize date and time"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}; 
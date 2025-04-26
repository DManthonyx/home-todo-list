import { useState, TouchEvent } from 'react';
import { Todo } from '../types/todo';

interface CalendarProps {
  todos: Todo[];
  onMinimize: () => void;
}

export const Calendar = ({ todos, onMinimize }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const swipeThreshold = 50; // minimum distance for a swipe
  
  const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null); // reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > swipeThreshold;
    const isRightSwipe = distance < -swipeThreshold;

    if (isLeftSwipe) {
      navigateMonth('next');
    }
    if (isRightSwipe) {
      navigateMonth('prev');
    }

    // reset values
    setTouchStart(null);
    setTouchEnd(null);
  };

  const formatYearMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getTodosByDate = (date: Date) => {
    return todos.filter(todo => {
      const todoDate = todo?.dueDate?.toISOString().split('T')[0];
      const compareDate = date.toISOString().split('T')[0];
      return todoDate === compareDate;
    }).length;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendarDays = () => {
    const daysArray = [];
    const totalDays = getFirstDayOfMonth(currentDate) + getDaysInMonth(currentDate);
    const totalWeeks = Math.ceil(totalDays / 7);

    for (let i = 0; i < totalWeeks * 7; i++) {
      const dayNumber = i - getFirstDayOfMonth(currentDate) + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= getDaysInMonth(currentDate);
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
      const todoCount = isCurrentMonth ? getTodosByDate(date) : 0;

      daysArray.push(
        <div
          key={i}
          className={`p-3 text-center relative ${
            isCurrentMonth ? 'text-white' : 'text-gray-600'
          }`}
        >
          {isCurrentMonth && (
            <>
              <span className="text-lg">{dayNumber}</span>
              {todoCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                  {todoCount}
                </span>
              )}
            </>
          )}
        </div>
      );
    }

    return daysArray;
  };

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div 
        className="bg-gray-800 rounded-lg shadow-lg p-8 w-[500px] relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          onClick={onMinimize}
          className="absolute bottom-2 right-2 p-1 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Minimize calendar"
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
        {/* Calendar Header */}
        <div className="flex items-center justify-center mb-8 relative">
          <button
            onClick={() => navigateMonth('prev')}
            className="absolute left-0 p-3 hover:bg-gray-700 rounded-full transition-colors touch-manipulation"
            aria-label="Previous month"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          
          <div className="text-3xl font-bold text-white select-none">
            {formatYearMonth(currentDate)}
          </div>

          <button
            onClick={() => navigateMonth('next')}
            className="absolute right-0 p-3 hover:bg-gray-700 rounded-full transition-colors touch-manipulation"
            aria-label="Next month"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 mb-4 select-none">
          {daysInWeek.map(day => (
            <div
              key={day}
              className="text-center text-base font-semibold text-gray-400 py-3"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 select-none">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
}; 
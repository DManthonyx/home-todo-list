interface VisibilityTogglesProps {
  isTodoListVisible: boolean;
  isCalendarVisible: boolean;
  onToggleTodoList: () => void;
  onToggleCalendar: () => void;
}

export const VisibilityToggles = ({
  isTodoListVisible,
  isCalendarVisible,
  onToggleTodoList,
  onToggleCalendar,
}: VisibilityTogglesProps) => {
  return (
    <div className="fixed bottom-4 right-4 flex gap-2">
      {!isTodoListVisible &&      (<button
        onClick={onToggleTodoList}
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        aria-label={isTodoListVisible ? 'Hide todo list' : 'Show todo list'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </button>)}
      {!isCalendarVisible && (<button
        onClick={onToggleCalendar}
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        aria-label={isCalendarVisible ? 'Hide calendar' : 'Show calendar'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>)}
    </div>
  );
}; 
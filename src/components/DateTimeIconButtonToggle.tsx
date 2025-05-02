interface DateTimeIconButtonToggleProps {
  onMaximize: () => void;
}

export const DateTimeIconButtonToggle = ({ onMaximize }: DateTimeIconButtonToggleProps) => {
  return (
    <button
      onClick={onMaximize}
      className="p-2 rounded-full"
      aria-label="Show date and time details"
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  );
}; 
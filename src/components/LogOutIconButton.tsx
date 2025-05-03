export const LogOutIconButton = ({
  handleLogout,
  isLoggingOut,
}: {
  handleLogout: () => void;
  isLoggingOut: boolean;
}) => {
  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`p-2 rounded-full ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    </button>
  );
};

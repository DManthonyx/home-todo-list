import { useKeyboard } from '../contexts/KeyboardContext';

export const Keyboard = () => {
  const { keyboardRef, handleKeyPress } = useKeyboard();
  const keys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']
  ];

  const handleKeyClick = (key: string) => {
    handleKeyPress(key);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Prevent the click from bubbling up and closing the keyboard
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      ref={keyboardRef}
      className="fixed right-0 bottom-0 bg-gray-800 rounded-tl-lg shadow-lg p-6 z-50"
      onClick={handleContainerClick}
      onMouseDown={handleContainerClick}
    >
      <div className="grid gap-3">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-3 justify-center">
            {row.map((key) => (
              <button
                key={key}
                type="button"
                onMouseDown={() => handleKeyClick(key)}
                onTouchStart={() => handleKeyClick(key)}
                className="w-12 h-12 text-lg bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-gray-500 select-none"
                style={{ touchAction: 'manipulation' }}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}; 
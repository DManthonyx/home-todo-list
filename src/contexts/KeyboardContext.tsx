import { createContext, useState, useRef, ReactNode } from 'react';

interface KeyboardContextType {
  activeInput: HTMLInputElement | HTMLTextAreaElement | null;
  setActiveInput: (input: HTMLInputElement | HTMLTextAreaElement | null) => void;
  handleKeyPress: (key: string) => void;
  keyboardRef: React.RefObject<HTMLDivElement | null>;
}

export const KeyboardContext = createContext<KeyboardContextType | null>(null);

interface KeyboardProviderProps {
  children: ReactNode;
}

export const KeyboardProvider = ({ children }: KeyboardProviderProps) => {
  const [activeInput, setActiveInput] = useState<HTMLInputElement | HTMLTextAreaElement | null>(
    null
  );
  const keyboardRef = useRef<HTMLDivElement | null>(null);

  const handleKeyPress = (key: string) => {
    if (!activeInput) return;

    const start = activeInput.selectionStart ?? 0;
    const end = activeInput.selectionEnd ?? 0;
    const value = activeInput.value;

    let newValue: string;
    let newCursorPosition: number;

    if (key === '⌫') {
      if (start === end) {
        // Single cursor position
        if (start > 0) {
          newValue = value.slice(0, start - 1) + value.slice(end);
          newCursorPosition = start - 1;
        } else {
          newValue = value;
          newCursorPosition = start;
        }
      } else {
        // Text is selected
        newValue = value.slice(0, start) + value.slice(end);
        newCursorPosition = start;
      }
    } else {
      // Insert new character
      newValue = value.slice(0, start) + key + value.slice(end);
      newCursorPosition = start + 1;
    }

    // Update input value
    activeInput.value = newValue;

    // Set cursor position
    activeInput.setSelectionRange(newCursorPosition, newCursorPosition);

    // Trigger input event to ensure React state updates
    activeInput.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return (
    <KeyboardContext.Provider value={{ activeInput, setActiveInput, handleKeyPress, keyboardRef }}>
      {children}
    </KeyboardContext.Provider>
  );
};

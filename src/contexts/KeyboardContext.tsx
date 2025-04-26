import { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface KeyboardContextType {
  activeInput: HTMLInputElement | HTMLTextAreaElement | null;
  setActiveInput: (input: HTMLInputElement | HTMLTextAreaElement | null) => void;
  handleKeyPress: (key: string) => void;
  keyboardRef: React.RefObject<HTMLDivElement | null>;
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

export const useKeyboard = () => {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  return context;
};

interface KeyboardProviderProps {
  children: ReactNode;
}

export const KeyboardProvider = ({ children }: KeyboardProviderProps) => {
  const [activeInput, setActiveInput] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const keyboardRef = useRef<HTMLDivElement | null>(null);

  const handleKeyPress = (key: string) => {
    if (activeInput) {
      const start = activeInput.selectionStart || 0;
      const end = activeInput.selectionEnd || 0;
      const value = activeInput.value;
      
      let newValue: string;
      if (key === '⌫') {
        // Only delete if there's text before the cursor
        if (start > 0) {
          newValue = value.substring(0, start - 1) + value.substring(end);
          activeInput.setSelectionRange(start - 1, start - 1);
        } else {
          newValue = value;
        }
      } else {
        // Insert the key after the cursor position
        newValue = value.substring(0, end) + key + value.substring(end);
        activeInput.setSelectionRange(end + 1, end + 1);
      }

      // Update the input value
      activeInput.value = newValue;

      // Create a new input reference to trigger re-render
      const newInput = activeInput.cloneNode(true) as HTMLInputElement | HTMLTextAreaElement;
      newInput.value = newValue;
      setActiveInput(newInput);
    }
  };

  return (
    <KeyboardContext.Provider value={{ activeInput, setActiveInput, handleKeyPress, keyboardRef }}>
      {children}
    </KeyboardContext.Provider>
  );
}; 
import { useContext } from 'react';
import { KeyboardContext } from '../contexts/KeyboardContext';

export const useKeyboard = () => {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  return context;
};

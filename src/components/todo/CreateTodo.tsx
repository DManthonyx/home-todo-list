import { useState, useEffect, useRef } from 'react';
import { useKeyboard } from '../../contexts/KeyboardContext';

interface CreateTodoProps {
  onAdd: (text: string, dueDate: string) => Promise<void>;
}

export const CreateTodo = ({ onAdd }: CreateTodoProps) => {
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState<string>('');
  const { activeInput, setActiveInput } = useKeyboard();
  const addTodoRef = useRef<HTMLInputElement>(null);

  const handleAdd = async () => {
    if (newTodo.trim()) {
      await onAdd(newTodo, newTodoDueDate);
      setNewTodo('');
      setNewTodoDueDate('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  // Handle keyboard input
  useEffect(() => {
    if (activeInput?.id === 'new-todo-input') {
        const input = activeInput as HTMLInputElement;
        setNewTodo(input.value);
    }
}, [activeInput]);

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex gap-2">
        <input
          ref={addTodoRef}
          id="new-todo-input"
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          onFocus={() => setActiveInput(addTodoRef.current)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a new todo"
          className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={newTodoDueDate}
          onChange={(e) => setNewTodoDueDate(e.target.value)}
          placeholder="Due date"
          className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-datetime-edit]:text-gray-400 [&::-webkit-datetime-edit-fields-wrapper]:text-gray-400 [&::-webkit-datetime-edit-text]:text-gray-400 [&::-webkit-datetime-edit-month-field]:text-gray-400 [&::-webkit-datetime-edit-day-field]:text-gray-400 [&::-webkit-datetime-edit-year-field]:text-gray-400"
        />
      </div>
    </div>
  );
}; 
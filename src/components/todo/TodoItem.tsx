import { useEffect, useRef } from 'react';
import { Todo } from '../../types/todo';
import { useKeyboard } from '../../hooks/keyboard-hooks';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onSaveEdit: (id: string) => Promise<void>;
  editingId: string | null;
  editText: string;
  setEditText: (text: string) => void;
  setEditingId: (id: string | null) => void;
  formatDate: (date: Date) => string;
}

export const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onSaveEdit,
  editingId,
  editText,
  setEditText,
  setEditingId,
  formatDate,
}: TodoItemProps) => {
  const { activeInput, setActiveInput } = useKeyboard();
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value);
  };

  useEffect(() => {
    if (activeInput?.id === `edit-todo-${todo.id}`) {
        const input = activeInput as HTMLInputElement;
        setEditText(input.value);
    }
}, [activeInput, todo.id, setEditText]);

  return (
    <li className="flex flex-col p-3 rounded-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="mt-1 w-5 h-5 text-blue-500 rounded focus:ring-blue-500 bg-gray-600 border-gray-500 flex-shrink-0"
          />
          {editingId === todo.id ? (
            <textarea
              ref={editTextareaRef}
              id={`edit-todo-${todo.id}`}
              value={editText}
              onChange={handleEditChange}
              onFocus={() => setActiveInput(editTextareaRef.current)}
              className="flex-1 w-full px-3 py-1 bg-gray-600 text-white border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] resize-none"
            />
          ) : (
            <span 
              className={`
                break-words whitespace-pre-wrap flex-1
                ${todo.completed ? 'line-through text-gray-400' : 'text-white'}
              `}
            >
              {todo.text}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {editingId === todo.id ? (
            <>
              <button
                onClick={() => onSaveEdit(todo.id)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="px-3 py-1 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onEdit(todo)}
                className="px-3 py-1 text-white"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="px-3 py-1 text-white"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm text-gray-400">
          Due: {formatDate(todo.dueDate)}
        </span>
      </div>
    </li>
  );
}; 
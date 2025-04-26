import { useState, useEffect } from 'react';
import { Todo } from '../../types/todo';
import { db } from '../../config/firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/auth-hooks';
import { TodoItem } from './TodoItem';
import { CreateTodo } from './CreateTodo';

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'todos'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const todosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          dueDate: doc.data().dueDate?.toDate()
        })) as Todo[];
        setTodos(todosData);
        setError(null);
      },
      (error) => {
        console.error('Error fetching todos:', error);
        setError('Error loading todos. Please try again.');
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAddTodo = async (text: string, dueDate: string) => {
    if (text.trim() && currentUser) {
      try {
        const now = new Date();
        let dueDateObj: Date;

        if (dueDate) {
          // Create date at noon to avoid timezone issues
          const [year, month, day] = dueDate.split('-').map(Number);
          dueDateObj = new Date(year, month - 1, day, 12, 0, 0);
        } else {
          dueDateObj = getDefaultDueDate();
        }

        const todoData = {
          text: text.trim(),
          completed: false,
          userId: currentUser.uid,
          createdAt: Timestamp.fromDate(now),
          dueDate: Timestamp.fromDate(dueDateObj)
        };
        await addDoc(collection(db, 'todos'), todoData);
        setError(null);
      } catch (error) {
        console.error('Error adding todo:', error);
        setError('Error adding todo. Please try again.');
      }
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
      setError(null);
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Error deleting todo. Please try again.');
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todoRef = doc(db, 'todos', id);
      const todo = todos.find(t => t.id === id);
      if (todo) {
        await updateDoc(todoRef, {
          completed: !todo.completed
        });
        setError(null);
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('Error updating todo. Please try again.');
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = async (id: string) => {
    if (editText.trim()) {
      try {
        const todoRef = doc(db, 'todos', id);
        await updateDoc(todoRef, {
          text: editText.trim()
        });
        setEditingId(null);
        setEditText('');
        setError(null);
      } catch (error) {
        console.error('Error updating todo:', error);
        setError('Error updating todo. Please try again.');
      }
    }
  };

  const updateDueDate = async (id: string, newDueDate: Date) => {
    try {
      const todoRef = doc(db, 'todos', id);
      await updateDoc(todoRef, {
        dueDate: Timestamp.fromDate(newDueDate)
      });
      setError(null);
    } catch (error) {
      console.error('Error updating due date:', error);
      setError('Error updating due date. Please try again.');
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 w-96 bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Todo List</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">
          {error}
        </div>
      )}

      <CreateTodo onAdd={handleAddTodo} />

      <div className="max-h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <ul className="space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={startEditing}
              onSaveEdit={saveEdit}
              onUpdateDueDate={updateDueDate}
              editingId={editingId}
              editText={editText}
              setEditText={setEditText}
              setEditingId={setEditingId}
              formatDate={formatDate}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}; 
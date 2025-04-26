import { useState, useEffect } from 'react';
import { TodoList } from './components/todo/TodoList';
import { Login } from './components/Login';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/auth-hooks';
import { DateTime } from './components/DateTime';
import { Weather } from './components/Weather';
import { Calendar } from './components/Calendar';
import { KeyboardProvider, useKeyboard } from './contexts/KeyboardContext';
import { Keyboard } from './components/Keyboard';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './config/firebase';
import { Todo } from './types/todo';

const AppContent = () => {
  const { currentUser, logout } = useAuth();
  const { activeInput, setActiveInput, keyboardRef } = useKeyboard();
  const [todos, setTodos] = useState<Todo[]>([]);

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
      },
      (error) => {
        console.error('Error fetching todos:', error);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {

    const handleBlur = (e: FocusEvent) => {
      // Only close if clicking outside both the input and keyboard
      if (!keyboardRef.current?.contains(e.relatedTarget as Node)) {
        setActiveInput(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      // If clicking outside both input and keyboard, close the keyboard
      if (activeInput && !keyboardRef.current?.contains(e.target as Node)) {
        setActiveInput(null);
      }
    };

    document.addEventListener('focusout', handleBlur);
    document.addEventListener('mousedown', handleClick, true);

    return () => {
      // document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      document.removeEventListener('mousedown', handleClick, true);
    };
  }, [setActiveInput, keyboardRef, activeInput]);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="fixed top-4 right-4">
        {currentUser && (
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        )}
      </div>
      <DateTime />
      <Weather />
      <Calendar todos={todos} />
      {currentUser ? (
        <TodoList />
      ) : (
        <Login />
      )}
      {activeInput && <Keyboard />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <KeyboardProvider>
        <AppContent />
      </KeyboardProvider>
    </AuthProvider>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { TodoList } from './components/todo/TodoList';
import { Login } from './components/Login';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/auth-hooks';
import { Calendar } from './components/Calendar';
import { KeyboardProvider, useKeyboard } from './contexts/KeyboardContext';
import { Keyboard } from './components/Keyboard';
import { Header } from './components/Header';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './config/firebase';
import { Todo } from './types/todo';
import { VisibilityToggles } from './components/VisibilityToggles';
import { Weather } from './components/Weather';

const AppContent = () => {
  const { currentUser } = useAuth();
  const { activeInput, setActiveInput, keyboardRef } = useKeyboard();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isTodoListVisible, setIsTodoListVisible] = useState(true);
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);

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
      if (!keyboardRef.current?.contains(e.relatedTarget as Node)) {
        setActiveInput(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (activeInput && !keyboardRef.current?.contains(e.target as Node)) {
        setActiveInput(null);
      }
    };

    document.addEventListener('focusout', handleBlur);
    document.addEventListener('mousedown', handleClick, true);

    return () => {
      document.removeEventListener('focusout', handleBlur);
      document.removeEventListener('mousedown', handleClick, true);
    };
  }, [setActiveInput, keyboardRef, activeInput]);

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-black transition-colors duration-200">
      <Header />
      <main className="pt-16">
        {isCalendarVisible && <Calendar todos={todos} onMinimize={() => setIsCalendarVisible(false)} />}
        {currentUser && isTodoListVisible && <TodoList onMinimize={() => setIsTodoListVisible(false)} />}
        {!currentUser && <Login />}
        <Weather
          onMinimize={() => {}}
          showMinimizeButton={!isTodoListVisible || !isCalendarVisible}
        />
      </main>
      {activeInput && <Keyboard />}
      {(!isTodoListVisible || !isCalendarVisible) && (
        <VisibilityToggles
          isTodoListVisible={isTodoListVisible}
          isCalendarVisible={isCalendarVisible}
          onToggleTodoList={() => setIsTodoListVisible(!isTodoListVisible)}
          onToggleCalendar={() => setIsCalendarVisible(!isCalendarVisible)}
        />
      )}
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

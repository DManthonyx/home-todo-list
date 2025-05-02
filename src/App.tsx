import { useState, useEffect } from 'react';
import { TodoList } from './components/todo/TodoList';
import { Login } from './components/Login';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/auth-hooks';
import { CalendarWidget } from './components/CalendarWidget';
import { KeyboardProvider, useKeyboard } from './contexts/KeyboardContext';
import { Keyboard } from './components/Keyboard';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './config/firebase';
import { Todo } from './types/todo';
import { CalendarIconButtonToggle } from './components/CalendarIconButtonToggle';
import { TodoIconButtonToggle } from './components/todo/TodoIconButtonToggle';
import { CryptoWidgets } from './components/CryptoWidgets';
import { DateTimeIconButtonToggle } from './components/DateTimeIconButtonToggle';
import { WeatherIconButtonToggle } from './components/WeatherIconButtonToggle';
import { OffScreenToggle } from './components/OffScreenToggle';
import { DateTimeWidget } from './components/DateTimeWidget';
import { WeatherWidget } from './components/WeatherWidget';
import { LogOutIconButton } from './components/LogOutIconButton';

const AppContent = () => {
  const { currentUser, logout } = useAuth();
  const { activeInput, setActiveInput, keyboardRef } = useKeyboard();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isTodoListVisible, setIsTodoListVisible] = useState(true);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isWeatherVisible, setIsWeatherVisible] = useState(false);
  const [isDateTimeVisible, setIsDateTimeVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setLogoutError(null);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      setLogoutError('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

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
    <main className="min-h-screen bg-black duration-200 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-end items-center gap-4 p-4">
          <div className="fixed top-4 left-2 transition-opacity duration-500">
            <DateTimeWidget isDateTimeVisible={isDateTimeVisible} onMinimize={() => setIsDateTimeVisible(false)} />
          </div>
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <WeatherWidget 
              isWeatherVisible={isWeatherVisible}
              onMinimize={() => setIsWeatherVisible(false)} 
            />
          </div>
          <div className="widget-icon-button-container flex items-center gap-4">
            {!isDateTimeVisible && <DateTimeIconButtonToggle 
              onMaximize={() => setIsDateTimeVisible(true)} 
            />}
            {!isWeatherVisible && <WeatherIconButtonToggle 
              onMaximize={() => setIsWeatherVisible(true)} 
            />}
            {!isCalendarVisible && <CalendarIconButtonToggle
              onClick={() => setIsCalendarVisible(!isCalendarVisible)}
            />}
            {!isTodoListVisible && <TodoIconButtonToggle
              onClick={() => setIsTodoListVisible(!isTodoListVisible)}
            />}
            <div className="relative">
              {currentUser && (
                <LogOutIconButton
                  handleLogout={handleLogout}
                  isLoggingOut={isLoggingOut}
                />
              )}
              {logoutError && (
                <div className="absolute right-0 top-full mt-2 p-2 bg-red-500 text-white text-sm rounded shadow-lg">
                  {logoutError}
                </div>
              )}
            </div>
            <OffScreenToggle />
          </div>
        </div>
      </div>
      <div className="flex-1 pt-16">
        {isCalendarVisible && <CalendarWidget todos={todos} onMinimize={() => setIsCalendarVisible(false)} />}
      </div>
        <CryptoWidgets />
        {!currentUser && <Login />}
        {currentUser && isTodoListVisible && <TodoList onMinimize={() => setIsTodoListVisible(false)} />}
        {activeInput && <Keyboard />}
    </main>
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

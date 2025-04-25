import { TodoList } from './components/TodoList';
import { Login } from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      {currentUser ? (
        <div>
          <div className="max-w-md mx-auto mb-4 flex justify-end">
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
          <TodoList />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

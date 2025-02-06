import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context'
import LandingPage from './pages/Landing';
import Dashboard from './pages/Dashboard';
import UsersPage from "./pages/UsersPage";
import TaskList from './pages/TaskList';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    // Redirect to landing page if not authenticated
    console.log('redirect');
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
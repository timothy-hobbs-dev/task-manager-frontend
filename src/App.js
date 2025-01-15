import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing';
import Dashboard from './pages/Dashboard';
import UsersPage from "./pages/UsersPage";
import TaskList from './pages/TaskList';



function App() {
  return (
     <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/tasks" element={<TaskList />} />W

          </Routes>
        </Router>
  );
}

export default App;

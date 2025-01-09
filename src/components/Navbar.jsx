import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { LogOut, CheckSquare } from 'lucide-react';

// Navbar Component
const Navbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-xl font-semibold flex items-center gap-2">
          <CheckSquare className="h-6 w-6" />
          TaskFlow
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-white">John Doe</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
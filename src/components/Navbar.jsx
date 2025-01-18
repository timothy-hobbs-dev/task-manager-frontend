import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, CheckSquare } from 'lucide-react';
import { useAuth } from "react-oidc-context";

// Navbar Component
const Navbar = () => {
  const auth = useAuth();

  console.log(auth);
  const signOutRedirect = () => {
    const clientId = "4dnc8h177ghqf6tb9u7d33uk68";
    const logoutUri = window.location.origin;
    const cognitoDomain = "https://task-manager-app.auth.eu-central-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Company Name on the Left */}
        <div>
          <Link to="/dashboard" className="text-white text-xl font-semibold flex items-center gap-2">
            <CheckSquare className="h-6 w-6" />
            TaskOverFlow
          </Link>
        </div>

        {/* Links and User Info on the Right */}
        <div className="flex items-center gap-6">
          {auth?.user?.profile?.["cognito:groups"]?.[0] === 'admin' && (
            <Link to="/users" className="text-white">
              Users
            </Link>
          )}
          <Link to="/tasks" className="text-white">
            Tasks
          </Link>
          <span className="text-white">{auth?.user?.profile?.email}</span>
          <button
            onClick={signOutRedirect}
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

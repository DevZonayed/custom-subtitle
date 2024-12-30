import React from 'react';
import { NavLink } from 'react-router-dom';
import { Video, Home } from 'lucide-react';

export const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Video className="w-6 h-6" />
          <span className="text-xl font-bold">Video Platform</span>
        </div>
        <div className="flex space-x-6">
          <NavLink
            to="/public"
            className={({ isActive }) =>
              `flex items-center space-x-1 hover:text-gray-300 ${
                isActive ? 'text-blue-400' : ''
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span>Public</span>
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center space-x-1 hover:text-gray-300 ${
                isActive ? 'text-blue-400' : ''
              }`
            }
          >
            <span>Admin</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
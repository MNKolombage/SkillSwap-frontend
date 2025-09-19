import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  UserPlus, 
  Settings,
  BookOpen,
  User
} from 'lucide-react';

const SideBar = () => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'My Connections',
      href: '/connections',
      icon: Users
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User
    },
    {
      name: 'Connection Requests',
      href: '/requests',
      icon: UserPlus,
    },
    {
      name: 'Chat',
      href: '/chat',
      icon: MessageSquare
    },
    {
      name: 'Learning Path',
      href: '/learning',
      icon: BookOpen
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 bg-white border-r border-gray-200 pt-20 z-30">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg
                  ${isActive(item.href)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(item.href)
                      ? 'text-indigo-600'
                      : 'text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Section at Bottom */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            // Clear user session (customize as needed)
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;
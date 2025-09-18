import Logo from '../../assets/Logo.png';
import { Search, User, LogOut } from 'lucide-react'; 
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    // Clear any auth cookies
    document.cookie = `auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white fixed w-full top-0 z-50">
      {/* Left: Logo */}
      <Link to="/dashboard" className="flex items-center space-x-2">
        <img src={Logo} alt="SkillSwap Logo" className="h-8 w-auto" />
      </Link>

      {/* Middle: Search Bar */}
      <div className="flex-1 mx-6">
        <div className="relative w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search for skills or users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Right: Profile */}
      <div className="relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-1 rounded-md transition"
        >
          {user?.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.firstName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User className="text-gray-600" size={22} />
          )}
          <span className="font-medium text-gray-700">
            {user?.firstName || 'Guest'}
          </span>
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <Link 
              to="/profile" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setShowDropdown(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

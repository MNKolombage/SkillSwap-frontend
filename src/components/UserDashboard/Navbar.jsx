import React, { useEffect, useState, useRef } from 'react';
import Logo from '../../assets/Logo.png';
import { Search, User } from 'lucide-react';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [firstName, setFirstName] = useState('');
  const [show, setShow] = useState(true);
  const lastScroll = useRef(window.scrollY);

  useEffect(() => {
    // Get user first name from localStorage
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setFirstName(user?.firstName || '');
    } catch {
      setFirstName('');
    }
  }, []);

  useEffect(() => {
    // Hide on scroll up, show on scroll down
    const handleScroll = () => {
      const curr = window.scrollY;
      if (curr < 10) {
        setShow(true);
      } else if (curr > lastScroll.current) {
        setShow(false);
      } else {
        setShow(true);
      }
      lastScroll.current = curr;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md fixed w-full top-0 z-50 border-b border-gray-200 transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}
    >
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <img src={Logo} alt="SkillSwap Logo" className="h-10 w-auto" />
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-1 mx-6">
        <div className="relative w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Right: Profile */}
      <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 rounded-xl transition">
        <User className="text-gray-600" size={22} />
        <span className="font-medium text-gray-700">{firstName || 'Profile'}</span>
      </Link>
    </nav>
  );
};

export default Navbar;
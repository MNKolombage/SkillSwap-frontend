import Logo from '../../assets/Logo.png';
import { Search, User } from 'lucide-react'; // Added Search + User icons
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white fixed w-full top-0 z-50">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <img src={Logo} alt="SkillSwap Logo" className="h-8 w-auto" />
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-1 mx-6">
        <div className="relative w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Right: Profile */}
      <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-1 rounded-md transition">
        <User className="text-gray-600" size={22} />
        <span className="font-medium text-gray-700">Maleesha</span>
      </Link>
    </nav>
  );
};

export default Navbar;

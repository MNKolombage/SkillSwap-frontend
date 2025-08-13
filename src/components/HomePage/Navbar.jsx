import Logo from '../../assets/Logo.png';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; 
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white fixed w-full top-0 z-50">
      <div className="flex items-center space-x-2">
        <img src={Logo} alt="SkillSwap Logo" className="w-30 h-8" />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
        <li><a href="#" className='hover:text-primary'>Home</a></li>
        <li><a href="#" className='hover:text-primary'>About</a></li>
        <li><a href="#" className='hover:text-primary'>Contact Us</a></li>
      </ul>

      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden flex items-center space-x-3">
        <button onClick={toggleMenu} className="text-gray-700">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu (visible only when isMenuOpen is true) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md py-4 px-6 space-y-4 flex flex-col items-center">
          <ul className="space-y-4 text-gray-700 font-medium">
            <li><a href="#" onClick={toggleMenu} className='hover:text-primary'>Home</a></li>
            <li><a href="#" onClick={toggleMenu} className='hover:text-primary'>About</a></li>
            <li><a href="#" onClick={toggleMenu} className='hover:text-primary'>Contact Us</a></li>
          </ul>

          {/* Mobile Sign In and Register Buttons */}
          <div className="flex flex-col space-y-3 mt-4">
            <Link to="/login">
              <button className="px-4 py-1 border border-primary text-primary rounded transition hover:bg-primary hover:text-white">
                Sign In
              </button>
            </Link>
            <Link to="/login">
              <button className="px-4 py-1 bg-primary text-white rounded transition hover:bg-blue-700 hover:text-white">
                Register
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Desktop Buttons */}
      <div className="hidden md:flex space-x-3">
        <Link to="/login">
          <button className="px-4 py-1 border border-primary text-primary rounded transition hover:bg-primary hover:text-white">
            Sign In
          </button>
        </Link>
        <Link to="/login">
          <button className="px-4 py-1 bg-primary text-white rounded transition hover:bg-blue-700 hover:text-white">
            Register
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

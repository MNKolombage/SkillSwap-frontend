import Logo from '../../assets/Logo.png';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
      <div className="flex items-center space-x-2">
        <img src={Logo} alt="SkillSwap Logo" className="w-30 h-8" />
      </div>

      <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
        <li><a href="#" className="hover:text-primary">Home</a></li>
        <li><a href="#" className="hover:text-primary">About</a></li>
        <li><a href="#" className="hover:text-primary">Contact Us</a></li>
      </ul>

      <div className="flex space-x-3">
        <button className="px-4 py-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition">
          Sign In
        </button>
        <button className="px-4 py-1 bg-primary text-white rounded hover:bg-blue-700 transition">
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

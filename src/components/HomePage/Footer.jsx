import Logo from '../../assets/Logo.png';
import React from "react";
import { Home, Lock } from "lucide-react";

const Footer = () => {
    return(
        <footer className="bg-gray-100 py-6 border-t">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
                {/* Left section */}
                <div className="flex flex-col items-center md:items-start space-y-2">
                    <div className="flex items-center space-x-2">
                        <img src={Logo} alt="SkillSwap Logo" className="w-18 h-8" />
                    </div>
                    <p className="text-sm text-gray-600 italic">
                        — Where knowledge goes both ways —
                    </p>
                </div>

                {/* Middle section */}
                <div className="flex flex-col space-y-3 mt-4 md:mt-0">
                    <div className="flex items-center space-x-2">
                        <Home className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">Home</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">About Us</span>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex flex-col items-center md:items-end space-y-3 mt-4 md:mt-0">
                    <div className="flex space-x-2">
                        <button className="bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600 text-sm font-semibold">
                            SIGN IN
                        </button>
                        <button className="bg-indigo-300 text-indigo-900 px-4 py-1 rounded hover:bg-indigo-400 text-sm font-semibold">
                            REGISTER
                        </button>
                    </div>
                    <p className="text-sm">
                        Have questions? Email us at:{" "}
                        <a
                            href="mailto:support@skillswap.io"
                            className="text-indigo-500 hover:underline"
                        >
                            support@skillswap.io
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
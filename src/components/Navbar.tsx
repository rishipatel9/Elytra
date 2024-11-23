'use client'
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; 
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (

    <nav className="fixed top-0 left-0 right-0 z-20 w-full lg:p-6 p-4 backdrop-blur-2xl  border-b border-[#ffffff33] ">
        
      <div className="container flex justify-between items-center max-w-6xl mx-auto">
    
        <div className="text-xl font-bold text-white">Elytra</div>

        <div className="lg:hidden">
          <button onClick={toggleMenu}>
            {isMenuOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <Menu size={24} className="text-white" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex space-x-4">
          <Link href="#" className="hover:text-[#4220A9] transition-colors duration-200 text-white">
            Home
          </Link>
          <Link href="#" className="hover:text-[#4220A9] transition-colors duration-200 text-white">
            Features
          </Link>
          <Link href="#" className="hover:text-[#4220A9] transition-colors duration-200 text-white">
            About
          </Link>
          <Link href="/signup" className="hover:text-[#4220A9] transition-colors duration-200 text-white">
            SignUp
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-violet-900 opacity-15 backdrop-blur-3xl border-b p-4 border-t border-[#ffffff33] text-center">
          <Link href="#" className="block py-2 px-4 text-white hover:text-[#4220A9]">
            Home
          </Link>
          <Link href="#" className="block py-2 px-4 text-white hover:text-[#4220A9]">
            Features
          </Link>
          <Link href="#" className="block py-2 px-4 text-white hover:text-[#4220A9]">
            About
          </Link>
          <Link href="#" className="block py-2 px-4 text-white hover:text-[#4220A9]">
            Contact
          </Link>
          <Link href="/signup" className="block py-2 px-4 mt-4 text-white bg-[#4220A9] hover:bg-[#5f2cc7] rounded-md">
            SignUp
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

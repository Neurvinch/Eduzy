import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

const Navbar = () => {

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white px-4 py-4 md:py-6 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="h-6 md:h-8 text-lg md:text-2xl font-bold text-gray-800 ml-10 ">
          EDUZY
          
          </h1>
      </div>

      <div className="hidden md:flex items-center space-x-6">
        <a href="#" className="text-black hover:text-blue-primary font-medium"></a>
        <a href="/work" className="text-black hover:text-blue-primary font-medium"></a>
        <a href="https://tally.so/r/3EdYDB" className="text-black hover:text-blue-primary font-medium"></a>
        <ConnectButton/>
      </div>

      <div className="md:hidden">
        <button className="text-black focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

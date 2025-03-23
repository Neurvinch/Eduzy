import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from "react-router-dom";

const Navbar = () => {

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white px-4 py-4 md:py-6 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="h-6 md:h-8 text-lg md:text-2xl font-bold text-gray-800 ml-10 ">
          EDUZY
          
          </h1>
      </div>

      <div className="hidden md:flex items-center space-x-6">
        <Link to="/ComeAndStake" className="text-black hover:text-blue-primary font-medium">
          Stake
        </Link>
        <Link to="/NFTrentAndMint" className="text-black hover:text-blue-primary font-medium">
        NFTrentAndMint
        </Link>
        <Link to="/MintingToken" className="text-black hover:text-blue-primary font-medium">
        MintingToken
        </Link>
        <Link to="/TokenSwap" className="text-black hover:text-blue-primary font-medium">
        TokenSwap
        </Link>
        <Link to="/Events" className="text-black hover:text-blue-primary font-medium">
        Events
        </Link>
        <Link to="/Voting" className="text-black hover:text-blue-primary font-medium">
        voting
        </Link>
<<<<<<< HEAD
       < Link to="/Games" className="text-black hover:text-blue-primary font-medium">
        Games
=======
        <Link to="/LiveStreaming" className="text-black hover:text-blue-primary font-medium">
        Live
>>>>>>> a28d95a1584ffba965700eeea109656029619e4b
        </Link>
        <ConnectButton />
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ethers, parseEther } from 'ethers';
import ABI from '../ABI/rentAndMint.json';

const NFTrentAndMint = () => {
    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [tokenId, setTokenId] = useState('');
    const [description, setDescription] = useState('');
    const [ipfsHash, setIpfsHash] = useState('');
    const [rentalPrice, setRentalPrice] = useState('');
    const [mediaType, setMediaType] = useState('');
    const [duration, setDuration] = useState('');
    const [nftDetails, setNftDetails] = useState(null);
    const [activeRenters, setActiveRenters] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const contractAddress = "0x83fB54D5Cdc0048c997f4e27d38bB43960bEe1B2";

    const getContract = async () => {
        if (!walletClient) return null;
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        return new ethers.Contract(contractAddress, ABI, signer);
    };

    const checkOwner = async () => {
        const contract = await getContract();
        if (!contract || !address) return;
        const owner = await contract.owner();
        setIsOwner(owner.toLowerCase() === address.toLowerCase());
    };

    const handleMint = async () => {
        try {
            const contract = await getContract();
            if (!contract || !tokenId || !description || !ipfsHash || !rentalPrice || !mediaType) return;

            const tx = await contract.mintPost(
                address,
                tokenId,
                description,
                ipfsHash,
                parseEther(rentalPrice),
                mediaType
            );
            await tx.wait();
            setSuccessMessage("Mint successful: " + tx.hash);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage("Mint error: " + error.message);
        }
    };

    const handleRent = async () => {
        try {
            const contract = await getContract();
            if (!contract || !tokenId || !rentalPrice || !duration) return;

            const rentalPricePerSecond = parseEther(rentalPrice);
            const totalCost = rentalPricePerSecond * BigInt(duration);

            const tx = await contract.rentPost(tokenId, duration, { value: totalCost });
            await tx.wait();
            setSuccessMessage("Rented successfully: " + tx.hash);
            setErrorMessage('');
            fetchActiveRenters();
        } catch (error) {
            setErrorMessage("Rent error: " + error.message);
        }
    };

    const handleUpdatePrice = async () => {
        try {
            const contract = await getContract();
            if (!contract || !tokenId || !rentalPrice) return;

            const tx = await contract.updateRentalPrice(tokenId, parseEther(rentalPrice));
            await tx.wait();
            setSuccessMessage("Price updated successfully: " + tx.hash);
            setErrorMessage('');
            fetchNftDetails();
        } catch (error) {
            setErrorMessage("Update Price error: " + error.message);
        }
    };

    const handleWithdrawFees = async () => {
        try {
            const contract = await getContract();
            if (!contract) return;

            const tx = await contract.withdrawPlatformFees();
            await tx.wait();
            setSuccessMessage("Fees withdrawn successfully: " + tx.hash);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage("Withdraw fees error: " + error.message);
        }
    };

    const fetchNftDetails = async () => {
        try {
            const contract = await getContract();
            if (!contract || !tokenId) return;

            const [desc, pricePerSecond, mtype, uri] = await contract.getNFTDetails(tokenId);

            setNftDetails({
                description: desc,
                rentalPricePerSecond: ethers.utils.formatEther(pricePerSecond),
                mediaType: mtype,
                tokenURI: uri
            });
        } catch (error) {
            setErrorMessage("Fetch NFT Details error: " + error.message);
        }
    };

    const fetchActiveRenters = async () => {
        try {
            const contract = await getContract();
            if (!contract || !tokenId) return;
            const renters = await contract.getActiveRenters(tokenId);
            setActiveRenters(renters);
        } catch (error) {
            setErrorMessage("Fetch Active Renters error: " + error.message);
        }
    };

    useEffect(() => {
        if (isConnected && address) {
            checkOwner();
            if (tokenId) {
                fetchNftDetails();
                fetchActiveRenters();
            }
        }
    }, [address, isConnected, tokenId]);

    return (
        <div className="relative min-h-screen bg-gray-100">
      {/* Background grid */}
      <div className="absolute inset-0 bg-white" style={{ backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Header */}
      <header className="relative p-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-orange-600">byooooob</h1>
        </div>
        <div className="absolute top-4 right-4 flex space-x-1">
          <div className="flex flex-wrap w-12">
            <div className="w-2 h-2 bg-black rounded-full m-1"></div>
            <div className="w-2 h-2 bg-black rounded-full m-1"></div>
            <div className="w-2 h-2 bg-black rounded-full m-1"></div>
            <div className="w-2 h-2 bg-black rounded-full m-1"></div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="relative px-6 pt-8 pb-24">
        {/* Decorative elements */}
        <div className="absolute left-8 top-20">
          <svg width="80" height="80" viewBox="0 0 100 100" className="w-20 h-20">
            <path d="M50,0 L60,40 L100,50 L60,60 L50,100 L40,60 L0,50 L40,40 Z" stroke="black" strokeWidth="2" fill="none"></path>
          </svg>
        </div>
        
        <div className="absolute right-12 top-24">
          <svg width="40" height="40" viewBox="0 0 100 100" className="w-10 h-10">
            <path d="M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z" fill="#FF5722" stroke="none"></path>
          </svg>
        </div>
        
        {/* Main form container */}
        <div className="relative z-10 max-w-lg mx-auto mt-12 bg-white rounded-xl p-6 border-2 border-black shadow-lg" style={{ boxShadow: '8px 8px 0 rgba(0,0,0,1)' }}>
          <h2 className="text-4xl font-black text-center mb-2">NFT RENTING</h2>
          <h3 className="text-3xl font-bold text-center text-pink-400 mb-6">DAPP</h3>
          
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Token ID" 
                value={tokenId} 
                onChange={(e) => setTokenId(e.target.value)} 
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-yellow-100"
              />
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-green-100"
              />
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="IPFS Hash" 
                value={ipfsHash} 
                onChange={(e) => setIpfsHash(e.target.value)} 
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-blue-100"
              />
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Rental Price" 
                value={rentalPrice} 
                onChange={(e) => setRentalPrice(e.target.value)} 
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-pink-100"
              />
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Media Type" 
                value={mediaType} 
                onChange={(e) => setMediaType(e.target.value)} 
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-orange-100"
              />
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Duration" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-purple-100"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
              onClick={handleMint} 
              className="relative bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transform transition-transform hover:scale-105 hover:bg-indigo-700"
            >
              MINT
            </button>
            
            <button 
              onClick={handleRent} 
              className="relative bg-pink-500 text-white font-bold py-3 px-4 rounded-lg transform transition-transform hover:scale-105 hover:bg-pink-600"
            >
              RENT
            </button>
            
            <button 
              onClick={handleUpdatePrice} 
              className="relative bg-green-500 text-white font-bold py-3 px-4 rounded-lg transform transition-transform hover:scale-105 hover:bg-green-600"
            >
              UPDATE PRICE
            </button>
            
            <button 
              onClick={handleWithdrawFees} 
              className="relative bg-orange-500 text-white font-bold py-3 px-4 rounded-lg transform transition-transform hover:scale-105 hover:bg-orange-600"
            >
              WITHDRAW FEES
            </button>
          </div>
          
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{errorMessage}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700">
              <p>{successMessage}</p>
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute left-6 bottom-20">
          <div className="flex space-x-0">
            <div className="w-6 h-12 bg-green-600 rounded-l-full"></div>
            <div className="w-6 h-12 bg-green-600 opacity-80 rounded-l-full transform -translate-x-3"></div>
            <div className="w-6 h-12 bg-green-600 opacity-60 rounded-l-full transform -translate-x-6"></div>
          </div>
        </div>
        
        <div className="absolute right-6 bottom-12">
          <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center transform rotate-12">
            <div className="w-12 h-12 rounded-full border-2 border-black relative">
              <div className="absolute inset-0 border-t-2 border-l-2 border-gray-800 rounded-full transform rotate-45"></div>
              <div className="absolute inset-0 border-b-2 border-r-2 border-gray-800 rounded-full transform rotate-45"></div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Purple band */}
      <div className="bg-indigo-600 py-2 relative overflow-hidden">
        <div className="flex items-center animate-marquee whitespace-nowrap">
          <span className="text-lg text-pink-200 mx-4">MINT YOUR NFT • RENT WITH EASE • EARN PASSIVE INCOME</span>
          <div className="w-6 h-6 mx-4 bg-pink-300 rounded-full"></div>
          <span className="text-lg text-pink-200 mx-4">MINT YOUR NFT • RENT WITH EASE • EARN PASSIVE INCOME</span>
        </div>
      </div>
      
      
      </div>
    
  );
};


export default NFTrentAndMint;

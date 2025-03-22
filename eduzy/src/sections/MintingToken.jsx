import React,{useEffect, useState} from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import {ethers, parseEther} from "ethers"
import ABI from "../ABI/token_creation.json"
import { Token_contract_adddress } from "../contract_address/tokenCreation"

const MintingToken = () => {
    const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [balance, setBalance] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [mintTo, setMintTo] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  const getContract = async () => {
    if(!walletClient) return null;
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    return  new ethers.Contract(Token_contract_adddress, ABI , signer) ;

  }         
  const checkOWner = async () => {
    const contract = await getContract();
    if(!contract || !address) return;
    const owner = await contract.owner();
    setIsOwner(owner.toLowerCase() === address.toLowerCase());
  }
  const fetchBalance = async () =>{
    try {
        const contract = await getContract();
        if(!contract ||     !address) return;

        const bal = await contract.balanceOf(address);
        setBalance(ethers.formatEther(bal));
    } catch (error) {
        console.log(error);
    }
  }

  const fetchTotalSupply = async () =>{
    try {
        const contract = await getContract();
        if(!contract || !address) return;
        

        const amount = parseEther(mintAmount);
        const tx = await contract.mint(mintTo, amount);
        await tx.wait();
        fetchTotalSupply();
        fetchBalance()
        
    } catch (error) {
        console.log(error);
        
    }
  }

  const handleMint = async () =>{
     try {
        const contract = await getContract();
        if(!contract || !address) return;
        const amount = parseEther(mintAmount);
        const tx = await contract.mint(mintTo, amount);
        await tx.wait();
        fetchTotalSupply();
        fetchBalance()
        
     } catch (error) {
        console.log(error);
        
     }
  }
    useEffect( ()=>{
        if(isConnected && address){
            checkOWner();
            fetchBalance();
            fetchTotalSupply();
        }
    },[address,isConnected]);
  return (
    <div className="relative min-h-screen">
      {/* Background grid */}
      <div className="absolute inset-0 bg-white" style={{ backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Header */}
      <header className="relative p-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-orange-600">ExclusiveToken</h1>
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
      <main className="relative px-6 pt-8">
        {/* Decorative elements */}
        <div className="absolute left-8 top-20">
          <svg width="80" height="80" viewBox="0 0 100 100" className="w-20 h-20">
            <path d="M50,0 L60,40 L100,50 L60,60 L50,100 L40,60 L0,50 L40,40 Z" stroke="black" strokeWidth="2" fill="none"></path>
          </svg>
        </div>
        
        <div className="absolute right-12 top-24">
          <svg width="40" height="40" viewBox="0 0 100 100" className="w-12 h-12">
            <path d="M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z" fill="#FF5722" stroke="none"></path>
          </svg>
        </div>
        
        {/* Main content section */}
        <div className="relative z-10 mt-12 mb-12 text-center px-4 max-w-lg mx-auto">
          <h2 className="text-4xl font-black mb-8">EXCLUSIVE TOKEN</h2>
          <h2 className="text-4xl font-black">DAPP</h2>
          
          {isConnected ? (
            <div className="mt-12">
              {/* Token Info Section */}
              <div className="bg-white border-2 border-black rounded-lg p-6 mb-8 relative">
                <div className="absolute top-0 right-0 w-8 h-8 bg-pink-400 transform translate-x-2 -translate-y-2"></div>
                <h2 className="text-2xl font-bold mb-4 text-indigo-600">TOKEN INFO</h2>
                <div className="flex justify-between items-center mb-4 p-2 bg-gray-100 rounded">
                  <span className="font-bold">Balance:</span>
                  <span className="bg-yellow-300 px-3 py-1 rounded-full font-bold">
                    {balance ? `${balance} EXT` : "Loading..."}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span className="font-bold">Total Supply:</span>
                  <span className="bg-green-300 px-3 py-1 rounded-full font-bold">
                    {totalSupply ? `${totalSupply} EXT` : "Loading..."}
                  </span>
                </div>
              </div>
              
              {/* Mint Section (Owner Only) */}
              {isOwner && (
                <div className="bg-white border-2 border-black rounded-lg p-6 relative">
                  <div className="absolute top-0 left-0 w-8 h-8 bg-orange-400 transform -translate-x-2 -translate-y-2"></div>
                  <h2 className="text-2xl font-bold mb-4 text-pink-500">MINT TOKENS</h2>
                  
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Recipient Address"
                      value={mintTo}
                      onChange={(e) => setMintTo(e.target.value)}
                      className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Amount (ETH)"
                      value={mintAmount}
                      onChange={(e) => setMintAmount(e.target.value)}
                      className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-black rounded-full transform translate-x-2 translate-y-2"></div>
                      <button 
                        onClick={handleMint}
                        className="relative bg-indigo-600 text-white px-8 py-3 rounded-full border-2 border-black font-bold"
                      >
                        MINT TOKENS
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-12">
              <div className="relative bg-white border-2 border-black rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h3>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-black rounded-full transform translate-x-2 translate-y-2"></div>
                  <button className="relative bg-yellow-400 px-8 py-3 rounded-full border-2 border-black font-bold">
                    CONNECT WALLET
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Purple band */}
      <div className="bg-indigo-600 py-2 relative mt-12 overflow-hidden">
        <div className="flex items-center animate-marquee whitespace-nowrap">
          <span className="text-xl text-pink-200 mx-4">EXCLUSIVE TOKEN • MINT NOW • EXCLUSIVE TOKEN</span>
          <div className="w-8 h-8 mx-4 bg-pink-300 rounded-full"></div>
          <span className="text-xl text-pink-200 mx-4">EXCLUSIVE TOKEN • MINT NOW • EXCLUSIVE TOKEN</span>
        </div>
      </div>
      
      {/* Bottom decorative element */}
      <div className="relative bg-pink-200 py-12">
        <div className="absolute right-12 top-0 transform -translate-y-1/2">
          <div className="bg-indigo-600 transform -rotate-12 rounded-full px-6 py-4">
            <div className="text-center">
              <div className="text-white text-lg font-bold">EXT TOKEN</div>
              <div className="text-yellow-300 text-lg font-bold">WEB3 READY</div>
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default MintingToken
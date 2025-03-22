import React,{useEffect,useState} from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import {ethers, parseEther} from "ethers"
import ABI from "../ABI/token_swap.json"
import ABITK  from "../ABI/token_creation.json"
import { token_swap_address} from "../contract_address/token_swap"
import { Token_contract_adddress} from '../contract_address/tokenCreation'

const TokenSwap = () => {
    const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [ethAmount, setEthAmount] = useState('');
  const [tokenBalance, setTokenBalance] = useState(null);
  const [swapRate, setSwapRate] = useState(null);
  const [newRate, setNewRate] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  const getContract = async () =>{
    if(!walletClient) return null;
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    return  new ethers.Contract(token_swap_address, ABI , signer) ;
  }
  const getExclusivetokenContract = async () =>{
    if(!walletClient) return null;
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    return  new ethers.Contract(Token_contract_adddress, ABITK , signer) ;
  }
    const checkOwner = async () => {
        const contract = await getContract();
        if(!contract || !address) return;
    
        const owner = await contract.owner();
        setIsOwner(owner.toLowerCase() === address.toLowerCase());
    }

    const fetchBalance = async () =>{
        try {
            const tokencontract = await getExclusivetokenContract();
            if(!tokencontract || !address) return;
    
            const bal = await tokencontract.balanceOf(address);
            setTokenBalance(ethers.formatEther(bal));
        } catch (error) {
            console.log(error);
        }
    }

    const fetchSwapRate = async () => {
        try {
            const swapcontract = await getContract();
            if(!swapcontract || !address) return;
    
            const rate = await swapcontract.rate();
            setSwapRate(rate.toString());

        } catch (error) {
            console.log(error);
        }
    }
    const handleSwap = async () =>{
        try {
            const swapcontract = await getContract();

            if(!swapcontract) return;
            const cryvalue = parseEther(ethAmount);
            const tx = await swapcontract.swap({value:cryvalue});
            await tx.wait();
            fetchBalance();
            console.log("Transaction mined");

            
        } catch (error) {
            console.log(error);
        }
    }

    const handleWithdraw = async () => {
        try {
            const swapcontract = await getContract();
            if(!swapcontract) return;
            const tx = await swapcontract.withdraw();
            await tx.wait();
            console.log("Transaction mined");
            
        } catch (error) {
            console.log(error);
        }
    } ;

     const handleUpdateRate = async () =>{
        try {
            const swapcontract = await getContract();
             if(!swapcontract) return;

             const tx = await swapcontract.updateRate(newRate);
                await tx.wait();
                fetchSwapRate();
                console.log("Transaction mined");
            
        } catch (error) {
            console.log(error);
        }
     }
  
    useEffect( ()=>{
        if(isConnected && address){
            checkOwner();
            fetchBalance();
            fetchSwapRate();
        } },[ isConnected,address])
  return (
  
<div className="relative min-h-screen mt-20 bg-white  mr-[250px] ml-[250px]" style={{ backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      {/* Decorative elements */}
      <div className="absolute top-16 right-24 w-12 h-12 bg-orange-500 rounded-full animate-pulse "></div>
      <div className="absolute bottom-32 left-16 w-10 h-10">
        <svg viewBox="0 0 40 40" className="w-10 h-10">
          <path d="M20,0 L25,15 L40,20 L25,25 L20,40 L15,25 L0,20 L15,15 Z" stroke="black" strokeWidth="1" fill="none"></path>
        </svg>
      </div>
      <div className="absolute top-40 left-8 w-8 h-16 bg-green-600 rounded-l-full"></div>

      <div className="container px-4 py-8 relative z-10  ">
        <h1 className="text-4xl font-black text-center mb-8">
          <span className="text-orange-600">Token</span>
          <span className="text-black">Swap</span> 
          <span className="text-pink-400">DApp</span>
        </h1>
        
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-black rounded-full transform translate-x-1 translate-y-1"></div>
            
          </div>
        </div>

        {isConnected && (
          <>
            <div className="bg-white border-2 border-black rounded-lg p-6 mb-8 shadow-lg transform hover:scale-105 transition-transform">
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">Swap Info</h2>
              <p className="text-lg mb-2">EXT Balance: <span className="font-bold">{tokenBalance ? `${tokenBalance} EXT` : "Loading..."}</span></p>
              <p className="text-lg">Swap Rate: <span className="font-bold">{swapRate ? `${swapRate} EXT per ETH` : "Loading..."}</span></p>
            </div>

            {/* Swap Section */}
            <div className="bg-white border-2 border-black rounded-lg p-6 mb-8 shadow-lg transform hover:scale-105 transition-transform">
              <h2 className="text-2xl font-bold text-pink-400 mb-4">Swap ETH for EXT</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="ETH Amount"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value)}
                  className="border-2 border-black rounded-lg px-4 py-2 flex-grow"
                />
                <div className="relative">
                  <div className="absolute inset-0 bg-black rounded-full transform translate-x-1 translate-y-1"></div>
                  <button 
                    onClick={handleSwap} 
                    className="relative bg-yellow-400 px-6 py-2 rounded-full font-bold border-2 border-black"
                  >
                    Swap
                  </button>
                </div>
              </div>
            </div>

            {/* Owner Functions */}
            {isOwner && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform">
                  <h2 className="text-2xl font-bold text-green-600 mb-4">Withdraw ETH</h2>
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-black rounded-full transform translate-x-1 translate-y-1"></div>
                    <button 
                      onClick={handleWithdraw} 
                      className="relative bg-orange-500 px-6 py-2 rounded-full font-bold border-2 border-black text-white"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>

                <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform">
                  <h2 className="text-2xl font-bold text-indigo-600 mb-4">Update Swap Rate</h2>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      placeholder="New Rate (EXT per ETH)"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      className="border-2 border-black rounded-lg px-4 py-2 flex-grow"
                    />
                    <div className="relative">
                      <div className="absolute inset-0 bg-black rounded-full transform translate-x-1 translate-y-1"></div>
                      <button 
                        onClick={handleUpdateRate} 
                        className="relative bg-green-500 px-6 py-2 rounded-full font-bold border-2 border-black text-white"
                      >
                        Update Rate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer banner */}
        <div className="bg-indigo-600 py-2 mt-12 overflow-hidden rounded-lg">
          <div className="flex items-center">
            <span className="text-lg text-pink-200 mx-4 font-bold">SWAP YOUR TOKENS • SECURE YOUR FUTURE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TokenSwap

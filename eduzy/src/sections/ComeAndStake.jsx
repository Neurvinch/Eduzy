import React, { useEffect, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import {ethers,parseEther} from "ethers"
import ABI from "../ABI/register.json"

const ComeAndStake = () => {
    const {address ,isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [username, setUsername] = useState("");
    const[ipfsHash , setIpfsHash] = useState("");
    const[userInfo, setUserInfo] = useState(null);
    const contract_address = "0xaCB9e846a78a32Ba084a4BA6669C7D71880c3475"

     const getContract = async () =>{
        if(!walletClient) return null;
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        return  new ethers.Contract(contract_address, ABI , signer) ;
     } 

      const handleRegister = async () =>{
        try {
            const contract = await getContract();
            if(!contract) return;

            const tx = await contract.stakeAmountAndRegister(username ,ipfsHash, {
                value : parseEther("0.0000001")
            });
            const result=await tx.wait();
            console.log(result)
            console.log("Transaction mined")

            
        } catch (error) {
            console.log(error)
            
        }
      }

        const handleDeactivate = async () => {
            try {
                const contract = await getContract();
                if(!contract) return;
                const tx = await contract.deactivate();
                 await tx.wait();
                 fetchUserInfo();
                
            } catch (error) {
                console.log(error)
            }
        }

        const handleWithdraw = async () => {
            try {
                const contract = await getContract();
                if(!contract) return;
                const tx = await contract.withdrawEth();
                 await tx.wait();
                 fetchUserInfo();
                
            } catch (error) {
                 console.log(error)
            }
        } 
          const fetchUserInfo = async () =>{
            try {
                const contract = await getContract();
                if(!contract || !address) return ;
                const [username , ipfsHash , stakeAmount, isActive ]  = await contract.checkWhetherIsRegistered(address)
                
                setUserInfo({
                    username: username ,
                    ipfsHash : ipfsHash,
                    stakeAmount : ethers.formatEther(stakeAmount),
                    isActive : isActive
                });
            } catch (error) {
                console.log(error)
            }
          }  
            useEffect( () => {
                if(isConnected && address) {
                    fetchUserInfo();
                }
            },[address , isConnected]);
  return (
    <div className="relative min-h-screen bg-gray-100">
    {/* Background grid */}
    <div className="absolute inset-0 bg-white" style={{ backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    
    {/* Header */}
    <header className="relative p-4">
      <div className="text-left">
        <h1 className="text-3xl font-bold text-orange-600">ComeAndStake</h1>
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
    <main className="relative px-6 pt-8 pb-20">
      {/* Decorative elements */}
      <div className="absolute left-8 top-24">
        <svg width="80" height="80" viewBox="0 0 100 100" className="w-20 h-20">
          <path d="M50,0 L60,40 L100,50 L60,60 L50,100 L40,60 L0,50 L40,40 Z" stroke="black" strokeWidth="2" fill="none"></path>
        </svg>
      </div>
      
      <div className="absolute right-12 top-20">
        <svg width="50" height="50" viewBox="0 0 100 100" className="w-12 h-12">
          <path d="M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z" fill="#FF5722" stroke="none"></path>
        </svg>
      </div>
      
      {/* Main form and info section */}
      <div className="relative z-10 mt-12 mb-8 text-center px-8 max-w-md mx-auto">
        <h2 className="text-4xl font-black mb-2">STAKE YOUR</h2>
        <h2 className="text-4xl font-bold text-pink-400 mb-8">CRYPTO</h2>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-black rounded-lg transform translate-x-1 translate-y-1"></div>
          <div className="relative bg-white rounded-lg p-6 border-2 border-black">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="IPFS Hash"
                value={ipfsHash}
                onChange={(e) => setIpfsHash(e.target.value)}
                className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <button 
              onClick={handleRegister}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg border-2 border-black transition-colors"
            >
              Stake & Register
            </button>
          </div>
        </div>
        
        {/* User Info Section */}
        <div className="relative mt-8">
          <div className="absolute inset-0 bg-black rounded-lg transform translate-x-1 translate-y-1"></div>
          <div className="relative bg-white rounded-lg p-6 border-2 border-black">
            <h2 className="text-2xl font-bold mb-4 text-indigo-600">User Info</h2>
            
            {userInfo ? (
              <div className="text-left">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
                  <p><span className="font-bold">Username:</span> {userInfo.username}</p>
                </div>
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-pink-400 rounded-full mr-2"></div>
                  <p><span className="font-bold">IPFS Hash:</span> {userInfo.ipfsHash}</p>
                </div>
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <p><span className="font-bold">Staked Amount:</span> {userInfo.stakedAmount} ETH</p>
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <p><span className="font-bold">Active:</span> {userInfo.isActive ? "Yes" : "No"}</p>
                </div>
                
                {userInfo.isActive && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <button 
                      onClick={handleDeactivate}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg border-2 border-black transition-colors"
                    >
                      Deactivate
                    </button>
                    <button 
                      onClick={handleWithdraw}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg border-2 border-black transition-colors"
                    >
                      Withdraw Stake
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-400 text-gray-500">
                No user info available
              </div>
            )}
          </div>
        </div>
      </div>
      
      
    </main>
  
    
   
      
      
  </div>
);
};


export default ComeAndStake
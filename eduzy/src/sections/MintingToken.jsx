import React,{useEffect, useState} from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import {ethers, parseEther} from "ethers"
import ABI from "../ABI/token_creation.json"
import { contract_address } from "../contract_address/tokenCreation"

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
    return  new ethers.Contract(contract_address, ABI , signer) ;

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
    <div>
      <h1>ExclusiveToken DApp</h1>
      

      {isConnected && (
        <>
          <div>
            <h2>Token Info</h2>
            <p>Balance: {balance ? `${balance} EXT` : "Loading..."}</p>
            <p>Total Supply: {totalSupply ? `${totalSupply} EXT` : "Loading..."}</p>
          </div>

          {/* Mint Section (Owner Only) */}
          {isOwner && (
            <div>
              <h2>Mint Tokens</h2>
              <input
                type="text"
                placeholder="Recipient Address"
                value={mintTo}
                onChange={(e) => setMintTo(e.target.value)}
              />
              <input
                type="text"
                placeholder="Amount (ETH)"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
              />
              <button onClick={handleMint}>Mint Tokens</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MintingToken
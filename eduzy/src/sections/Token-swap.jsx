import React,{useEffect} from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import {ethers, parseEther} from "ethers"
import ABI from "../ABI/token_swap.json"
import ABITK  from "../ABI/token_creation.json"
import { token_swap_address} from "../contract_address/token_swap"
import { Token_contract_adddressS } from '../contract_address/tokenCreation'
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
    return  new ethers.Contract(Token_contract_adddressS, ABITK , signer) ;
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
            setSwapRate(rate.toSting());
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
    <div>
    <h1>TokenSwap DApp</h1>
    <ConnectButton />

    {isConnected && (
      <>
        <div>
          <h2>Swap Info</h2>
          <p>EXT Balance: {tokenBalance ? `${tokenBalance} EXT` : "Loading..."}</p>
          <p>Swap Rate: {swapRate ? `${swapRate} EXT per ETH` : "Loading..."}</p>
        </div>

        {/* Swap Section */}
        <div>
          <h2>Swap ETH for EXT</h2>
          <input
            type="text"
            placeholder="ETH Amount"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
          />
          <button onClick={handleSwap}>Swap</button>
        </div>

        {/* Owner Functions */}
        {isOwner && (
          <>
            <div>
              <h2>Withdraw ETH</h2>
              <button onClick={handleWithdraw}>Withdraw</button>
            </div>

            <div>
              <h2>Update Swap Rate</h2>
              <input
                type="text"
                placeholder="New Rate (EXT per ETH)"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
              />
              <button onClick={handleUpdateRate}>Update Rate</button>
            </div>
          </>
        )}
      </>
    )}
  </div>
  )
}


export default TokenSwap
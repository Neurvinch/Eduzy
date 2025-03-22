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
    <div>ComeAndStake
        <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="IPFS Hash"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
            />
            <button onClick={handleRegister}>Stake & Register</button>
            <div>
            <h2>User Info</h2>
            {userInfo ? (
              <>
                <p>Username: {userInfo.username}</p>
                <p>IPFS Hash: {userInfo.ipfsHash}</p>
                <p>Staked Amount: {userInfo.stakedAmount} ETH</p>
                <p>Active: {userInfo.isActive ? "Yes" : "No"}</p>
                {userInfo.isActive && (
                  <>
                    <button onClick={handleDeactivate}>Deactivate</button>
                    <button onClick={handleWithdraw}>Withdraw Stake</button>
                  </>
                )}
              </>
            ) : (
              <p>No user info available</p>
            )}
          </div>
    </div>
  )
}

export default ComeAndStake
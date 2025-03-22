
import React ,{useEffect, useState} from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import {ethers, parseEther} from "ethers"
import ABI from "../ABI/rentAndMint.json"

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
  const contract_address = "0x83fB54D5Cdc0048c997f4e27d38bB43960bEe1B2"

  const getContract = async () => {
    if (!walletClient) return null;
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    return new ethers.Contract(contract_address, ABI, signer);
  };

   const chechOwner = async () => {
    const contract = await getContract();
    if(!contract || !address) return;

    const owner = await contract.owner();
    setIsOwner(owner.toLowerCase( ) === address.toLowerCase()); 
   }

   const handleMint = async () => {
    try {
        const contract = await getContract();

        if(!contract) return;

        const tx = await contract.mintPost(
            address,
            tokenId,
            description,
            ipfsHash,
            parseEther(rentalPrice),
            mediaType
        );
        await tx.wait();
         console.log("Mint successful", tx.hash);
        
    } catch (error) {
        console.log(error);
    }
   }  

   const handleRent = async () =>{
    try {
        const contract = await getContract();

        if(!contract) return;

        const rentalPricePerSecond = parseEther(rentalPrice);
        const totalCost = rentalPricePerSecond * BigInt(duration);

        const tx = await contract.rentPost(tokenId, duration, {
            value: totalCost
        });
        await tx.wait();
        console.log("Rented successfully", tx.hash);
        fetchActiveRenters(tokenId)
        
    } catch (error) {
        
    }
   }

   const handleUpdatePrice = async () =>{
    try {
        const contract = await getContract();

        if(!contract) return;

        const tx = await contract.updateRentalPrice(tokenId, parseEther(rentalPrice));
        await tx.wait();
        console.log("Price updated successfully", tx.hash);
        fetchNftDetails(tokenId);
    } catch (error) {
        console.log(error);
    }
   }

   const handleWithdrawFees = async () => {
    try {
        const contract = await getContract();
        if(!contract) return;
        const tx = await contract.withdrawPlatformFees();
        await tx.wait();
        console.log("Fees withdrawn successfully", tx.hash);
        
    } catch (error) {
        console.log(error);
    }
   }

   const fetchNftDetails = async () =>{
    try {
        const contract = await getContract();
         if(!contract) return;

         const [desc , pricePerSecond ,mtype,uri] = await contract.getNFTDetails(id);

         setNftDetails({
            description: desc,
            rentalPrice: ethers.formatEther(pricePerSecond),
            mediaType: mtype,
            tokenURI: uri
         })
        
    } catch (error) {
        console.log(error);
    }
   }

   const fetchActiveRenters =async () => {
    try {
        const contract = await getContract();
        if(!contract) return;
        const renters = await contract.getActiveRenters(id);
        setActiveRenters(renters);
        
    } catch (error) {
        console.log(error);
    }
}

useEffect( () =>{
    if(isConnected && address) {
        chechOwner();
        if(tokenId) {
            fetchNftDetails(tokenId);
            fetchActiveRenters(tokenId);
        }
    }
},[address , isConnected, tokenId])
  return (
    <div>
      <h1>NFT Renting DApp</h1>
   

      {isConnected && (
        <>
          {/* Mint Section (Owner Only) */}
          {isOwner && (
            <div>
              <h2>Mint New NFT Post</h2>
              <input
                type="text"
                placeholder="Token ID"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="text"
                placeholder="IPFS Hash"
                value={ipfsHash}
                onChange={(e) => setIpfsHash(e.target.value)}
              />
              <input
                type="text"
                placeholder="Rental Price (ETH/sec)"
                value={rentalPrice}
                onChange={(e) => setRentalPrice(e.target.value)}
              />
              <input
                type="text"
                placeholder="Media Type"
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
              />
              <button onClick={handleMint}>Mint Post</button>
            </div>
          )}

          {/* Rent Section */}
          <div>
            <h2>Rent NFT Post</h2>
            <input
              type="text"
              placeholder="Token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Duration (seconds)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <input
              type="text"
              placeholder="Rental Price (ETH/sec)"
              value={rentalPrice}
              onChange={(e) => setRentalPrice(e.target.value)}
            />
            <button onClick={handleRent}>Rent Post</button>
          </div>

          {/* Update Price Section */}
          <div>
            <h2>Update Rental Price</h2>
            <input
              type="text"
              placeholder="Token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
            <input
              type="text"
              placeholder="New Price (ETH/sec)"
              value={rentalPrice}
              onChange={(e) => setRentalPrice(e.target.value)}
            />
            <button onClick={handleUpdatePrice}>Update Price</button>
          </div>

          {/* Withdraw Fees (Owner Only) */}
          {isOwner && (
            <div>
              <h2>Withdraw Platform Fees</h2>
              <button onClick={handleWithdrawFees}>Withdraw Fees</button>
            </div>
          )}

          {/* NFT Details */}
          <div>
            <h2>NFT Details</h2>
            {nftDetails ? (
              <>
                <p>Description: {nftDetails.description}</p>
                <p>Rental Price/sec: {nftDetails.rentalPricePerSecond} ETH</p>
                <p>Media Type: {nftDetails.mediaType}</p>
                <p>Token URI: {nftDetails.tokenURI}</p>
              </>
            ) : (
              <p>Enter a Token ID to view details</p>
            )}
          </div>

          {/* Active Renters */}
          <div>
            <h2>Active Renters</h2>
            {activeRenters.length > 0 ? (
              <ul>
                {activeRenters.map((renter, index) => (
                  <li key={index}>{renter}</li>
                ))}
              </ul>
            ) : (
              <p>No active renters</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default NFTrentAndMint
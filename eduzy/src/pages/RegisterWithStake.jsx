// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';

// const contractAddress = "0xEf9f1ACE83dfbB8f559Da621f4aEA72C6EB10eBf"; // Replace with your deployed contract address
// import contractABI from "../ABI/register.json" 
// import { useAccount } from 'wagmi';

// const RegisterWithStakeUI = () => {
//     // State variables
//     const [contract, setContract] = useState(null);
//     const [signerAddress, setSignerAddress] = useState('');
//     const [username, setUsername] = useState('');
//     const [ipfsHash, setIpfsHash] = useState('');
//     const [stakeAmount, setStakeAmount] = useState('');
//     const [userAddressForInfo, setUserAddressForInfo] = useState('');
//     const [userInfo, setUserInfo] = useState(null);
//     const [eventLogs, setEventLogs] = useState([]);

//     // Connect to wallet
//     const connectWallet = async () => {
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     const signer = await provider.getSigner();

//     const contract = new ethers.Contract(contractAddress, contractABI, signer)
//     };

//     // Initialize contract
//     const getContract = async () => {
//         const signer = await connectWallet();
//         if (!signer) throw new Error("Failed to connect to wallet");
//         const contract = new ethers.Contract(contractAddress, contractABI, signer);
//         setContract(contract);
//         return contract;
//     };

//     // Register user
//     const registerUser = async () => {
//         if ( !username || !ipfsHash || !stakeAmount) {
//             setEventLogs((prev) => [...prev, "Error: Missing username, IPFS hash, or stake amount"]);
//             return;
//         }
//         try {
//             const tx = await contract.stakeAmountAndRegister(username, ipfsHash, {
//                 value: ethers.utils.parseEther(stakeAmount.toString()),
//             });
//             await tx.wait();
//             setEventLogs((prev) => [...prev, "User registered successfully"]);
//         } catch (error) {
//             console.error("Error registering user:", error);
//             setEventLogs((prev) => [...prev, `Error registering user: ${error.message}`]);
//         }
//     };

//     // Deactivate user
//     const deactivateUser = async () => {
//         if (!contract) {
//             setEventLogs((prev) => [...prev, "Error: Contract not initialized"]);
//             return;
//         }
//         try {
//             const tx = await contract.deactive();
//             await tx.wait();
//             setEventLogs((prev) => [...prev, "User deactivated successfully"]);
//         } catch (error) {
//             console.error("Error deactivating user:", error);
//             setEventLogs((prev) => [...prev, `Error deactivating user: ${error.message}`]);
//         }
//     };

//     // Withdraw stake
//     const withdrawStake = async () => {
//         if (!contract) {
//             setEventLogs((prev) => [...prev, "Error: Contract not initialized"]);
//             return;
//         }
//         try {
//             const tx = await contract.withdrawEth();
//             await tx.wait();
//             setEventLogs((prev) => [...prev, "Stake withdrawn successfully"]);
//         } catch (error) {
//             console.error("Error withdrawing stake:", error);
//             setEventLogs((prev) => [...prev, `Error withdrawing stake: ${error.message}`]);
//         }
//     };

//     // Get user info
//     const getUserInfo = async () => {
//         if (!contract || !userAddressForInfo) {
//             setEventLogs((prev) => [...prev, "Error: Missing contract or user address"]);
//             return;
//         }
//         try {
//             const userInfo = await contract.checkWhetherIsRegistered(userAddressForInfo);
//             setUserInfo({
//                 username: userInfo.username,
//                 ipfsHash: userInfo.ipfsHash,
//                 stakedAmount: ethers.utils.formatEther(userInfo.stakedAmount),
//                 isActive: userInfo.isActive,
//             });
//             setEventLogs((prev) => [...prev, `Fetched user info for ${userAddressForInfo}`]);
//         } catch (error) {
//             console.error("Error getting user info:", error);
//             setEventLogs((prev) => [...prev, `Error getting user info: ${error.message}`]);
//         }
//     };

//     // Set up event listeners
//     const setupEventListeners = (contractInstance) => {
//         contractInstance.on("UserRegistered", (user, username, ipfsHash, stakedAmount) => {
//             const message = `User ${user} registered with username ${username}, IPFS hash ${ipfsHash}, and staked ${ethers.utils.formatEther(stakedAmount)} ETH`;
//             setEventLogs((prev) => [...prev, message]);
//         });
//         contractInstance.on("UserDeactivated", (user) => {
//             const message = `User ${user} deactivated`;
//             setEventLogs((prev) => [...prev, message]);
//         });
//         contractInstance.on("StakeWithdrawn", (user, amount) => {
//             const message = `User ${user} withdrew ${ethers.utils.formatEther(amount)} ETH`;
//             setEventLogs((prev) => [...prev, message]);
//         });
//     };

//     // Initialize contract and event listeners on mount
  

//     return (
//         <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
//             <h1 style={{ textAlign: 'center', color: '#333' }}>Register with Stake</h1>

//             {/* Wallet Connection Status */}
//             {signerAddress ? (
//                 <p style={{ textAlign: 'center', color: '#555' }}>
//                     <strong>Connected Address:</strong> {signerAddress}
//                 </p>
//             ) : (
//                 <button
//                     onClick={connectWallet}
//                     style={{
//                         display: 'block',
//                         margin: '0 auto 20px',
//                         padding: '10px 20px',
//                         backgroundColor: '#007bff',
//                         color: '#fff',
//                         border: 'none',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                     }}
//                 >
//                     Connect Wallet
//                 </button>
//             )}

//             {/* Register User Section */}
//             <div style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
//                 <h3 style={{ marginTop: '0', color: '#333' }}>Register User</h3>
//                 <input
//                     type="text"
//                     placeholder="Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
//                 />
//                 <input
//                     type="text"
//                     placeholder="IPFS Hash (e.g., Qm...)"
//                     value={ipfsHash}
//                     onChange={(e) => setIpfsHash(e.target.value)}
//                     style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Stake Amount (ETH)"
//                     value={stakeAmount}
//                     onChange={(e) => setStakeAmount(e.target.value)}
//                     style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
//                 />
//                 <button
//                     onClick={registerUser}
//                     style={{
//                         padding: '8px 15px',
//                         backgroundColor: '#28a745',
//                         color: '#fff',
//                         border: 'none',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         width: '100%',
//                     }}
//                 >
//                     Register
//                 </button>
//             </div>

//             {/* Deactivate User Section */}
//             <div style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
//                 <h3 style={{ marginTop: '0', color: '#333' }}>Deactivate User</h3>
//                 <button
//                     onClick={deactivateUser}
//                     style={{
//                         padding: '8px 15px',
//                         backgroundColor: '#dc3545',
//                         color: '#fff',
//                         border: 'none',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         width: '100%',
//                     }}
//                 >
//                     Deactivate
//                 </button>
//             </div>

//             {/* Withdraw Stake Section */}
//             <div style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
//                 <h3 style={{ marginTop: '0', color: '#333' }}>Withdraw Stake</h3>
//                 <button
//                     onClick={withdrawStake}
//                     style={{
//                         padding: '8px 15px',
//                         backgroundColor: '#007bff',
//                         color: '#fff',
//                         border: 'none',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         width: '100%',
//                     }}
//                 >
//                     Withdraw Stake
//                 </button>
//             </div>

//             {/* Get User Info Section */}
//             <div style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
//                 <h3 style={{ marginTop: '0', color: '#333' }}>Get User Info</h3>
//                 <input
//                     type="text"
//                     placeholder="User Address"
//                     value={userAddressForInfo}
//                     onChange={(e) => setUserAddressForInfo(e.target.value)}
//                     style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
//                 />
//                 <button
//                     onClick={getUserInfo}
//                     style={{
//                         padding: '8px 15px',
//                         backgroundColor: '#17a2b8',
//                         color: '#fff',
//                         border: 'none',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         width: '100%',
//                     }}
//                 >
//                     Get User Info
//                 </button>
//             </div>

//             {/* Display User Info */}
//             {userInfo && (
//                 <div style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
//                     <h3 style={{ marginTop: '0', color: '#333' }}>User Info</h3>
//                     <p><strong>Username:</strong> {userInfo.username}</p>
//                     <p><strong>IPFS Hash:</strong> {userInfo.ipfsHash}</p>
//                     <p><strong>Staked Amount:</strong> {userInfo.stakedAmount} ETH</p>
//                     <p><strong>Is Active:</strong> {userInfo.isActive ? 'Yes' : 'No'}</p>
//                 </div>
//             )}

//             {/* Event Logs */}
//             <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
//                 <h3 style={{ marginTop: '0', color: '#333' }}>Event Logs</h3>
//                 <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
//                     {eventLogs.length > 0 ? (
//                         eventLogs.map((log, index) => (
//                             <p key={index} style={{ margin: '5px 0', color: log.includes('Error') ? '#dc3545' : '#333' }}>
//                                 {log}
//                             </p>
//                         ))
//                     ) : (
//                         <p>No events yet.</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RegisterWithStakeUI;
import React, { useState } from 'react';
import { parseUnits } from 'ethers';
import { useAccount, useWriteContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { motion } from 'framer-motion';
import { 
  FaVideo, 
  FaCoins, 
  FaSpinner, 
  FaCheckCircle, 
  FaExternalLinkAlt 
} from 'react-icons/fa';
import { toast } from 'react-toastify';

// You need to define your ABI somewhere
import ABI from '../ABI/live.json';

import { live_contract_address} from '../contract_address/live';

const LiveShowAccess = () => {
  const { address } = useAccount();
  const [title, setTitle] = useState("");
  const [fee, setFee] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const { writeContractAsync } = useWriteContract({ chain: sepolia.id});
   
  const handleCreateShow = async () => {
    if (!title || !fee) {
      toast.error("Please enter both title and fee", {
        position: "top-right",
        theme: "colored"
      });
      return;
    }
    
    if (!address) {
      toast.warn("Please connect your wallet", {
        position: "top-right",
        theme: "colored"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const tx = await writeContractAsync({
        address: live_contract_address,
        abi: ABI,
        functionName: "createLiveShow",
        args: [title, parseUnits(fee, "wei")],
       
        account: address
      });
      
      setTxHash(tx);
      
      toast.success("Live show created successfully!", {
        position: "top-right",
        theme: "colored"
      });
      
      // Reset form
      setTitle("");
      setFee("");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error creating live show", {
        position: "top-right",
        theme: "colored"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-center">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4"
          >
            <FaVideo className="text-4xl text-purple-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white">Create Live Show</h1>
          <p className="text-white/80 mt-2">Launch your exclusive web3 event</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Show Title Input */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <label className="block text-gray-700 mb-2 flex items-center">
              <FaVideo className="mr-2 text-purple-500" />
              Show Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300"
              placeholder="Enter show title"
            />
          </motion.div>

          {/* Fee Input */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <label className="block text-gray-700 mb-2 flex items-center">
              <FaCoins className="mr-2 text-yellow-500" />
              Fee (in wei)
            </label>
            <input
              type="text"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300"
              placeholder="Enter fee amount"
            />
          </motion.div>

          {/* Create Show Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateShow}
            disabled={isLoading || !address}
            className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 flex items-center justify-center ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <FaCheckCircle className="mr-2" />
                Create Live Show
              </>
            )}
          </motion.button>

          {/* Transaction Hash */}
          {txHash && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-green-50 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span className="text-green-700">Transaction Submitted</span>
                </div>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center"
                >
                  <FaExternalLinkAlt className="mr-1" />
                  View
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-2 break-all">
                {txHash}
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 text-center text-sm text-gray-500">
          Powered by Web3 Technology
        </div>
      </motion.div>
    </div>
  );
};

export default LiveShowAccess;
// import { create } from "ipfs-http-client";

// const ipfs = create({url : "https://sepolia.infura.io/v3/a1ba7a0dadf84e27b30b6334ebeadaed"})
// const createUser = async (username) => {
    
//     const userData = {
//         username : username,
//         createdAt : new Date().toISOString()
//     };

//     try {
//         const jsonData = JSON.stringify(userData);

//         const {cid} = await ipfs.add(jsonData);

//         console.log ("IPFS Hash:", cid.toString())


        
//     } catch (error) {
        
//     }
// }
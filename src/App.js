import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

// Replace with your deployed contract address
const contractAddress = "0x00dE08F8F01727c02Ea38F6b3a4A2695edFcee17";

// Replace with your AgriChainToken ABI
const contractABI = [
  "function mintCropToken(address farmer, string memory tokenURI) public returns (uint256)",
  "function tokenCounter() public view returns (uint256)"
];

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const [contract, setContract] = useState(null);

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      const agrichain = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(agrichain);
      setStatus("✅ Wallet connected: " + address);
    } else {
      setStatus("❌ Please install MetaMask");
    }
  };

  // Mint Crop Token
  const mintToken = async () => {
    if (!contract) {
      setStatus("Contract not loaded");
      return;
    }
    try {
      const tx = await contract.mintCropToken(walletAddress, tokenURI);
      await tx.wait();
      setStatus("✅ Token minted successfully!");
    } catch (err) {
      setStatus("❌ Error minting token: " + err.message);
    }
  };

  return (
    <div className="App">
      <h1>🌾 AgriChain</h1>
      <p>{status}</p>
      <button onClick={connectWallet}>Connect Wallet</button>
      <br /><br />
      <input
        type="text"
        placeholder="Enter Token URI"
        value={tokenURI}
        onChange={(e) => setTokenURI(e.target.value)}
      />
      <button onClick={mintToken}>Mint Crop Token</button>
    </div>
  );
}

export default App;

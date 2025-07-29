import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import WasmButton from './WasmButton';
import UseBinding from './UseBinding';
import SolanaWallet from './SolanaWallet';
import { WalletInfo } from 'rust-wasm-sdk';

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);

  const handleMessage = (message: string) => {
    setMessages(prev => [...prev, message]);
  };

  const handleWalletConnect = (info: WalletInfo) => {
    setWalletInfo(info);
    handleMessage(`Wallet connected: ${info.provider} - ${info.address}`);
  };

  const handleWalletDisconnect = () => {
    setWalletInfo(null);
    handleMessage('Wallet disconnected');
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>React 19 + Rust WASM + Solana Demo</h1>
        <p>
          This demo shows how to use a TypeScript SDK to interact with a Rust WASM module
          including Solana wallet connectivity.
        </p>
        
        {walletInfo && (
          <div className="connected-wallet-banner">
            <span>🟢 Connected to {walletInfo.provider}</span>
          </div>
        )}
        
        <div className="demo-sections">
          <div className="section">
            <h2>Solana Wallet Connection</h2>
            <SolanaWallet
              onWalletConnect={handleWalletConnect}
              onWalletDisconnect={handleWalletDisconnect}
            />
          </div>
          
          <div className="section">
            <h2>WASM Functions</h2>
            <div className="wasm-demo">
              <WasmButton onMessage={handleMessage} />
              <UseBinding />
            </div>
          </div>
        </div>
        
        <div className="messages-section">
          <div className="messages-header">
            <h3>Activity Log:</h3>
            {messages.length > 0 && (
              <button onClick={clearMessages} className="clear-button">
                Clear Messages
              </button>
            )}
          </div>
          
          <div className="messages-container">
            {messages.length === 0 ? (
              <p className="no-messages">No activity yet. Connect a wallet or call a function above!</p>
            ) : (
              <ul className="messages-list">
                {messages.map((message, index) => (
                  <li key={index} className="message-item">
                    <span className="message-index">#{index + 1}</span>
                    <span className="message-text">{message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;

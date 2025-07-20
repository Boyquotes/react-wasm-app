import React, { useState, useEffect } from 'react';
import { rustWasmSDK, WalletInfo } from 'rust-wasm-sdk';

interface SolanaWalletProps {
  onWalletConnect?: (walletInfo: WalletInfo) => void;
  onWalletDisconnect?: () => void;
}

const SolanaWallet: React.FC<SolanaWalletProps> = ({ onWalletConnect, onWalletDisconnect }) => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);

  useEffect(() => {
    checkWalletAvailability();
  }, []);

  const checkWalletAvailability = async () => {
    try {
      if (rustWasmSDK.isInitialized()) {
        const wallets = await rustWasmSDK.checkWalletAvailability();
        setAvailableWallets(wallets);
      }
    } catch (err) {
      console.error('Failed to check wallet availability:', err);
      setError(`Failed to check wallet availability: ${err}`);
    }
  };

  const handleConnect = async () => {
    if (!rustWasmSDK.isInitialized()) {
      setError('SDK not initialized');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const walletInfo = await rustWasmSDK.connectWallet();
      setWalletInfo(walletInfo);
      onWalletConnect?.(walletInfo);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(`Failed to connect wallet: ${err}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    try {
      rustWasmSDK.disconnectWallet();
      setWalletInfo(null);
      onWalletDisconnect?.();
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
      setError(`Failed to disconnect wallet: ${err}`);
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="solana-wallet-container">
      <div className="wallet-header">
        <h3>Solana Wallet</h3>
        <div className="wallet-status">
          {walletInfo ? (
            <span className="status-connected">🟢 Connected</span>
          ) : (
            <span className="status-disconnected">🔴 Disconnected</span>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      <div className="wallet-availability">
        <h4>Available Wallets:</h4>
        <div className="available-wallets">
          {availableWallets.length > 0 ? (
            <ul>
              {availableWallets.map((wallet, index) => (
                <li key={index} className="wallet-item">
                  <span className="wallet-icon">🟢</span>
                  <span className="wallet-name">{wallet}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-wallets">
              No Solana wallets detected. Please install:
              <br />
              • <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">Phantom Wallet</a>
              <br />
              • <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer">Solflare Wallet</a>
            </p>
          )}
        </div>
      </div>

      <div className="wallet-actions">
        {!walletInfo ? (
          <button
            onClick={handleConnect}
            disabled={isConnecting || availableWallets.length === 0}
            className="connect-button"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="connected-wallet">
            <div className="wallet-info">
              <div className="wallet-detail">
                <span className="label">Provider:</span>
                <span className="value">{walletInfo.provider}</span>
              </div>
              <div className="wallet-detail">
                <span className="label">Address:</span>
                <span className="value address" title={walletInfo.address}>
                  {truncateAddress(walletInfo.address)}
                </span>
              </div>
            </div>
            <button onClick={handleDisconnect} className="disconnect-button">
              Disconnect
            </button>
          </div>
        )}
      </div>

      <div className="wallet-actions">
        <button
          onClick={checkWalletAvailability}
          disabled={isConnecting}
          className="refresh-button"
        >
          Refresh Wallets
        </button>
      </div>
    </div>
  );
};

export default SolanaWallet;

import React, { useState, useEffect } from 'react';
import { rustWasmSDK } from 'rust-wasm-sdk';

interface WasmButtonProps {
  onMessage?: (message: string) => void;
}

const WasmButton: React.FC<WasmButtonProps> = ({ onMessage }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!rustWasmSDK.isInitialized()) {
        await rustWasmSDK.init();
      }
      
      setIsInitialized(true);
    } catch (err) {
      console.error('Failed to initialize WASM SDK:', err);
      setError(`Failed to initialize WASM SDK: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintHello = async () => {
    if (!isInitialized) {
      setError('SDK not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const message = await rustWasmSDK.printHello();
      onMessage?.(message);
    } catch (err) {
      console.error('Failed to call printHello:', err);
      setError(`Failed to call printHello: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintCustom = async () => {
    if (!isInitialized) {
      setError('SDK not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const message = await rustWasmSDK.printCustom('Hello from React 19!');
      onMessage?.(message);
    } catch (err) {
      console.error('Failed to call printCustom:', err);
      setError(`Failed to call printCustom: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wasm-button-container">
      <div className="status-info">
        <p>
          <strong>SDK Status:</strong> {isInitialized ? '✅ Initialized' : '❌ Not Initialized'}
        </p>
        {error && <p className="error-message">❌ {error}</p>}
      </div>
      
      <div className="button-group">
        <button
          onClick={handlePrintHello}
          disabled={!isInitialized || isLoading}
          className="wasm-button"
        >
          {isLoading ? 'Loading...' : 'Print "Hello Rust"'}
        </button>
        
        <button
          onClick={handlePrintCustom}
          disabled={!isInitialized || isLoading}
          className="wasm-button"
        >
          {isLoading ? 'Loading...' : 'Print Custom Message'}
        </button>
        
        <button
          onClick={initializeSDK}
          disabled={isLoading}
          className="wasm-button secondary"
        >
          {isLoading ? 'Loading...' : 'Reinitialize SDK'}
        </button>
      </div>
    </div>
  );
};

export default WasmButton;

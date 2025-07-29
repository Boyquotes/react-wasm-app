import React, { useEffect, useState } from "react";
// Adjust the path if needed based on your build setup
import { cybergoldSDK } from "rust-cybergold-sdk";

const UseBinding: React.FC = () => {
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    cybergoldSDK.init().then(() => {
      const sum = cybergoldSDK.add(5, 7);
      setResult(sum);
    });
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h2>WASM Binding Example</h2>
      <p>5 + 7 = {result !== null ? result : "..."}</p>
    </div>
  );
};

export default UseBinding;

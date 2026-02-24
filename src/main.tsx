import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@mysten/dapp-kit/dist/index.css';

import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
// THE FIX: The new import location and function name
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure the connection using the updated function
const { networkConfig } = createNetworkConfig({
  testnet: { 
    url: getJsonRpcFullnodeUrl('testnet'), 
    network: 'testnet' 
  },
  mainnet: { 
    url: getJsonRpcFullnodeUrl('mainnet'), 
    network: 'mainnet' 
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
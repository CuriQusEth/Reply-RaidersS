/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './lib/wagmi';
import { GameRouter } from './components/Router';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-[#050505] flex justify-center selection:bg-pink-500/30">
          <GameRouter />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

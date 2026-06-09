/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WagmiProvider, useAccount, useSendTransaction } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./lib/wagmi";
import { GameRouter } from "./components/Router";
import { Sun } from "lucide-react";

const queryClient = new QueryClient();

function SayGMButton() {
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    sendTransaction({
      to: "0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3",
      value: 0n,
      data: "0x474d", // 'GM' in hex (or call a contract if specified, assuming simple GM txn)
    });
  };

  if (!isConnected) return null;

  return (
    <div className="absolute top-6 left-6 z-[100]">
      <button
        onClick={sendGMTransaction}
        className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
      >
        <Sun size={14} />
        Say GM
      </button>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-[#050505] flex justify-center selection:bg-pink-500/30 relative">
          <SayGMButton />
          <GameRouter />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

import { useGameEngine } from '../hooks/useGameEngine';
import { TitleScreen } from '../screens/TitleScreen';
import { RaidScreen } from '../screens/RaidScreen';
import { GameOverScreen } from '../screens/GameOverScreen';
import { AnimatePresence, motion } from 'motion/react';
import { useConnect, useAccount } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Wallet } from 'lucide-react';

export const GameRouter = () => {
    const engine = useGameEngine();
    const { connect } = useConnect();
    const { isConnected, address } = useAccount();

    return (
        <div className="relative w-full h-[100dvh] bg-[#0A0A0F] text-white flex flex-col mx-auto sm:max-w-md sm:border-x-8 sm:border-[#1A1A2E] shadow-[0_0_50px_rgba(236,72,153,0.1)] overflow-hidden font-sans">
            
            {/* Top Bar for Wallet / Extras */}
            <div className="absolute top-0 w-full p-6 flex justify-end z-[100] pointer-events-none">
                <button 
                    onClick={() => connect({ connector: injected() })}
                    className="pointer-events-auto flex items-center gap-2 bg-[#22D3EE] text-black border-2 border-cyan-300 px-4 py-1.5 rounded-full font-black text-xs shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:scale-105 transition-transform"
                >
                    <Wallet size={14} />
                    {isConnected ? `${address?.substring(0, 6)}...` : "CONNECT WALLET"}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {engine.gameState === 'menu' && (
                    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                        <TitleScreen onStart={engine.startGame} />
                    </motion.div>
                )}
                
                {engine.gameState === 'playing' && (
                    <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                        <RaidScreen engine={engine} />
                    </motion.div>
                )}

                {engine.gameState === 'gameover' && (
                    <motion.div key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                        <GameOverScreen engine={engine} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

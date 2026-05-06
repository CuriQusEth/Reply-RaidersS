import { motion } from 'motion/react';
import { useAccount, useConnect, useSendTransaction } from 'wagmi';
import { injected } from 'wagmi/connectors';

type TitleScreenProps = {
    onStart: () => void;
};

export const TitleScreen = ({ onStart }: TitleScreenProps) => {
    const { connect } = useConnect();
    const { address, isConnected } = useAccount();
    const { sendTransaction, isPending } = useSendTransaction();

    const handleGM = () => {
        if (!isConnected || !address) {
            connect({ connector: injected() });
            return;
        }
        
        // Real on-chain "Say GM" transaction: Send 0 ETH to self with 'GM' hex data
        sendTransaction({
            to: address,
            value: 0n,
            data: '0x474d' // 'GM' in hex
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,_#1A1A2E_0%,_#0A0A0F_100%)] text-white overflow-hidden p-6 relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="z-10 text-center flex flex-col items-center"
            >
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-pink-500 rounded-xl flex items-center justify-center font-black text-4xl rotate-3 shadow-[4px_4px_0px_#A855F7]">R</div>
                </div>
                <h1 className="text-6xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] mb-2">
                    REPLY
                    <br />
                    RAIDERS
                </h1>
                <p className="text-gray-400 font-mono text-sm mb-12 max-w-xs mx-auto">
                    The ultimate on-chain reply battle game. Roast, rage, and meme your way to the top.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStart}
                    className="w-full max-w-xs px-8 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.5)] border-b-4 border-pink-700 mb-6"
                >
                    START RAID
                </motion.button>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGM}
                    disabled={isPending}
                    className="w-full max-w-xs px-8 py-4 bg-[#161625] border-2 border-cyan-500 text-cyan-400 font-black uppercase tracking-widest rounded-xl shadow-[0_4px_0_#155E75] hover:bg-cyan-500 hover:text-black transition-colors disabled:opacity-50"
                >
                    {isConnected ? (isPending ? "SENDING GM..." : "SAY GM (ON-CHAIN)") : "CONNECT WALLET"}
                </motion.button>
            </motion.div>

            {/* Background floating chat bubbles decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-wrap justify-around items-center overflow-hidden mix-blend-screen gap-4 p-8">
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -20, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            rotate: [0, Math.random() * 10 - 5, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                        className="bg-[#161625] border border-cyan-500/30 rounded-2xl p-4 text-xs font-mono text-cyan-400"
                    >
                        L + Ratio
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

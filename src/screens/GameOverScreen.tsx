import { motion } from 'motion/react';
import { useAccount, useSignMessage } from 'wagmi';
import { submitRaidScore, getAttributionPayload } from '../lib/erc8021';
import { useState } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';

type GameOverScreenProps = {
    engine: ReturnType<typeof useGameEngine>;
};

export const GameOverScreen = ({ engine }: GameOverScreenProps) => {
    const { score, maxCombo, setGameState } = engine;
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleOnChainSubmit = async () => {
        if (!isConnected) {
            alert("Connect wallet first!");
            return;
        }

        try {
            setSubmitting(true);
            const payload = getAttributionPayload(`Score:${score}|MaxCombo:${maxCombo}`);
            const signature = await signMessageAsync({ message: payload, account: address as any });
            
            await submitRaidScore(score, signature);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Submission failed.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,_#1A1A2E_0%,_#0A0A0F_100%)] text-white p-6 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 flex flex-col items-center max-w-md w-full bg-[#161625] border-2 border-pink-500 p-8 rounded-3xl shadow-[0_0_30px_rgba(236,72,153,0.2)]"
            >
                <div className="text-pink-500 font-mono text-sm uppercase tracking-widest mb-2 font-bold bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/30">
                    Raid Failed
                </div>
                <h2 className="text-4xl font-black mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                    Banned for Toxicity
                </h2>

                <div className="w-full flex justify-between items-center mb-4 p-4 bg-[#0A0A0F] rounded-xl border border-white/5">
                    <span className="text-gray-500 font-mono uppercase tracking-wider text-sm font-bold">Final Score</span>
                    <span className="text-3xl font-black text-cyan-400">{score.toLocaleString()}</span>
                </div>

                <div className="w-full flex justify-between items-center mb-8 p-4 bg-[#0A0A0F] rounded-xl border border-white/5">
                    <span className="text-gray-500 font-mono uppercase tracking-wider text-sm font-bold">Max Combo</span>
                    <span className="text-xl font-black text-yellow-400">{maxCombo}x</span>
                </div>

                <div className="w-full space-y-4">
                    {submitted ? (
                        <div className="w-full p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-center text-green-400 font-mono font-bold">
                            ✅ Score recorded on Base Mainnet
                        </div>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleOnChainSubmit}
                            disabled={submitting}
                            className="w-full p-4 bg-[#161625] border-2 border-cyan-500 hover:bg-cyan-500 hover:text-black shadow-[0_4px_0_#155E75] text-cyan-400 font-black rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {submitting ? "Signing..." : "Record Epic Raid On-Chain"}
                        </motion.button>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setGameState('menu')}
                        className="w-full p-4 bg-[#161625] border-2 border-pink-500 hover:bg-pink-500 text-pink-500 hover:text-white shadow-[0_4px_0_#9D174D] font-black rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                    >
                        Try Again
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

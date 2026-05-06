import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useGameEngine } from '../hooks/useGameEngine';
import { ReplyOption } from '../lib/game/data';
import { AlertTriangle, Flame, ShieldAlert } from 'lucide-react';
import { useEffect } from 'react';

type RaidScreenProps = {
    engine: ReturnType<typeof useGameEngine>;
};

export const RaidScreen = ({ engine }: RaidScreenProps) => {
    const { currentMessage, timeLeft, score, combo, toxicity, handleReply } = engine;

    const onOptionClick = (option: ReplyOption) => {
        if (option.type === 'savage') {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#ef4444', '#f97316', '#eab308']
            });
        }
        handleReply(option);
    };

    // Screen shake when toxicity is high
    const isCritical = toxicity > 80;

    return (
        <motion.div 
            animate={isCritical ? { x: [-2, 2, -2, 2, 0] } : {}}
            transition={{ repeat: isCritical ? Infinity : 0, duration: 0.2 }}
            className="flex flex-col min-h-screen bg-[radial-gradient(circle_at_center,_#1A1A2E_0%,_#0A0A0F_100%)] text-white font-sans max-w-md mx-auto relative overflow-hidden"
        >
            {/* Header / HUD */}
            <div className="h-20 bg-[#161625] border-b-4 border-pink-500 flex justify-between items-center px-6 shadow-[0_0_20px_rgba(236,72,153,0.3)] z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest font-bold">Score</span>
                    <span className="font-black text-2xl tracking-tight text-cyan-400">{score.toLocaleString()}</span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest font-bold">Combo</span>
                    <motion.div 
                        key={combo}
                        initial={{ scale: 1.5, color: '#fff' }}
                        animate={{ scale: 1, color: combo > 5 ? '#FBBF24' : '#E4E4E7' }}
                        className="font-black text-2xl flex items-center gap-1 text-yellow-400"
                    >
                        {combo}x {combo > 5 && <Flame size={20} className="text-orange-500" />}
                    </motion.div>
                </div>
            </div>

            {/* Toxicity Meter */}
            <div className="bg-[#1A1A2E] p-3 w-full relative z-20 border-b border-white/5">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-gray-400 mb-1 px-1 tracking-widest">
                    <span>Clean</span>
                    <span className="flex items-center gap-1 text-red-500">
                        <AlertTriangle size={12} /> Toxic
                    </span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500"
                        animate={{ width: `${toxicity}%` }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Raid Arena (Messages) */}
            <div className="flex-1 p-4 flex flex-col justify-end gap-4 relative z-0 pb-36">
                
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <AnimatePresence mode="popLayout">
                    {currentMessage && (
                        <motion.div
                            key={currentMessage.id}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -50, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="bg-[#050505] border-4 border-white/10 p-6 rounded-3xl shadow-2xl w-[95%] self-end flex flex-col relative z-10 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                            
                            <div className="flex items-center gap-2 mb-3 z-10">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 border-2 border-white/20 flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                                   {currentMessage.username.substring(1, 4).toUpperCase()}
                                </div>
                                <span className="font-bold text-gray-200 pr-2 tracking-tight">{currentMessage.username}</span>
                                <span className="text-[10px] text-pink-300 px-2 py-0.5 rounded-sm bg-pink-500/10 border border-pink-500/30 uppercase tracking-widest font-bold">
                                    {currentMessage.platform}
                                </span>
                            </div>
                            <p className="text-lg font-medium leading-snug z-10 text-white drop-shadow-md">{currentMessage.content}</p>
                            
                            {/* Time bar */}
                            <div className="w-full h-1 bg-gray-900 mt-5 rounded-full overflow-hidden z-10">
                                <motion.div 
                                    className="h-full bg-cyan-400 shadow-[0_0_10px_#22D3EE]"
                                    initial={{ width: '100%' }}
                                    animate={{ width: `${(timeLeft / currentMessage.timeLimitMs) * 100}%` }}
                                    transition={{ ease: 'linear', duration: 0.05 }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Reply Options Dock */}
            <div className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/90 to-transparent z-20 pb-8">
                <div className="grid grid-cols-2 gap-3">
                    <AnimatePresence mode="wait">
                        {currentMessage?.options.map(opt => {
                            let btnStyle = "";
                            if (opt.type === 'savage') btnStyle = "border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white shadow-[0_4px_0_#9D174D]";
                            else if (opt.type === 'funny') btnStyle = "border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white shadow-[0_4px_0_#C2410C]";
                            else if (opt.type === 'hype') btnStyle = "border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black shadow-[0_4px_0_#155E75]";
                            else btnStyle = "border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white shadow-[0_4px_0_#6B21A8]";
                            
                            return (
                                <motion.button
                                    key={currentMessage.id + opt.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onOptionClick(opt)}
                                    className={`bg-[#161625] border-2 py-4 px-3 rounded-xl text-xs font-black transition-colors uppercase tracking-tight leading-tight ${btnStyle}`}
                                >
                                    {opt.text}
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Danger Overlay */}
            {isCritical && (
                <div className="absolute inset-0 pointer-events-none z-50 border-[8px] border-red-500/30 animate-pulse">
                    <div className="absolute top-20 w-full flex justify-center opacity-50">
                        <ShieldAlert size={48} className="text-red-500" />
                    </div>
                </div>
            )}
        </motion.div>
    );
};

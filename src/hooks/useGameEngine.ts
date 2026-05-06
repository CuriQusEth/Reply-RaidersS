import { useState, useEffect, useCallback, useRef } from 'react';
import { IncomingMessage, generateRandomMessage, ReplyOption } from '../lib/game/data';

export type GameState = 'menu' | 'playing' | 'gameover';

export const useGameEngine = () => {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [toxicity, setToxicity] = useState(50); // 0-100, 100 = Game Over
    const [currentMessage, setCurrentMessage] = useState<IncomingMessage | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [messagesSeen, setMessagesSeen] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const lastTickRef = useRef<number>(0);

    const startGame = useCallback(() => {
        setScore(0);
        setCombo(0);
        setMaxCombo(0);
        setToxicity(0); // Start purely clean or a bit chaotic? Let's say 20
        setMessagesSeen(0);
        setGameState('playing');
        nextMessage();
    }, []);

    const nextMessage = useCallback(() => {
        const msg = generateRandomMessage();
        setCurrentMessage(msg);
        setTimeLeft(msg.timeLimitMs);
        setMessagesSeen(prev => prev + 1);
        lastTickRef.current = Date.now();
    }, []);

    const handleReply = useCallback((reply: ReplyOption) => {
        if (gameState !== 'playing' || !currentMessage) return;

        // Calculate timing bonus
        const elapsedTime = Date.now() - lastTickRef.current;
        const timingRatio = Math.max(0, 1 - (elapsedTime / currentMessage.timeLimitMs));
        const timingBonus = Math.floor(reply.points * timingRatio);
        
        let comboMult = 1 + (combo * 0.1);

        const totalPoints = Math.floor((reply.points + timingBonus) * comboMult);

        if (reply.type === 'weak') {
            setCombo(0); // Break combo
        } else {
            setCombo(prev => {
                const newCombo = prev + 1;
                setMaxCombo(mc => Math.max(mc, newCombo));
                return newCombo;
            });
        }

        setScore(prev => prev + totalPoints);
        setToxicity(prev => {
            const newTox = Math.min(100, Math.max(0, prev + reply.toxicityChange));
            if (newTox >= 100) {
                gameOver();
            }
            return newTox;
        });

        // Trigger particles/haptics here in the component

        nextMessage();
    }, [gameState, currentMessage, combo, nextMessage]);

    const gameOver = useCallback(() => {
        setGameState('gameover');
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    // Game loop for timer
    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    const next = prev - 50; // tick every 50ms
                    if (next <= 0) {
                        setCombo(0);
                        setToxicity(t => Math.min(100, t + 20)); // Penalty for missing
                        nextMessage();
                        return 0;
                    }
                    return next;
                });
            }, 50);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState, nextMessage]);

    return {
        gameState,
        score,
        combo,
        maxCombo,
        toxicity,
        currentMessage,
        timeLeft,
        startGame,
        handleReply,
        setGameState
    };
};

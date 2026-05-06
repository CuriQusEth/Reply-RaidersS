export type ReplyType = 'savage' | 'funny' | 'hype' | 'weak';

export type ReplyOption = {
    id: string;
    text: string;
    type: ReplyType;
    points: number;
    toxicityChange: number; // positive = more toxic, negative = less toxic
};

export type IncomingMessage = {
    id: string;
    username: string;
    platform: 'twitter' | 'discord' | 'instagram';
    content: string;
    timeLimitMs: number;
    options: ReplyOption[];
};

export const generateRandomMessage = (): IncomingMessage => {
    const platforms: ('twitter' | 'discord' | 'instagram')[] = ['twitter', 'discord', 'instagram'];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    
    const messages = [
        "First! Reply if you agree ð¥",
        "This game is literally unplayable.",
        "Can someone explain the lore in 5 words?",
        "Bro really thought he did something there 💀",
        "L + Ratio + Bozo",
        "Any GM enjoyers in chat today?",
        "Imagine still playing this in 2026...",
        "I just dropped a 100 bomb in the new mode!",
        "Send crypto or I block u.",
        "I’ve never touched grass in my life, AMA."
    ];

    const content = messages[Math.floor(Math.random() * messages.length)];

    return {
        id: Math.random().toString(36).substring(7),
        username: `@user_${Math.floor(Math.random() * 9999)}`,
        platform,
        content,
        timeLimitMs: Math.max(3000, 5000 - Math.random() * 2000), // Speed up roughly
        options: [
            { id: '1', text: "Ok boomer.", type: 'savage' as ReplyType, points: 150, toxicityChange: 15 },
            { id: '2', text: "Who hurt you?", type: 'funny' as ReplyType, points: 100, toxicityChange: -5 },
            { id: '3', text: "GM let's get this bread!", type: 'hype' as ReplyType, points: 75, toxicityChange: -10 },
            { id: '4', text: "Please be nice.", type: 'weak' as ReplyType, points: 10, toxicityChange: -20 },
        ].sort(() => Math.random() - 0.5) // Shuffle options
    };
};

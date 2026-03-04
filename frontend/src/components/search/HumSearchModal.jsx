import { useState, useEffect } from "react";

const HumSearchModal = ({ isOpen, onClose, onSearch }) => {
    const [status, setStatus] = useState("Listening...");

    // Simulate listening duration
    useEffect(() => {
        if (isOpen) {
            setStatus("Listening...");
            const timer1 = setTimeout(() => {
                setStatus("Analyzing...");
                const timer2 = setTimeout(() => {
                    // Match seeded audio data
                    const mockMatches = ["Lo-Fi", "Beats", "Nature", "Rain", "Chill", "Sound", "Relax", "Forest", "Piano", "Drums", "Synth"];
                    const match = mockMatches[Math.floor(Math.random() * mockMatches.length)];
                    onSearch(match);
                    onClose();
                }, 1500);
                return () => clearTimeout(timer2);
            }, 3000);
            return () => clearTimeout(timer1);
        }
    }, [isOpen, onSearch, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-all">
            <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-300">
                {/* Visualizer Circles */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-32 h-32 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                    <div className="absolute w-48 h-48 bg-primary/10 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>

                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)] z-10 animate-pulse">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-white">{status}</h3>
                    <p className="text-gray-400">Hum a tune to search...</p>
                </div>

                <button
                    onClick={onClose}
                    className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors font-medium border border-white/10"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default HumSearchModal;

import { useRef, useState, useEffect } from "react";

const DrawSearchModal = ({ isOpen, onClose, onSearch }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState(null);

    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const context = canvas.getContext("2d");
            context.lineCap = "round";
            context.lineJoin = "round";
            context.strokeStyle = "white"; // White drawing on dark
            context.lineWidth = 4;
            setCtx(context);
        }
    }, [isOpen]);

    const startDrawing = (e) => {
        if (!ctx) return;
        const { offsetX, offsetY } = e.nativeEvent;
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || !ctx) return;
        const { offsetX, offsetY } = e.nativeEvent;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (ctx) ctx.closePath();
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        if (ctx && canvasRef.current) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-900 w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">Draw to Search</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="relative h-80 bg-gray-800 cursor-crosshair">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-white/10 text-4xl font-bold select-none">
                        SKETCH HERE
                    </div>
                </div>

                <div className="p-4 bg-gray-900 border-t border-gray-700 flex justify-between gap-4">
                    <button
                        onClick={clearCanvas}
                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => {
                            // Simulate AI recognition matching seeded data AND potential user uploads
                            const mockTerms = ["Neon", "Cyber", "Abstract", "City", "Tree", "Art", "Visual"];
                            const randomTerm = mockTerms[Math.floor(Math.random() * mockTerms.length)];
                            onSearch(randomTerm);
                            onClose();
                        }}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-lg transition-colors"
                    >
                        Find Matches
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DrawSearchModal;

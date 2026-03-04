import { useRef, useState, useEffect, useCallback } from "react";

const DrawSearchModal = ({ isOpen, onClose, onSearch }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [modelStatus, setModelStatus] = useState("ready");
    const [hasDrawn, setHasDrawn] = useState(false);

    // High-DPI canvas setup for crisper strokes
    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            const context = canvas.getContext("2d");
            context.scale(dpr, dpr);
            context.lineCap = "round";
            context.lineJoin = "round";
            context.strokeStyle = "white";
            context.lineWidth = 6;
            setCtx(context);
            setHasDrawn(false);
        }
    }, [isOpen]);

    // Get coordinates from mouse or touch event
    const getCoords = useCallback((e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    }, []);

    const startDrawing = (e) => {
        if (!ctx) return;
        e.preventDefault();
        const { x, y } = getCoords(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasDrawn(true);
    };

    const draw = (e) => {
        if (!isDrawing || !ctx) return;
        e.preventDefault();
        const { x, y } = getCoords(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (ctx) ctx.closePath();
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        if (ctx && canvasRef.current) {
            const dpr = window.devicePixelRatio || 1;
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.restore();
            setHasDrawn(false);
        }
    };

    const handleSearch = async () => {
        if (!canvasRef.current || !hasDrawn) return;
        setIsAnalyzing(true);
        setModelStatus("loading");

        try {
            const srcCanvas = canvasRef.current;
            const srcCtx = srcCanvas.getContext("2d");

            // --- Find the bounding box of the actual drawing ---
            const imgData = srcCtx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
            const pixels = imgData.data;
            let minX = srcCanvas.width, minY = srcCanvas.height, maxX = 0, maxY = 0;
            let hasContent = false;

            for (let y = 0; y < srcCanvas.height; y++) {
                for (let x = 0; x < srcCanvas.width; x++) {
                    const idx = (y * srcCanvas.width + x) * 4;
                    // Check if pixel has any visible content (alpha > 10)
                    if (pixels[idx + 3] > 10) {
                        hasContent = true;
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            // --- Export with centering and padding ---
            const exportSize = 256; // Higher res for better recognition
            const exportCanvas = document.createElement("canvas");
            exportCanvas.width = exportSize;
            exportCanvas.height = exportSize;
            const exportCtx = exportCanvas.getContext("2d");

            // White background
            exportCtx.fillStyle = "white";
            exportCtx.fillRect(0, 0, exportSize, exportSize);

            if (hasContent) {
                // Calculate the drawing region with padding
                const drawW = maxX - minX;
                const drawH = maxY - minY;
                const padding = exportSize * 0.15; // 15% padding on each side
                const targetSize = exportSize - padding * 2;
                const scale = Math.min(targetSize / drawW, targetSize / drawH);
                const scaledW = drawW * scale;
                const scaledH = drawH * scale;
                const offsetX = (exportSize - scaledW) / 2;
                const offsetY = (exportSize - scaledH) / 2;

                // Draw inverted (black strokes on white bg) centered and scaled
                exportCtx.filter = "invert(1)";
                exportCtx.drawImage(
                    srcCanvas,
                    minX, minY, drawW, drawH,        // source crop
                    offsetX, offsetY, scaledW, scaledH // destination centered
                );
            } else {
                // Fallback if no content detected
                exportCtx.filter = "invert(1)";
                exportCtx.drawImage(srcCanvas, 0, 0, exportSize, exportSize);
            }

            const imageBase64 = exportCanvas.toDataURL("image/png");

            const response = await fetch("http://localhost:5000/api/sketch/recognize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageBase64 }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error("Server Error Detail:", errData);
                throw new Error(errData.detail || `Server error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Sketch recognition result:", data);

            // If rate limited or error, show message and let user retry
            if (data.error) {
                console.warn("AI Warning:", data.error);
                setModelStatus("error");
                setIsAnalyzing(false);
                alert(data.error);
                return; // Don't close modal — let user retry
            }

            const searchTerm = data.searchTerm || data.label || "abstract";
            onSearch(searchTerm);
            setModelStatus("ready");
            setIsAnalyzing(false);
            onClose();
        } catch (error) {
            console.error("Sketch search error:", error);
            setModelStatus("error");
            setIsAnalyzing(false);
            alert("Sketch recognition failed. Please wait a moment and try again.");
            // Don't close modal — let user retry
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-900 w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <h3 className="text-white font-bold text-lg">Draw to Search</h3>
                        <p className="text-gray-500 text-xs mt-0.5">Powered by Quick Draw AI · 345 sketch categories</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
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
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        onTouchCancel={stopDrawing}
                    />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-white/10 text-4xl font-bold select-none">
                        SKETCH HERE
                    </div>

                    {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-white font-mono animate-pulse text-sm">Recognizing your sketch...</p>
                            <p className="text-gray-400 text-xs mt-1">First use may take ~20s to warm up</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-900 border-t border-gray-700">
                    <div className="flex justify-between gap-4">
                        <button
                            onClick={clearCanvas}
                            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleSearch}
                            disabled={isAnalyzing}
                            className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {isAnalyzing ? (
                                "Recognizing..."
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Search
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrawSearchModal;

/**
 * @file sketchController.js
 * @description Handles sketch-to-search recognition using Google Gemini Vision API.
 * Gemini is free (1500 req/day), understands sketches/drawings natively,
 * and returns accurate labels for hand-drawn content.
 */

// Map detected sketch description → art search keyword
const KEYWORD_MAP = {
    // Nature
    "tree": "tree", "trees": "tree", "pine": "tree", "oak": "tree", "palm": "nature",
    "flower": "floral", "flowers": "floral", "rose": "floral", "daisy": "floral",
    "sun": "sun", "moon": "moon", "star": "star", "stars": "star",
    "mountain": "landscape", "mountains": "landscape", "hill": "landscape",
    "ocean": "ocean", "sea": "ocean", "wave": "ocean", "waves": "ocean", "water": "ocean",
    "river": "landscape", "lake": "landscape",
    "cloud": "sky", "clouds": "sky", "sky": "sky",
    "lightning": "storm", "thunder": "storm", "storm": "storm",
    "rain": "rain", "snow": "winter", "snowflake": "winter", "snowman": "winter",
    "leaf": "nature", "leaves": "nature", "grass": "nature", "bush": "nature",
    "mushroom": "nature", "cactus": "desert", "garden": "nature",
    "rainbow": "rainbow", "tornado": "storm", "hurricane": "storm",
    // Animals
    "cat": "cat", "dog": "dog", "bird": "bird", "fish": "fish",
    "butterfly": "butterfly", "dragon": "dragon", "lion": "lion", "tiger": "tiger",
    "elephant": "elephant", "whale": "whale", "shark": "shark", "horse": "horse",
    "bear": "bear", "owl": "owl", "snake": "snake", "spider": "spider",
    "bee": "bee", "crab": "ocean", "octopus": "ocean", "dolphin": "ocean",
    "turtle": "ocean", "giraffe": "giraffe", "zebra": "zebra", "panda": "panda",
    "penguin": "penguin", "flamingo": "flamingo", "swan": "swan", "parrot": "parrot",
    "rabbit": "cute", "fox": "nature", "wolf": "nature", "deer": "nature",
    // People / Faces
    "face": "portrait", "person": "portrait", "human": "portrait", "eye": "portrait",
    "skull": "skull", "angel": "angel", "mermaid": "mermaid",
    // Architecture
    "house": "architecture", "building": "architecture", "castle": "castle",
    "church": "architecture", "tower": "architecture", "skyscraper": "cityscape",
    "lighthouse": "lighthouse", "bridge": "bridge", "city": "cityscape",
    // Music
    "guitar": "music", "piano": "music", "violin": "music", "drums": "music",
    "saxophone": "music", "trumpet": "music", "microphone": "music",
    "headphones": "music", "harp": "music", "music": "music", "note": "music",
    // Objects / Art
    "diamond": "diamond", "crown": "crown", "sword": "fantasy",
    "rocket": "space", "ufo": "space", "spaceship": "space",
    "camera": "photography", "paintbrush": "art", "pencil": "art",
    "heart": "love", "circle": "abstract", "triangle": "abstract",
    "square": "abstract", "spiral": "abstract", "abstract": "abstract",
    // Transport
    "car": "automotive", "airplane": "aviation", "plane": "aviation",
    "helicopter": "aviation", "boat": "nautical", "ship": "nautical",
    "sailboat": "nautical", "train": "train", "bicycle": "cycling",
    // Misc
    "candle": "still life", "vase": "still life", "lantern": "light",
    "fire": "fire", "campfire": "fire", "windmill": "windmill",
    "umbrella": "adventure", "balloon": "adventure",
};

/**
 * Extract the best search keyword from Gemini's text response
 */
function extractSearchTerm(geminiText) {
    const text = geminiText.toLowerCase().trim();

    // Try to find a direct keyword match
    for (const [keyword, searchTerm] of Object.entries(KEYWORD_MAP)) {
        if (text.includes(keyword)) {
            return searchTerm;
        }
    }

    // If no match, use the first meaningful word from the response
    const words = text.replace(/[^a-z\s]/g, "").split(/\s+/).filter(w => w.length > 2);
    if (words.length > 0) {
        return words[0];
    }

    return "abstract";
}

/**
 * POST /api/sketch/recognize
 * Accepts a base64 image of a sketch and returns the recognized label + search term.
 */
export const recognizeSketch = async (req, res) => {
    try {
        const { imageBase64 } = req.body;

        if (!imageBase64) {
            return res.status(400).json({ error: "No image data provided" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Gemini API key not configured. Add GEMINI_API_KEY to .env" });
        }

        // Strip the data URL prefix, keep just the base64 data
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        // Determine mime type
        const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/png";

        // Call Gemini 2.0 Flash (only available model for this key)
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{
                parts: [
                    {
                        text: "You are analyzing a hand-drawn sketch on a white background with black strokes. Identify the single most likely real-world object or subject that was drawn. Consider that these are rough, quick sketches — they may be simplified or imperfect. Reply with ONLY 1-2 words (a noun) describing the subject. Do NOT add explanations, punctuation, or extra text. Examples of good responses: tree, cat, house, guitar, mountain, sun, flower, car, bird, fish, heart, star, person"
                    },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Data
                        }
                    }
                ]
            }],
            generationConfig: {
                maxOutputTokens: 30,
                temperature: 0.05,
                topP: 0.8,
                topK: 10,
            }
        };

        // Retry logic for 429 Quota Limit
        const fetchWithRetry = async (url, options, retries = 5, backoff = 2000) => {
            try {
                const response = await fetch(url, options);
                if (response.status === 429 || response.status === 503) {
                    if (retries > 0) {
                        console.log(`Gemini rate limited (${response.status}). Retrying in ${backoff}ms... (${retries} retries left)`);
                        await new Promise(resolve => setTimeout(resolve, backoff));
                        return fetchWithRetry(url, options, retries - 1, backoff * 2);
                    }
                }
                return response;
            } catch (err) {
                if (retries > 0) {
                    console.log(`Gemini fetch error. Retrying in ${backoff}ms... (${retries} retries left)`);
                    await new Promise(resolve => setTimeout(resolve, backoff));
                    return fetchWithRetry(url, options, retries - 1, backoff * 2);
                }
                throw err;
            }
        };

        const response = await fetchWithRetry(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", JSON.stringify(result));
            if (response.status === 429) {
                return res.json({ label: "abstract", searchTerm: "abstract", error: "API rate limit reached. Please wait 30 seconds and try again." });
            }
            throw new Error(`Gemini API error ${response.status}: ${result.error?.message || JSON.stringify(result)}`);
        }

        console.log("Gemini response:", JSON.stringify(result).slice(0, 300));

        const rawLabel = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "abstract";
        const searchTerm = extractSearchTerm(rawLabel);

        console.log(`Sketch recognized: "${rawLabel}" → search: "${searchTerm}"`);

        return res.json({
            label: rawLabel.toLowerCase(),
            searchTerm,
            confidence: 95, // Gemini doesn't give confidence scores
        });

    } catch (error) {
        console.error("Sketch recognition error:", error.message);
        return res.status(500).json({ error: "Sketch recognition failed", detail: error.message });
    }
};

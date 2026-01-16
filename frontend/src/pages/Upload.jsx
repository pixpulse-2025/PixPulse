import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uploadArtwork, resetUploadSuccess, clearError } from "../redux/slices/artworkSlice";

const categories = {
    "Visual Art": [
        "Digital Paintings", "Illustrations", "Concept Art", "Photography",
        "3D Models", "Vector Art", "Pixel Art", "Abstract", "Anime/Manga",
        "Mixed Media", "Posters", "Wallpapers", "Motion Graphics"
    ],
    "Audio": ["Music tracks", "Beats", "Sound Effects", "Loops", "Voice Samples"],
    "Video/Animation": ["Short Animations", "Motion Templates", "VFX"],
    "Presets/Resources": ["Lightroom Presets", "Photoshop Brushes", "LUTs", "3D/Animation Presets"],
    "Other Creative Assets": ["Fonts", "Icons", "UI Kits", "Background Textures"]
};

const constraints = {
    "Visual Art": { extensions: [".jpg", ".jpeg", ".png"], maxSize: 10 * 1024 * 1024, label: "JPG, PNG (max 10MB)" },
    "Audio": { extensions: [".mp3", ".flp"], maxSize: 20 * 1024 * 1024, label: "MP3, FLP (max 20MB)" },
    "Video/Animation": { extensions: [".mp4", ".mov", ".ffx"], maxSize: 50 * 1024 * 1024, label: "MP4, MOV, FFX (max 50MB)" },
    "Presets/Resources": { extensions: [".png", ".xmp", ".abr"], maxSize: 10 * 1024 * 1024, label: "PNG, XMP, ABR (max 10MB)" },
    "Other Creative Assets": { extensions: [".png", ".jpg", ".zip"], maxSize: 20 * 1024 * 1024, label: "PNG, JPG, ZIP (max 20MB)" }
};

const Upload = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, uploadSuccess } = useSelector((state) => state.artwork);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Visual Art",
        subCategory: "",
        priceType: "Free",
        price: "",
        tags: "",
        licenseType: "Personal",
    });

    const [file, setFile] = useState(null);
    const [validationError, setValidationError] = useState("");

    useEffect(() => {
        if (uploadSuccess) {
            alert("Artwork uploaded successfully!");
            dispatch(resetUploadSuccess());
            navigate("/dashboard");
        }
    }, [uploadSuccess, navigate, dispatch]);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === "category") {
            setFormData(prev => ({ ...prev, subCategory: categories[value][0] }));
            setFile(null); // Reset file if category changes
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const catConstraint = constraints[formData.category] || constraints["Other Creative Assets"];
        const ext = `.${selectedFile.name.split('.').pop().toLowerCase()}`;

        if (!catConstraint.extensions.includes(ext)) {
            setValidationError(`Invalid file type for ${formData.category}. Allowed: ${catConstraint.label}`);
            setFile(null);
            return;
        }

        if (selectedFile.size > catConstraint.maxSize) {
            setValidationError(`File is too large. Max size for ${formData.category} is ${catConstraint.maxSize / (1024 * 1024)}MB`);
            setFile(null);
            return;
        }

        setValidationError("");
        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setValidationError("Please upload a file");
            return;
        }

        if (formData.priceType === "Paid" && (!formData.price || formData.price <= 0)) {
            setValidationError("Please enter a valid price for paid artwork");
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append("file", file);

        dispatch(uploadArtwork(data));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Upload Asset</h1>
                        <p className="text-gray-500 dark:text-gray-400">Share your creative work with the world.</p>
                    </div>

                    {(error || validationError) && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3">
                            <span className="text-xl">⚠️</span>
                            <span>{error || validationError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Title & Description */}
                        <div className="grid grid-cols-1 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                    placeholder="Enter artwork title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                    placeholder="Tell the story behind your creation..."
                                />
                            </div>
                        </div>

                        {/* Category & SubCategory */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    {Object.keys(categories).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sub-Category</label>
                                <select
                                    name="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    {categories[formData.category].map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Pricing & License */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Price Type</label>
                                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priceType: "Free" })}
                                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formData.priceType === 'Free' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600' : 'text-gray-500'}`}
                                    >
                                        Free
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priceType: "Paid" })}
                                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formData.priceType === 'Paid' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600' : 'text-gray-500'}`}
                                    >
                                        Paid
                                    </button>
                                </div>
                            </div>
                            {formData.priceType === 'Paid' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
                                    <input
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}
                            <div className={formData.priceType === 'Free' ? 'md:col-span-2' : ''}>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">License Type</label>
                                <select
                                    name="licenseType"
                                    value={formData.licenseType}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="Personal">Personal</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Extended Commercial">Extended Commercial</option>
                                </select>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Main Asset</label>
                            <label className={`w-full h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${file ? 'border-primary-500 bg-primary-500/5' : 'border-gray-200 dark:border-gray-800 hover:border-primary-500 hover:bg-primary-500/5'}`}>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                {file ? (
                                    <>
                                        <span className="text-3xl">✅</span>
                                        <div className="text-center px-4">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[300px]">{file.name}</p>
                                            <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-4xl text-gray-300">📁</span>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Click to upload or drag & drop</p>
                                            <p className="text-xs text-gray-500 mt-1">{constraints[formData.category].label}</p>
                                        </div>
                                    </>
                                )}
                            </label>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags (comma separated)</label>
                            <input
                                name="tags"
                                type="text"
                                value={formData.tags}
                                onChange={handleInputChange}
                                className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="art, digital, design, neon..."
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-primary-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Uploading...
                                </>
                            ) : "Publish Artwork"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Upload;

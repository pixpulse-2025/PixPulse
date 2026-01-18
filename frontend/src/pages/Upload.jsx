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
            setFile(null);
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="card-surface p-8 md:p-12">
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Upload Artwork</h1>
                        <p className="text-base text-gray-600 dark:text-gray-400">Share your creative work with the community</p>
                    </div>

                    {(error || validationError) && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            <span>{error || validationError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title & Description */}
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Enter artwork title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="input-field resize-none"
                                    placeholder="Tell the story behind your creation..."
                                />
                            </div>
                        </div>

                        {/* Category & SubCategory */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    {Object.keys(categories).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-Category</label>
                                <select
                                    name="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    {categories[formData.category].map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Pricing & License */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Type</label>
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priceType: "Free" })}
                                        className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${formData.priceType === 'Free' ? 'bg-white shadow-sm text-primary' : 'text-gray-600'}`}
                                    >
                                        Free
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priceType: "Paid" })}
                                        className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${formData.priceType === 'Paid' ? 'bg-white shadow-sm text-primary' : 'text-gray-600'}`}
                                    >
                                        Paid
                                    </button>
                                </div>
                            </div>
                            {formData.priceType === 'Paid' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                                    <input
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}
                            <div className={formData.priceType === 'Free' ? 'md:col-span-2' : ''}>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">License Type</label>
                                <select
                                    name="licenseType"
                                    value={formData.licenseType}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    <option value="Personal">Personal</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Extended Commercial">Extended Commercial</option>
                                </select>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Main Asset</label>
                            <label className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${file ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}`}>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                {file ? (
                                    <>
                                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <div className="text-center px-4">
                                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[300px]">{file.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-gray-700">Click to upload or drag & drop</p>
                                            <p className="text-xs text-gray-500 mt-1">{constraints[formData.category].label}</p>
                                        </div>
                                    </>
                                )}
                            </label>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma separated)</label>
                            <input
                                name="tags"
                                type="text"
                                value={formData.tags}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="art, digital, design, neon..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#0369A1] hover:bg-[#075985] dark:bg-[#0EA5E9] dark:hover:bg-[#0284C7] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:active:scale-100"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    Upload Artwork
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Upload;

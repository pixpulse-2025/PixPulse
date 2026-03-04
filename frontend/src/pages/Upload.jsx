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
    const [previewFile, setPreviewFile] = useState(null);
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
            setPreviewFile(null);
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

    const handlePreviewChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith('image/')) {
            setValidationError("Cover image must be an image file (JPG, PNG)");
            setPreviewFile(null);
            return;
        }

        setPreviewFile(selectedFile);
        setValidationError("");
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
        if (previewFile) {
            data.append("preview", previewFile);
        }

        dispatch(uploadArtwork(data));
    };

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="card-surface p-8 md:p-12">
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Upload Artwork</h1>
                        <p className="text-base text-gray-400">Share your creative work with the community</p>
                    </div>

                    {(error || validationError) && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            <span>{error || validationError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title & Description */}
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
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
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
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
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
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
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Sub-Category</label>
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
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Price Type</label>
                                <div className="flex gap-2 p-1 bg-[#0B0D10] border border-white/10 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priceType: "Free" })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${formData.priceType === 'Free' ? 'bg-[#8B5CF6] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Free
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priceType: "Paid" })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${formData.priceType === 'Paid' ? 'bg-[#8B5CF6] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Paid
                                    </button>
                                </div>
                            </div>
                            {formData.priceType === 'Paid' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Price ($)</label>
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
                                <label className="block text-sm font-semibold text-gray-300 mb-2">License Type</label>
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

                        {/* File Upload Section */}
                        <div className="grid grid-cols-1 gap-6">
                            {/* Main Asset */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    Main Asset {formData.category !== 'Visual Art' ? `(${constraints[formData.category].label})` : ''}
                                </label>
                                <label className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${file ? 'border-[#8B5CF6] bg-[#8B5CF6]/10' : 'border-white/10 hover:border-[#8B5CF6] hover:bg-white/5'}`}>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    {file ? (
                                        <>
                                            <svg className="w-12 h-12 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <div className="text-center px-4">
                                                <p className="text-sm font-semibold text-white truncate max-w-[300px]">{file.name}</p>
                                                <p className="text-xs text-gray-400 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-gray-300">Click to upload Main File</p>
                                                <p className="text-xs text-gray-500 mt-1">{constraints[formData.category].label}</p>
                                            </div>
                                        </>
                                    )}
                                </label>
                            </div>

                            {/* Optional Cover Image for non-visual art */}
                            {formData.category !== 'Visual Art' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-3">Cover Image (Optional)</label>
                                    <label className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${previewFile ? 'border-[#8B5CF6] bg-[#8B5CF6]/10' : 'border-white/10 hover:border-[#8B5CF6] hover:bg-white/5'}`}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePreviewChange}
                                        />
                                        {previewFile ? (
                                            <>
                                                <svg className="w-8 h-8 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                <div className="text-center px-4">
                                                    <p className="text-sm font-semibold text-white truncate max-w-[300px]">{previewFile.name}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <div className="text-center">
                                                    <p className="text-sm font-semibold text-gray-300">Upload Thumbnail</p>
                                                    <p className="text-xs text-gray-500 mt-1">JPG, PNG</p>
                                                </div>
                                            </>
                                        )}
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Tags (comma separated)</label>
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
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
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

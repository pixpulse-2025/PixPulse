import { useState, useEffect, useRef } from "react";
import { getAvatarUrl } from "../utils/imageUtils";
import { useAuth } from "../hooks/useAuth";

const Settings = () => {
    const { user, updateProfile } = useAuth();
    const [activeSection, setActiveSection] = useState("profile");
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        bio: user?.bio || "",
        website: "",
        location: "",
        avatar: user?.avatar || ""
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                bio: user.bio || "",
                avatar: user.avatar || ""
            }));
        }
    }, [user]);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = new FormData();
            dataToSubmit.append("name", formData.name);
            dataToSubmit.append("bio", formData.bio);
            if (avatarFile) {
                dataToSubmit.append("avatarFile", avatarFile);
            } else if (formData.avatar) {
                dataToSubmit.append("avatar", formData.avatar);
            }

            await updateProfile(dataToSubmit);
            setAvatarPreview("");
            setAvatarFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            alert("Settings updated successfully!");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update profile");
        }
    };

    const sections = [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "account", label: "Account", icon: "⚙️" },
        { id: "privacy", label: "Privacy", icon: "🔒" },
        { id: "notifications", label: "Notifications", icon: "🔔" },
    ];

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            <div className="container mx-auto max-w-[1400px] px-6">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Settings
                    </h1>
                    <p className="text-base text-gray-400">
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-3">
                        <div className="card-surface p-2">
                            <nav className="space-y-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeSection === section.id
                                            ? "bg-[#8B5CF6] text-white"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        <span className="text-lg">{section.icon}</span>
                                        {section.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {activeSection === "profile" && (
                                <div className="card-surface p-8 space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">Profile Information</h2>
                                        <p className="text-sm text-gray-400">Update your personal information and profile details</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-full border-2 border-white/10 overflow-hidden flex-shrink-0 bg-[#141821]">
                                                <img 
                                                    src={avatarPreview || getAvatarUrl(formData.avatar, formData.name)} 
                                                    alt="Profile Avatar" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-semibold text-gray-300 mb-2">Profile Picture</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    name="avatarFile"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8B5CF6] file:text-white hover:file:bg-[#7C3AED] transition-all cursor-pointer"
                                                />
                                                <p className="text-xs text-gray-500 mt-2">Recommended: Square image, max 5MB.</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="input-field"
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="input-field opacity-50 cursor-not-allowed"
                                                placeholder="your@email.com"
                                                disabled
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Biography</label>
                                            <textarea
                                                name="bio"
                                                rows="4"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                className="input-field resize-none"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-2">Website</label>
                                                <input
                                                    type="url"
                                                    name="website"
                                                    value={formData.website}
                                                    onChange={handleChange}
                                                    className="input-field"
                                                    placeholder="https://yourwebsite.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    className="input-field"
                                                    placeholder="City, Country"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "account" && (
                                <div className="space-y-6">
                                    <div className="card-surface p-8">
                                        <h2 className="text-xl font-bold text-white mb-4">Account Settings</h2>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between py-4 border-b border-white/5">
                                                <div>
                                                    <p className="font-semibold text-white">Change Password</p>
                                                    <p className="text-sm text-gray-400">Update your password regularly for security</p>
                                                </div>
                                                <button type="button" className="btn-secondary text-sm">
                                                    Update
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between py-4 border-b border-white/5">
                                                <div>
                                                    <p className="font-semibold text-white">Two-Factor Authentication</p>
                                                    <p className="text-sm text-gray-400">Add an extra layer of security</p>
                                                </div>
                                                <button type="button" className="btn-secondary text-sm">
                                                    Enable
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between py-4">
                                                <div>
                                                    <p className="font-semibold text-red-500">Delete Account</p>
                                                    <p className="text-sm text-gray-400">Permanently delete your account and data</p>
                                                </div>
                                                <button type="button" className="px-4 py-2 bg-red-500/10 text-red-500 font-semibold rounded-lg border border-red-500/20 hover:bg-red-500/20 text-sm">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "privacy" && (
                                <div className="card-surface p-8">
                                    <h2 className="text-xl font-bold text-white mb-4">Privacy Settings</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-4 border-b border-white/5">
                                            <div>
                                                <p className="font-semibold text-white">Profile Visibility</p>
                                                <p className="text-sm text-gray-400">Control who can see your profile</p>
                                            </div>
                                            <select className="bg-[#141821] border border-white/10 text-white rounded-lg px-3 py-2 text-sm font-medium">
                                                <option>Public</option>
                                                <option>Private</option>
                                                <option>Friends Only</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between py-4 border-b border-white/5">
                                            <div>
                                                <p className="font-semibold text-white">Show Email</p>
                                                <p className="text-sm text-gray-400">Display your email on your profile</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8B5CF6]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "notifications" && (
                                <div className="card-surface p-8">
                                    <h2 className="text-xl font-bold text-white mb-4">Notification Preferences</h2>
                                    <div className="space-y-4">
                                        {["Email Notifications", "Push Notifications", "Marketing Emails", "Weekly Digest"].map((item) => (
                                            <div key={item} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                                                <p className="font-semibold text-white">{item}</p>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8B5CF6]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === "profile" && (
                                <div className="flex justify-end gap-3">
                                    <button type="button" className="btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

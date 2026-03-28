import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getAvatarUrl } from "../utils/imageUtils";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

const Settings = () => {
    const { user, updateProfile } = useAuth();
    const [activeSection, setActiveSection] = useState("profile");
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        artistType: user?.artistType || "",
        bio: user?.bio || "",
        website: user?.website || "",
        socialLinks: user?.socialLinks || { instagram: "", dribbble: "", facebook: "" },
        location: user?.location || "",
        avatar: user?.avatar || "",
        privacy: user?.privacy || { showEmail: false },
        notifications: user?.notifications || { emailNotifications: true, pushNotifications: true, marketingEmails: true, weeklyDigest: true }
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                artistType: user.artistType || "",
                bio: user.bio || "",
                website: user.website || "",
                socialLinks: user.socialLinks || { instagram: "", dribbble: "", facebook: "" },
                location: user.location || "",
                avatar: user.avatar || "",
                privacy: user.privacy || { showEmail: false },
                notifications: user.notifications || { emailNotifications: true, pushNotifications: true, marketingEmails: true, weeklyDigest: true }
            }));
        }
    }, [user]);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const fileInputRef = useRef(null);

    // Cropper states
    const [imageToCrop, setImageToCrop] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialLinkChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    const handlePrivacyChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            privacy: {
                ...prev.privacy,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [name]: checked
            }
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageToCrop(url);
            setShowCropper(true);
            e.target.value = null; // reset input
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const applyCrop = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
            const croppedFile = new File([croppedImageBlob], "avatar.jpg", { type: "image/jpeg" });
            
            setAvatarFile(croppedFile);
            setAvatarPreview(URL.createObjectURL(croppedImageBlob));
            
            setShowCropper(false);
            setImageToCrop(null);
        } catch (e) {
            console.error(e);
            alert("Error cropping image");
        }
    };

    const cancelCrop = () => {
        setShowCropper(false);
        setImageToCrop(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = new FormData();
            dataToSubmit.append("name", formData.name);
            dataToSubmit.append("artistType", formData.artistType || "");
            dataToSubmit.append("bio", formData.bio);
            dataToSubmit.append("website", formData.website);
            dataToSubmit.append("socialLinks", JSON.stringify(formData.socialLinks));
            dataToSubmit.append("location", formData.location);
            dataToSubmit.append("privacy", JSON.stringify(formData.privacy));
            dataToSubmit.append("notifications", JSON.stringify(formData.notifications));
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
            const errorMessage = typeof error === 'string' ? error : (error.response?.data?.message || "Failed to update profile");
            alert(errorMessage);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: "", text: "" });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: "error", text: "New passwords do not match" });
            return;
        }

        try {
            setIsUpdatingPassword(true);
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const token = localStorage.getItem("token");
            const response = await axios.put(`${API_URL}/auth/password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setPasswordMessage({ type: "success", text: "Password updated successfully" });
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setTimeout(() => {
                    setShowPasswordForm(false);
                    setPasswordMessage({ type: "", text: "" });
                }, 3000);
            }
        } catch (error) {
            setPasswordMessage({ type: "error", text: error.response?.data?.message || "Failed to update password" });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleDeleteAccount = () => {
        alert("To delete your account, please contact support through the Contact Us page.");
    };

    const sections = [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "account", label: "Account", icon: "⚙️" },
        { id: "privacy", label: "Privacy", icon: "🔒" },
        { id: "notifications", label: "Notifications", icon: "🔔" },
    ];

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            {showCropper && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#141821] rounded-xl w-full max-w-lg shadow-2xl flex flex-col h-[500px]">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center z-10">
                            <h3 className="text-xl font-bold text-white">Crop Profile Picture</h3>
                            <button type="button" onClick={cancelCrop} className="text-gray-400 hover:text-white">✕</button>
                        </div>
                        <div className="relative flex-1 bg-black">
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="p-6 bg-[#141821] rounded-b-xl border-t border-white/10 flex flex-col gap-4 z-10">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-gray-400">Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="flex-1 accent-[#8B5CF6]"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-2">
                                <button type="button" onClick={cancelCrop} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="button" onClick={applyCrop} className="btn-primary">
                                    Crop & Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="container mx-auto max-w-[1400px] px-6">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            Settings
                        </h1>
                    </div>
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
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Artist Type / Tags</label>
                                            <input
                                                type="text"
                                                name="artistType"
                                                value={formData.artistType}
                                                onChange={handleChange}
                                                className="input-field"
                                                placeholder="e.g. 3D Modeler, Concept Artist, UI/UX"
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

                                        <div className="pt-4 border-t border-white/5">
                                            <h3 className="text-lg font-bold text-white mb-4">Social Links</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {["instagram", "dribbble", "facebook"].map((platform) => (
                                                    <div key={platform}>
                                                        <label className="block text-sm font-semibold text-gray-300 mb-2 capitalize">{platform}</label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                                                            <input
                                                                type="text"
                                                                name={platform}
                                                                value={formData.socialLinks[platform]}
                                                                onChange={handleSocialLinkChange}
                                                                className="input-field pl-8"
                                                                placeholder={`Your ${platform} handle`}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "account" && (
                                <div className="space-y-6">
                                    <div className="card-surface p-8">
                                        <h2 className="text-xl font-bold text-white mb-4">Account Settings</h2>
                                        
                                        {/* Password Message */}
                                        {passwordMessage.text && (
                                            <div className={`p-4 mb-6 rounded-lg ${passwordMessage.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>
                                                {passwordMessage.text}
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <div className="flex flex-col py-4 border-b border-white/5">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold text-white">Change Password</p>
                                                        <p className="text-sm text-gray-400">Update your password regularly for security</p>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                                                        className="btn-secondary text-sm"
                                                    >
                                                        {showPasswordForm ? "Cancel" : "Update"}
                                                    </button>
                                                </div>
                                                
                                                {showPasswordForm && (
                                                    <div className="mt-6 bg-[#0B0D10] p-6 rounded-xl border border-white/5 space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Current Password</label>
                                                            <input
                                                                type="password"
                                                                name="currentPassword"
                                                                value={passwordData.currentPassword}
                                                                onChange={handlePasswordChange}
                                                                className="input-field"
                                                                placeholder="Enter current password"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-300 mb-2">New Password</label>
                                                            <input
                                                                type="password"
                                                                name="newPassword"
                                                                value={passwordData.newPassword}
                                                                onChange={handlePasswordChange}
                                                                className="input-field"
                                                                placeholder="Enter new password"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Confirm New Password</label>
                                                            <input
                                                                type="password"
                                                                name="confirmPassword"
                                                                value={passwordData.confirmPassword}
                                                                onChange={handlePasswordChange}
                                                                className="input-field"
                                                                placeholder="Confirm new password"
                                                            />
                                                        </div>
                                                        <div className="pt-2 flex justify-end">
                                                            <button 
                                                                type="button"
                                                                onClick={handlePasswordSubmit}
                                                                disabled={isUpdatingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                                                className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {isUpdatingPassword ? 'Updating...' : 'Save New Password'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center justify-between py-4 border-b border-white/5">
                                                <div>
                                                    <p className="font-semibold text-white">Two-Factor Authentication</p>
                                                    <p className="text-sm text-gray-400">Add an extra layer of security</p>
                                                </div>
                                                <button type="button" className="btn-secondary text-sm opacity-50 cursor-not-allowed" title="Coming soon">
                                                    Enable
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between py-4">
                                                <div>
                                                    <p className="font-semibold text-red-500">Delete Account</p>
                                                    <p className="text-sm text-gray-400">Permanently delete your account and data</p>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={handleDeleteAccount}
                                                    className="px-4 py-2 bg-red-500/10 text-red-500 font-semibold rounded-lg border border-red-500/20 hover:bg-red-500/20 text-sm"
                                                >
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
                                                <p className="font-semibold text-white">Show Email</p>
                                                <p className="text-sm text-gray-400">Display your email on your profile</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    name="showEmail"
                                                    checked={formData.privacy.showEmail}
                                                    onChange={handlePrivacyChange}
                                                    className="sr-only peer" 
                                                />
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
                                        {[
                                            { label: "Email Notifications", name: "emailNotifications" }, 
                                            { label: "Push Notifications", name: "pushNotifications" }, 
                                            { label: "Marketing Emails", name: "marketingEmails" }, 
                                            { label: "Weekly Digest", name: "weeklyDigest" }
                                        ].map((item) => (
                                            <div key={item.name} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                                                <p className="font-semibold text-white">{item.label}</p>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        name={item.name}
                                                        checked={formData.notifications[item.name]}
                                                        onChange={handleNotificationChange}
                                                        className="sr-only peer" 
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8B5CF6]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {["profile", "privacy", "notifications"].includes(activeSection) && (
                                <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
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

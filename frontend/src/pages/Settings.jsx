import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Settings = () => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState("profile");
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        bio: "Creative designer focused on modern digital art.",
        website: "",
        location: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        alert("Settings updated successfully!");
    };

    const sections = [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "account", label: "Account", icon: "⚙️" },
        { id: "privacy", label: "Privacy", icon: "🔒" },
        { id: "notifications", label: "Notifications", icon: "🔔" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20">
            <div className="container mx-auto max-w-[1400px] px-6">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Settings
                    </h1>
                    <p className="text-base text-gray-600 dark:text-gray-400">
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
                                            ? "bg-primary text-white"
                                            : "text-gray-600 hover:bg-gray-100"
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
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">Profile Information</h2>
                                        <p className="text-sm text-gray-600">Update your personal information and profile details</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
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
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="input-field"
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
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
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
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
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
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
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                                <div>
                                                    <p className="font-semibold text-gray-900">Change Password</p>
                                                    <p className="text-sm text-gray-600">Update your password regularly for security</p>
                                                </div>
                                                <button type="button" className="btn-secondary text-sm">
                                                    Update
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                                <div>
                                                    <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                                                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                                                </div>
                                                <button type="button" className="btn-secondary text-sm">
                                                    Enable
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between py-4">
                                                <div>
                                                    <p className="font-semibold text-red-600">Delete Account</p>
                                                    <p className="text-sm text-gray-600">Permanently delete your account and data</p>
                                                </div>
                                                <button type="button" className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg border border-red-200 hover:bg-red-100 text-sm">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "privacy" && (
                                <div className="card-surface p-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy Settings</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                            <div>
                                                <p className="font-semibold text-gray-900">Profile Visibility</p>
                                                <p className="text-sm text-gray-600">Control who can see your profile</p>
                                            </div>
                                            <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium">
                                                <option>Public</option>
                                                <option>Private</option>
                                                <option>Friends Only</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                            <div>
                                                <p className="font-semibold text-gray-900">Show Email</p>
                                                <p className="text-sm text-gray-600">Display your email on your profile</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "notifications" && (
                                <div className="card-surface p-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
                                    <div className="space-y-4">
                                        {["Email Notifications", "Push Notifications", "Marketing Emails", "Weekly Digest"].map((item) => (
                                            <div key={item} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
                                                <p className="font-semibold text-gray-900">{item}</p>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
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
                                    <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95">
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

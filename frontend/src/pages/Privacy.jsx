const Privacy = () => {
    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            <div className="container mx-auto max-w-[900px] px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
                <p className="text-gray-400 text-lg mb-12">Last updated: March 2026</p>

                <div className="space-y-8 text-gray-300 leading-relaxed text-sm">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
                        <p>We collect information you provide when creating an account (name, email, password), uploading content (files, metadata), and using the platform (browsing history, purchases). We also collect technical data such as IP address, browser type, and device information.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>To provide and maintain the PixPulse platform</li>
                            <li>To process transactions and manage your wallet</li>
                            <li>To personalize your experience and show relevant content</li>
                            <li>To communicate with you about your account and updates</li>
                            <li>To detect and prevent fraud or security issues</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Data Storage & Security</h2>
                        <p>Your data is stored securely using industry-standard encryption. Passwords are hashed using bcrypt. We use HTTPS for all communications. We do not sell your personal information to third parties.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Cookies</h2>
                        <p>We use essential cookies and local storage to maintain your session (JWT tokens). We do not use third-party tracking cookies. Authentication tokens are stored in your browser's local storage.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Third-Party Services</h2>
                        <p>We integrate with Google OAuth for authentication. When you sign in with Google, we receive your name, email, and profile picture. We do not share your data with other third-party services without your consent.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Your Rights</h2>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>Access and download your personal data</li>
                            <li>Request correction of inaccurate information</li>
                            <li>Delete your account and associated data</li>
                            <li>Opt out of promotional communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Data Retention</h2>
                        <p>We retain your data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">8. Contact</h2>
                        <p>For privacy-related questions, contact us at <a href="mailto:supportpixpulse@gmail.com" className="text-[#8B5CF6] hover:underline">supportpixpulse@gmail.com</a>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;

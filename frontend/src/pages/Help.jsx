import { useState } from "react";

const Help = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        { q: "How do I upload artwork?", a: "Navigate to your Dashboard and click 'Upload Artwork'. Fill in the details, set your price, and upload your file. Supported formats include images, audio, video, and preset files." },
        { q: "How does pricing work?", a: "You can list your work as Free or set a custom price. Creators earn 90% of each sale, with 10% going to the platform." },
        { q: "What is the Wallet?", a: "The Wallet is your PixPulse balance. Every new user starts with $500 test credits. You can use your wallet to purchase artworks on the platform." },
        { q: "How do I download purchased artwork?", a: "Go to 'My Purchases' from your dashboard. Each purchased item will have a download button to get the original file." },
        { q: "Can I report inappropriate content?", a: "Yes. On any artwork page, click the report button (flag icon) and fill out the report form. Our team will review it promptly." },
        { q: "How do favorites work?", a: "Click the heart icon on any artwork to save it to your Favorites. Access them anytime from the Favorites page." },
        { q: "What file types are supported?", a: "We support images (JPG, PNG, GIF, WebP), audio (MP3, WAV), video (MP4, WebM), and various preset/resource formats." },
        { q: "How do I search for specific content?", a: "Use the search bar on the Explore page. You can also use Draw-to-Search to sketch what you're looking for, or Hum-to-Search for audio." },
    ];

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            <div className="container mx-auto max-w-[900px] px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Help Center</h1>
                <p className="text-gray-400 text-lg mb-12">Frequently asked questions and support.</p>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-[#141821] border border-white/5 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <span className="text-white font-medium pr-4">{faq.q}</span>
                                <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openFaq === i && (
                                <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-[#141821] border border-white/5 rounded-2xl p-8 text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Still need help?</h2>
                    <p className="text-gray-400 mb-6">Reach out to our support team and we'll get back to you within 24 hours.</p>
                    <a href="mailto:supportpixpulse@gmail.com" className="btn-primary px-8 py-3 inline-block">Contact Support</a>
                </div>
            </div>
        </div>
    );
};

export default Help;

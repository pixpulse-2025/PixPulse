import { Link } from "react-router-dom";

const About = () => {
    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            <div className="container mx-auto max-w-[900px] px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About PixPulse</h1>
                <p className="text-gray-400 text-lg mb-12">The premium marketplace for digital creators.</p>

                <div className="space-y-10 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                        <p>PixPulse is built to empower digital creators by providing a beautiful, modern marketplace where artists can showcase, sell, and distribute their creative work — from visual art and music to presets, 3D assets, and more.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">What We Offer</h2>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#8B5CF6] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span><strong className="text-white">Visual Art</strong> — Digital paintings, illustrations, concept art, photography, and more.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#8B5CF6] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span><strong className="text-white">Audio</strong> — Music tracks, beats, sound effects, loops, and voice samples.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#8B5CF6] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span><strong className="text-white">Presets & Resources</strong> — Lightroom presets, Photoshop brushes, LUTs, and creative tools.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#8B5CF6] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span><strong className="text-white">Community</strong> — Connect, share, and get inspired by creators worldwide.</span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">For Creators</h2>
                        <p>Every creator on PixPulse earns <strong className="text-white">90% of every sale</strong>. We believe artists deserve the lion's share of their work. Upload your creations, set your price, and start earning.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Built for the Modern Era</h2>
                        <p>PixPulse features advanced search including draw-to-search and hum-to-search, a built-in wallet system, community feeds, and a premium dark-themed interface designed for the creative professional.</p>
                    </section>
                </div>

                <div className="mt-16 flex gap-4">
                    <Link to="/explore" className="btn-primary px-8 py-3">Explore Works</Link>
                    <Link to="/register" className="btn-secondary px-8 py-3">Join PixPulse</Link>
                </div>
            </div>
        </div>
    );
};

export default About;

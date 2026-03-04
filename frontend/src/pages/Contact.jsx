import { useState } from "react";

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            setStatus("error");
            return;
        }
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus(""), 5000);
    };

    return (
        <div className="min-h-screen bg-[#0B0D10] pt-32 pb-20">
            <div className="container mx-auto max-w-[700px] px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
                <p className="text-gray-400 text-lg mb-12">Have a question, feedback, or partnership inquiry? We'd love to hear from you.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-[#141821] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-[#141821] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                        <input
                            type="text"
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[#141821] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                            placeholder="What's this about?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Message *</label>
                        <textarea
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            rows="5"
                            className="w-full px-4 py-3 rounded-xl bg-[#141821] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors resize-none"
                            placeholder="Tell us more..."
                        />
                    </div>
                    <button type="submit" className="btn-primary px-8 py-3 w-full sm:w-auto">
                        Send Message
                    </button>
                </form>

                {status === "success" && (
                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Message sent! We'll get back to you soon.
                    </div>
                )}
                {status === "error" && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                        Please fill in all required fields.
                    </div>
                )}

                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-[#141821] border border-white/5 rounded-xl p-6">
                        <svg className="w-6 h-6 text-[#8B5CF6] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <h3 className="text-white font-semibold mb-1">Email</h3>
                        <a href="mailto:supportpixpulse@gmail.com" className="text-gray-400 text-sm hover:text-[#8B5CF6] transition-colors">supportpixpulse@gmail.com</a>
                    </div>
                    <div className="bg-[#141821] border border-white/5 rounded-xl p-6">
                        <svg className="w-6 h-6 text-[#8B5CF6] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <h3 className="text-white font-semibold mb-1">Location</h3>
                        <p className="text-gray-400 text-sm">Remote — Worldwide</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

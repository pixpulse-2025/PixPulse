const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Integrations", "Enterprise", "Changelog"]
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Contact", "Partners"]
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"]
    }
  ];

  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 transition-colors mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                P
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                PixPulse
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-xs leading-relaxed">
              Empowering creators with next-generation tools for digital artistry. Join the revolution today.
            </p>
            <div className="flex gap-4">
              {/* Social Placeholders */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-primary-500 hover:text-white transition-colors cursor-pointer" />
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column (Optional visual) */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 tracking-wide">
              Stay Updated
            </h3>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
              />
              <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {currentYear} PixPulse Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-500">
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Privacy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Terms</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

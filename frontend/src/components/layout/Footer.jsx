const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Marketplace",
      links: ["Explore Works", "New Editions", "Collections", "Trending"]
    },
    {
      title: "Community",
      links: ["Our Artists", "Pro Program", "Guidelines", "Affiliates"]
    },
    {
      title: "Company",
      links: ["Help Center", "Privacy Policy", "Terms of Service", "About Us"]
    }
  ];

  return (
    <footer className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-20">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">

          {/* Brand Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                PIX<span className="text-primary dark:text-accent">PULSE</span>
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-normal text-base leading-relaxed max-w-sm">
              A premium marketplace for digital assets. Built with love for the creative community.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {['Twitter', 'Instagram', 'LinkedIn', 'Facebook'].map((label) => (
                <button key={label} className="text-gray-400 hover:text-primary transition-colors">
                  <span className="sr-only">{label}</span>
                  <div className="w-5 h-5 rounded-full bg-gray-200 hover:bg-primary/10 transition-colors"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Status */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Status
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full" />
              <span className="text-sm text-gray-600">All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © {currentYear} PixPulse. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">Security</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

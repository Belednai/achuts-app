import { Scale, Mail, Linkedin, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t" style={{ backgroundColor: '#2e4559' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">
                Achut Abraham Panchol
              </span>
            </div>
            <p className="text-gray-200 mb-4 max-w-md">
              Legal insights, case analyses, and constitutional commentary from a Kenyan perspective. 
              Educational content for legal professionals and students.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/achuti.panchol" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/abraham-achut-panchol-b18829264/" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://x.com/AchutWal" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/articles" className="text-gray-200 hover:text-white transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-200 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-200 hover:text-white transition-colors">
                  My Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/disclaimer" className="text-gray-200 hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/rss" className="text-gray-200 hover:text-white transition-colors">
                  RSS Feed
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-gray-500 border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-200 text-sm">
              © {currentYear} Achut Abraham Panchol. All rights reserved.
            </p>
            <p className="text-gray-200 text-sm mt-2 md:mt-0">
              <strong className="text-white">Disclaimer:</strong> Educational content only — not legal advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
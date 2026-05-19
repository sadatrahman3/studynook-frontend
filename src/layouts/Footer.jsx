import { Link } from 'react-router-dom';
import { FiMail, FiPhone } from 'react-icons/fi';
import { FaFacebook, FaXTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa6';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SN</span>
            </div>
            <span className="text-xl font-bold text-white">StudyNook</span>
          </div>
          <p className="text-sm text-gray-400">
            Find and book the perfect study room in your library. List your own room and help fellow students.
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Useful Links</h3>
          <div className="space-y-2">
            <Link to="/" className="block text-sm hover:text-indigo-400 transition">Home</Link>
            <Link to="/rooms" className="block text-sm hover:text-indigo-400 transition">Rooms</Link>
            <Link to="/about" className="block text-sm hover:text-indigo-400 transition">About</Link>
          </div>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2"><FiMail /> contact@studynook.com</p>
            <p className="flex items-center gap-2"><FiPhone /> +1 (555) 123-4567</p>
          </div>
          <div className="flex gap-3 mt-4">
            <a href="#" className="text-gray-400 hover:text-white transition"><FaFacebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><FaXTwitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><FaLinkedin size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><FaInstagram size={20} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} StudyNook. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

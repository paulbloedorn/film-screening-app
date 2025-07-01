import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-display font-bold mb-4">
              <div className="text-base leading-tight">24</div>
              <div className="text-sm font-medium">DAYS</div>
              <div className="text-xs tracking-wider">WITHOUT</div>
              <div className="text-sm italic">YOU</div>
            </div>
            <p className="text-gray-400 text-sm">
              A powerful documentary about birth trauma, recovery, and the unbreakable bond between mother and child.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors duration-200">
                About the Film
              </Link>
              <Link href="/conference" className="block text-gray-400 hover:text-white transition-colors duration-200">
                Request Screening
              </Link>
              <a href="#press" className="block text-gray-400 hover:text-white transition-colors duration-200">
                Press Kit
              </a>
              <a href="#contact" className="block text-gray-400 hover:text-white transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 24 Days Without You. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

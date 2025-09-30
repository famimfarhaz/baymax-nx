import React from 'react';
import { motion } from 'framer-motion';
import { Code, Github, Linkedin, Twitter, Instagram, Youtube, MessageCircle } from 'lucide-react';

export default function Footer() {
  const links = {
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Gallery', href: '#' },
      { name: 'Status', href: '#' }
    ],
    company: [
      { name: 'Careers', href: '#' },
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Support', href: '#' }
    ],
    social: [
      { name: 'Discord', icon: MessageCircle, href: '#' },
      { name: 'LinkedIn', icon: Linkedin, href: '#' },
      { name: 'YouTube', icon: Youtube, href: '#' },
      { name: 'Twitter', icon: Twitter, href: '#' },
      { name: 'Instagram', icon: Instagram, href: '#' },
      { name: 'GitHub', icon: Github, href: '#' }
    ]
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="relative">
                <Code className="w-8 h-8 text-blue-400" />
                <motion.div
                  className="absolute -inset-1 bg-blue-400/20 rounded-full blur-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <h3 className="text-2xl font-bold text-white">Vibe Coding</h3>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gray-400 mb-6 max-w-md"
            >
              Transform your ideas into beautiful, functional websites with the power of AI. 
              <span className="text-blue-400 font-medium"> Powered by Baymax-NX.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              {links.social.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                  title={item.name}
                >
                  <item.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((item) => (
                <li key={item.name}>
                  <motion.a
                    href={item.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-white transition-all duration-200"
                  >
                    {item.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {links.company.map((item) => (
                <li key={item.name}>
                  <motion.a
                    href={item.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-white transition-all duration-200"
                  >
                    {item.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm">
            © 2025 Vibe Coding. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-4 sm:mt-0">
            Built with ❤️ using Baymax-NX AI
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
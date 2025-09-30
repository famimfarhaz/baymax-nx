import React from 'react';
import { motion } from 'framer-motion';
import { Github, Figma, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImportOptions() {
  const handleImportFromFigma = () => {
    toast.success('Figma import coming soon!');
  };

  const handleImportFromGithub = () => {
    toast.success('GitHub import coming soon!');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success(`File "${file.name}" uploaded successfully!`);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4 flex items-center">
        <Upload className="w-5 h-5 mr-2" />
        Import Your Design
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Figma Import */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleImportFromFigma}
          className="flex items-center space-x-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-purple-500 transition-all duration-200 group"
        >
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Figma className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h4 className="text-white font-medium">Import from Figma</h4>
            <p className="text-gray-400 text-sm">Convert your designs to code</p>
          </div>
        </motion.button>

        {/* GitHub Import */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleImportFromGithub}
          className="flex items-center space-x-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-blue-500 transition-all duration-200 group"
        >
          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Github className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h4 className="text-white font-medium">Import from GitHub</h4>
            <p className="text-gray-400 text-sm">Continue existing projects</p>
          </div>
        </motion.button>
      </div>

      {/* File Upload */}
      <div className="mt-4">
        <label className="block">
          <input
            type="file"
            accept=".html,.css,.js,.zip"
            onChange={handleFileUpload}
            className="hidden"
          />
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full p-4 border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-lg text-center cursor-pointer transition-all duration-200 group"
          >
            <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-400 mx-auto mb-2" />
            <p className="text-gray-400 group-hover:text-white">
              Drop files here or click to upload
            </p>
            <p className="text-gray-500 text-sm mt-1">
              HTML, CSS, JS, or ZIP files
            </p>
          </motion.div>
        </label>
      </div>
    </div>
  );
}
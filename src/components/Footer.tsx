import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-4 px-4 mt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-0">
          &copy; {currentYear} django CMS Association. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <a 
            href="https://www.django-cms.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            django CMS Website
          </a>
          <a 
            href="https://github.com/django-cms" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
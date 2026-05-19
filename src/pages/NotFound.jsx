import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  useEffect(() => {
    document.title = 'StudyNook – Page Not Found';
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link
          to="/"
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition inline-block"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

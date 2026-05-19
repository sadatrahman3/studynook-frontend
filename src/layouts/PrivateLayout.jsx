import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PrivateLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-800">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PrivateLayout;

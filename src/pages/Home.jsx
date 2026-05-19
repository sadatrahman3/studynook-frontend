import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiClock, FiShield } from 'react-icons/fi';
import API from '../api/axios';
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'StudyNook – Home';
    API.get('/rooms/latest')
      .then(({ data }) => setRooms(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Find Your Perfect Study Room
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-indigo-100 mb-8"
            >
              Browse and book quiet, private study rooms in your library. List your own room and earn.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/rooms"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition shadow-lg"
              >
                <FiSearch /> Explore Rooms
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Available Study Rooms
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover recently added study rooms. Each room comes with amenities for a productive session.
          </p>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
        {rooms.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              View All Rooms →
            </Link>
          </div>
        )}
      </section>

      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/20"
            >
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiSearch className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Search</h3>
              <p className="text-gray-600 dark:text-gray-400">Find study rooms by name, amenities, or price range with our powerful search.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/20"
            >
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiClock className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Instant Booking</h3>
              <p className="text-gray-600 dark:text-gray-400">Book your preferred time slot instantly with real-time availability checks.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/20"
            >
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-400">Your data is protected with secure authentication and encrypted storage.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Own a Study Room?</h2>
            <p className="text-indigo-100 text-lg mb-6 max-w-2xl mx-auto">
              List your study room on StudyNook and help fellow students find the perfect space to study.
              Earn while you learn!
            </p>
            <Link
              to="/add-room"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition shadow-lg"
            >
              List Your Room Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MyListings = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    document.title = 'StudyNook – My Listings';
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data } = await API.get('/rooms');
      setRooms(data);
    } catch {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/rooms/${id}`);
      toast.success('Room deleted successfully');
      setDeleteTarget(null);
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Listings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your study room listings.</p>
        </div>
        <Link
          to="/add-room"
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Add New Room
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
          <p className="text-xl text-gray-500 dark:text-gray-400">You have no listings yet</p>
          <Link to="/add-room" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-2 inline-block">
            Add your first room
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <motion.div
              key={room._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="sm:w-48 h-40 sm:h-auto overflow-hidden">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/rooms/${room._id}`} className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                    {room.name}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {room.floor} · ${room.hourlyRate}/hr · {room.bookingCount} booking(s)
                  </p>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link
                    to={`/rooms/${room._id}`}
                    className="px-4 py-1.5 text-sm border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition flex items-center gap-1"
                  >
                    <FiEdit2 /> Edit
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(room._id)}
                    className="px-4 py-1.5 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-1"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteTarget(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Room?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancel</button>
              <button onClick={() => handleDelete(deleteTarget)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyListings;

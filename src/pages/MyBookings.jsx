import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    document.title = 'StudyNook – My Bookings';
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my-bookings');
      setBookings(data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.patch(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      setCancelTarget(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const canCancel = (booking) => {
    if (booking.status !== 'confirmed') return false;
    const today = new Date().toISOString().split('T')[0];
    return booking.date >= today;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your room bookings.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
          <p className="text-xl text-gray-500 dark:text-gray-400">You have no bookings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="sm:w-40 h-32 sm:h-auto overflow-hidden">
                <img src={booking.room?.image} alt={booking.room?.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{booking.room?.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      📅 {booking.date} · 🕐 {booking.startTime} - {booking.endTime}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      💰 ${booking.totalCost} · 📍 {booking.room?.floor}
                    </p>
                    {booking.specialNote && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 italic">Note: {booking.specialNote}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {booking.status}
                    </span>
                    {canCancel(booking) && (
                      <button
                        onClick={() => setCancelTarget(booking._id)}
                        className="px-4 py-1.5 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {cancelTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setCancelTarget(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cancel Booking?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">This will cancel your booking.</p>
            <div className="flex gap-3">
              <button onClick={() => setCancelTarget(null)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">Keep</button>
              <button onClick={() => handleCancel(cancelTarget)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Cancel Booking</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;

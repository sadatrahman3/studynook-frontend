import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../api/axios';
import toast from 'react-hot-toast';

const BookingModal = ({ room, onClose, onBooked }) => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [specialNote, setSpecialNote] = useState('');
  const [loading, setLoading] = useState(false);

  const timeSlots = [];
  for (let h = 8; h <= 20; h++) {
    timeSlots.push(`${String(h).padStart(2, '0')}:00`);
  }

  const endSlots = startTime
    ? timeSlots.filter(t => {
        const startIdx = timeSlots.indexOf(startTime);
        const endIdx = timeSlots.indexOf(t);
        return endIdx > startIdx;
      })
    : [];

  const hours = startTime && endTime
    ? (timeSlots.indexOf(endTime) - timeSlots.indexOf(startTime))
    : 0;
  const totalCost = hours * room.hourlyRate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await API.post('/bookings', {
        roomId: room._id,
        date,
        startTime,
        endTime,
        totalCost,
        specialNote,
      });
      toast.success('Room booked successfully!');
      onBooked();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Book {room.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
            <select
              value={startTime}
              onChange={e => { setStartTime(e.target.value); setEndTime(''); }}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            >
              <option value="">Select start time</option>
              {timeSlots.slice(0, -1).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
            <select
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
              disabled={!startTime}
            >
              <option value="">Select end time</option>
              {endSlots.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          {totalCost > 0 && (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost: <span className="font-bold text-indigo-600 dark:text-indigo-400">${totalCost}</span></p>
              <p className="text-xs text-gray-500">{hours} hour(s) × ${room.hourlyRate}/hr</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Note (optional)</label>
            <textarea
              value={specialNote}
              onChange={e => setSpecialNote(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              rows={2}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingModal;

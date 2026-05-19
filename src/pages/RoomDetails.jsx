import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  const isOwner = user && room && room.owner?._id === user.id;

  useEffect(() => {
    document.title = 'StudyNook – Room Details';
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const { data } = await API.get(`/rooms/${id}`);
      setRoom(data);
      setEditForm({
        name: data.name,
        description: data.description,
        image: data.image,
        floor: data.floor,
        capacity: data.capacity,
        hourlyRate: data.hourlyRate,
        amenities: data.amenities,
      });
    } catch {
      toast.error('Room not found');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/rooms/${id}`, editForm);
      toast.success('Room updated successfully');
      setEditOpen(false);
      fetchRoom();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/rooms/${id}`);
      toast.success('Room deleted successfully');
      navigate('/my-listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const amenityOptions = ['Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'];

  const toggleEditAmenity = (a) => {
    setEditForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a],
    }));
  };

  if (loading) return <LoadingSpinner />;
  if (!room) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="h-72 md:h-96 overflow-hidden">
            <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{room.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>📍 {room.floor}</span>
                  <span>👥 {room.capacity} people</span>
                  <span>📅 {room.bookingCount} booking(s)</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                ${room.hourlyRate}<span className="text-lg font-normal text-gray-400">/hr</span>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{room.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {room.amenities?.map((a, i) => (
                <span key={i} className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full">
                  {a}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {user ? (
                <button
                  onClick={() => setBookingOpen(true)}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                >
                  Book Now
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                >
                  Login to Book
                </Link>
              )}

              {isOwner && (
                <>
                  <button
                    onClick={() => setEditOpen(true)}
                    className="px-6 py-3 border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-xl font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition flex items-center gap-2"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteOpen(true)}
                    className="px-6 py-3 border border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-2"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {bookingOpen && (
        <BookingModal
          room={room}
          onClose={() => setBookingOpen(false)}
          onBooked={() => { fetchRoom(); }}
        />
      )}

      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditOpen(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Room</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" rows={3} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                <input type="url" value={editForm.image} onChange={e => setEditForm({...editForm, image: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Floor</label>
                  <input type="text" value={editForm.floor} onChange={e => setEditForm({...editForm, floor: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
                  <input type="number" value={editForm.capacity} onChange={e => setEditForm({...editForm, capacity: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate ($/hr)</label>
                  <input type="number" value={editForm.hourlyRate} onChange={e => setEditForm({...editForm, hourlyRate: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {amenityOptions.map(a => (
                    <label key={a} className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={editForm.amenities?.includes(a)}
                        onChange={() => toggleEditAmenity(a)}
                        className="rounded"
                      />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Update</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {deleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteOpen(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Room?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;

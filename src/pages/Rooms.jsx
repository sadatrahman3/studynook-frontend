import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import API from '../api/axios';
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');

  const amenityOptions = ['Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'];

  useEffect(() => {
    document.title = 'StudyNook – Available Rooms';
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedAmenities.length) params.append('amenities', selectedAmenities.join(','));
    if (minRate) params.append('minRate', minRate);
    if (maxRate) params.append('maxRate', maxRate);

    API.get(`/rooms?${params.toString()}`)
      .then(({ data }) => setRooms(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, selectedAmenities, minRate, maxRate]);

  const toggleAmenity = (a) => {
    setSelectedAmenities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Available Rooms
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Find the perfect study space for your needs.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mb-8">
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by room name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Amenities:</span>
            {amenityOptions.map(a => (
              <button
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`px-3 py-1 text-sm rounded-full border transition ${
                  selectedAmenities.includes(a)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="number"
              placeholder="Min $"
              value={minRate}
              onChange={e => setMinRate(e.target.value)}
              className="w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max $"
              value={maxRate}
              onChange={e => setMaxRate(e.target.value)}
              className="w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : rooms.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 dark:text-gray-400">No rooms found</p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RoomCard = ({ room }) => {
  const truncate = (str, len) => str?.length > len ? str.slice(0, len) + '...' : str;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden flex flex-col"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {room.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-1">
          {truncate(room.description, 100)}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>📍 {room.floor}</span>
          <span>👥 {room.capacity} people</span>
        </div>
        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-3">
          ${room.hourlyRate}/hr
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {room.amenities?.slice(0, 3).map((a, i) => (
            <span key={i} className="px-2 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full">
              {a}
            </span>
          ))}
          {room.amenities?.length > 3 && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>
        <Link
          to={`/rooms/${room._id}`}
          className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium mt-auto"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default RoomCard;

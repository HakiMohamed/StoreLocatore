import { Store } from '../types/Store';
import { FaEdit, FaTrash, FaMapMarkerAlt, FaStore, FaMap, FaTag } from 'react-icons/fa';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { StoreMap } from './StoreMap'; // Import StoreMap

interface Props {
  stores: Store[];
  onEdit: (store: Store) => void;
  onDelete: (id: string) => void;
  onShowOnMap: (store: Store) => void;
}

export const StoreList = ({ stores, onEdit, onDelete, onShowOnMap }: Props) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  if (stores.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <FaStore className="mx-auto h-16 w-16 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No stores available</h3>
        <p className="mt-2 text-gray-500">
          Start by adding your first store
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store, index) => (
        <motion.div
          key={store.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
        >
          <div className="relative aspect-[16/9] overflow-hidden">
            {!failedImages.has(store.id) ? (
              <img
                src={store.imageUrl}
                alt={store.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                onError={() => setFailedImages(prev => new Set(prev).add(store.id))}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <FaStore className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {store.name}
                </h3>
                <div className="flex items-center mt-2 text-gray-600">
                  <FaMapMarkerAlt className="h-4 w-4 flex-shrink-0" />
                  <span className="ml-2 text-sm">{store.city} - {store.postalCode}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {store.services.map((service, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
                  >
                    <FaTag className="h-3 w-3 mr-1" />
                    {service}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onShowOnMap(store)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FaMap className="h-4 w-4 mr-2" />
                  View on Map
                </motion.button>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEdit(store)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEdit className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this store?')) {
                        onDelete(store.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}; 
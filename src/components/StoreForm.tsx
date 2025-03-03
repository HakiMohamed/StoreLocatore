import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, StoreFormData } from '../types/Store';
import { LocationPicker } from './LocationPicker';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStore, FaCity, FaMapPin, FaMapMarkerAlt } from 'react-icons/fa';
import { TagInput } from './TagInput';
import { StoreMap } from './StoreMap';

const storeSchema = z.object({
  name: z.string().min(1, 'The name is required'),
  city: z.string().min(1, 'The city is required'),
  postalCode: z.string().min(5, 'Invalid postal code'),
});

interface Props {
  onSubmit: (data: StoreFormData) => void;
  initialData?: Store;
  isEdit?: boolean;
}

const InputField = ({ 
  label, 
  error, 
  icon: Icon, 
  ...props 
}: { 
  label: string; 
  error?: string; 
  icon: React.ElementType; 
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-2"
  >
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative rounded-lg shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        {...props}
        className={`
          block w-full pl-10 pr-3 py-2.5 rounded-lg border
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                   'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}
          shadow-sm transition-all duration-200
          placeholder:text-gray-400 text-gray-900
          focus:ring-2 focus:ring-opacity-50
        `}
      />
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-red-600 mt-1"
      >
        {error}
      </motion.p>
    )}
  </motion.div>
);

export const StoreForm = ({ onSubmit, initialData, isEdit = false }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: initialData ? {
      ...initialData,
      services: initialData.services.join(', ')
    } : undefined
  });

  const [coordinates, setCoordinates] = useState<[number, number]>(
    initialData ? [initialData.latitude, initialData.longitude] : [48.8566, 2.3522]
  );

  const [services, setServices] = useState<string[]>(
    initialData?.services || []
  );

  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleFormSubmit = (data: Omit<StoreFormData, 'services'>) => {
    onSubmit({
      ...data,
      services: services.join(', '),
      latitude: coordinates[0],
      longitude: coordinates[1]
    });
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setCoordinates([lat, lng]);
    setIsMapOpen(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      <InputField
        label="Store Name"
        icon={FaStore}
        {...register('name')}
        placeholder="E.g., My Shop"
        error={errors.name?.message}
        className="w-full md:w-1/2"
      />

      <InputField
        label="City"
        icon={FaCity}
        {...register('city')}
        placeholder="E.g., Paris"
        error={errors.city?.message}
        className="w-full md:w-1/2"
      />

      <InputField
        label="Postal Code"
        icon={FaMapPin}
        {...register('postalCode')}
        placeholder="E.g., 75001"
        error={errors.postalCode?.message}
        className="w-full md:w-1/2"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Location on the map
        </label>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setIsMapOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Select Location on Map
          </button>
          <div className="ml-4">
            <FaMapMarkerAlt className="h-4 w-4" />
            <span>{`Selected: ${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}`}</span>
          </div>
        </div>
      </div>

      <TagInput
        value={services}
        onChange={setServices}
        placeholder="Add services (Press Enter or comma)"
        error={errors.services?.message}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full flex items-center justify-center px-4 py-3 border border-transparent
                 text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                 transition-colors duration-200 shadow-lg"
      >
        {isEdit ? 'Edit Store' : 'Add Store'}
      </motion.button>

      {isMapOpen && (
        <div className="relative h-96">
          <StoreMap
            stores={[]}
            selectedStore={null}
            center={coordinates}
            onStoreSelect={handleLocationSelect}
            isAddingNewStore={true}
          />
        </div>
      )}
    </motion.form>
  );
};
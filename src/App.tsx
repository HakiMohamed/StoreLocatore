import { useState } from 'react';
import './App.css';
import { StoreForm } from './components/StoreForm';
import { StoreMap } from './components/StoreMap';
import { StoreList } from './components/StoreList';
import { useStores } from './hooks/useStores';
import { Store, StoreFormData } from './types/Store';
import { Dialog } from '@headlessui/react';
import { FaPlus, FaSearch, FaTimes, FaArrowLeft } from 'react-icons/fa';
import Carousel from './components/Carousel';

export default function App() {
  const { 
    stores, 
    addStore, 
    updateStore, 
    deleteStore, 
  } = useStores();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | undefined>(undefined);
  const [selectedStore, setSelectedStore] = useState<Store | undefined>(undefined);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Default to Paris
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleSubmit = (data: StoreFormData) => {
    if (editingStore) {
      updateStore(editingStore.id, data);
      setEditingStore(undefined); 
    } else {
      const newStore = addStore(data);
      setSelectedStore(newStore);
    }
    setIsFormOpen(false);
  };

  const handleShowOnMap = (store: Store) => {
    setSelectedStore(store);
    setMapCenter([store.latitude, store.longitude]);
    setShowMap(true);
  };

  const filteredStores = searchQuery
    ? stores.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stores;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-white">
      {/* Navbar */}
      <nav className="bg-indigo-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap">
          <h1 className="text-white text-2xl font-bold">Store Locator</h1>
          <button 
            onClick={() => setIsNavOpen(!isNavOpen)} 
            className="text-white sm:hidden focus:outline-none"
          >
            {isNavOpen ? '✖' : '☰'}
          </button>
          <div 
            className={`${isNavOpen ? 'block' : 'hidden'} sm:flex sm:items-center w-full sm:w-auto mt-4 sm:mt-0`}
          >
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <a href="#features" className="text-white px-4 py-2 hover:bg-indigo-700 rounded">Features</a>
              <a href="#about" className="text-white px-4 py-2 hover:bg-indigo-700 rounded">About</a>
              <button 
                onClick={() => setIsFormOpen(true)} 
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Add Store
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-800 to-gray-800 text-white text-center py-20">
        <h2 className="text-5xl md:text-6xl font-extrabold">Find Your Favorite Stores</h2>
        <p className="mt-4 text-lg md:text-xl">Discover local shops and services near you with ease.</p>
        <button className="mt-6 px-8 py-3 bg-[#FF6F61] text-white rounded-lg shadow-lg hover:bg-[#FF4C3B] transition duration-300 transform hover:scale-105">
          Get Started
        </button>
      </div>

      {/* Carousel Section */}
      <Carousel />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* About Section */}
        <div id="about" className="py-10">
          <h3 className="text-4xl font-bold text-center">About Our Application</h3>
          <p className="mt-4 text-center text-lg">
            Our Store Locator application is designed to help users find local shops and services quickly and easily. 
            With a user-friendly interface and powerful search capabilities, you can discover the best stores in your area.
          </p>
        </div>

        {/* Features Section */}
        <div id="features" className="py-10">
          <h3 className="text-5xl font-bold text-center text-[#4B0082]">Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
            <div className="bg-[#E6E6FA] rounded-lg shadow-lg p-6 text-center">
              <h4 className="text-xl font-semibold text-[#4B0082]">🔍 Search</h4>
              <p>Search for stores by name or category.</p>
            </div>
            <div className="bg-[#E6E6FA] rounded-lg shadow-lg p-6 text-center">
              <h4 className="text-xl font-semibold text-[#4B0082]">📍 Map View</h4>
              <p>View store locations on a map.</p>
            </div>
            <div className="bg-[#E6E6FA] rounded-lg shadow-lg p-6 text-center">
              <h4 className="text-xl font-semibold text-[#4B0082]">⭐ Favorites</h4>
              <p>Save your favorite stores for quick access.</p>
            </div>
            <div className="bg-[#E6E6FA] rounded-lg shadow-lg p-6 text-center">
              <h4 className="text-xl font-semibold text-[#4B0082]">🛍️ Directions</h4>
              <p>Get directions to stores easily.</p>
            </div>
          </div>
        </div>

        {showMap ? (
          // Map View
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowMap(false)}
                className="flex bg-green-700 px-4 py-2 rounded-lg items-center space-x-2 text-white hover:text-gray-800"
              >
                <FaArrowLeft className="h-4 w-4 " />
                <span>Back to List</span>
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedStore ? `${selectedStore.name} on the map` : 'Store Map'}
              </h2>
            </div>
            <div className="h-[600px] rounded-xl overflow-hidden shadow-lg">
              <StoreMap
                stores={stores}
                center={mapCenter}
                selectedStore={selectedStore}
                onStoreSelect={setSelectedStore}
              />
            </div>
          </div>
        ) : (
          // List View
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center flex-wrap">
              <div className="flex-1 max-w-md mb-4 sm:mb-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for a store..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(true)}
                className="ml-0 sm:ml-4 mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center space-x-2 transition duration-200 ease-in-out transform hover:scale-105"
              >
                <FaPlus className="h-4 w-4" />
                <span>Add Store</span>
              </button>
            </div>

            <StoreList
              stores={filteredStores}
              onEdit={(store) => {
                setEditingStore(store);
                setIsFormOpen(true);
              }}
              onDelete={deleteStore}
              onShowOnMap={handleShowOnMap}
            />
          </div>
        )}

        {/* Form Modal */}
        <Dialog
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingStore(undefined);
          }}
          className="relative z-[9999]"
        >
          <div className="fixed inset-0 bg-black/30 z-[9999]" aria-hidden="true" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000]">
            <Dialog.Panel className="mx-auto bg-white rounded-xl shadow-2xl w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex w-full justify-between items-center mb-4">
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    {editingStore ? 'Edit Store' : 'Add New Store'}
                  </Dialog.Title>
                  <button
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingStore(undefined);
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                <StoreForm 
                  onSubmit={handleSubmit} 
                  initialData={editingStore}
                  isEdit={!!editingStore}
                />
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>

      <footer className="bg-[#333333] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© {new Date().getFullYear()} Store Locator. All rights reserved.</p>
          <div className="mt-2 flex flex-col sm:flex-row justify-center">
            <a href="#about" className="text-gray-400 hover:text-white mx-2">About</a>
            <a href="#features" className="text-gray-400 hover:text-white mx-2">Features</a>
            <a href="#contact" className="text-gray-400 hover:text-white mx-2">Contact</a>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
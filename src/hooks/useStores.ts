import { useState, useEffect } from 'react';
import { Store, StoreFormData } from '../types/Store';
import { getRandomStoreImage } from '../utils/imageUtils';

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  useEffect(() => {
    const storedStores = localStorage.getItem('stores');
    if (storedStores) {
      setStores(JSON.parse(storedStores));
    }
  }, []);

  const addStore = (formData: StoreFormData) => {
    const newStore: Store = {
      id: crypto.randomUUID(),
      ...formData,
      services: formData.services.split(',').map(s => s.trim()),
      imageUrl: getRandomStoreImage(),
    };
    const newStores = [...stores, newStore];
    setStores(newStores);
    localStorage.setItem('stores', JSON.stringify(newStores));
    return newStore;
  };

  const updateStore = (id: string, formData: StoreFormData) => {
    const newStores = stores.map(store => 
      store.id === id 
        ? { 
            ...store, 
            ...formData,
            services: formData.services.split(',').map(s => s.trim()),
          }
        : store
    );
    setStores(newStores);
    localStorage.setItem('stores', JSON.stringify(newStores));
  };

  const deleteStore = (id: string) => {
    const newStores = stores.filter(store => store.id !== id);
    setStores(newStores);
    localStorage.setItem('stores', JSON.stringify(newStores));
    if (selectedStore?.id === id) {
      setSelectedStore(null);
    }
  };

  const searchStores = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return stores.filter(
      store =>
        store.name.toLowerCase().includes(lowercaseQuery) ||
        store.city.toLowerCase().includes(lowercaseQuery) ||
        store.postalCode.includes(query)
    );
  };

  return { 
    stores, 
    selectedStore,
    setSelectedStore,
    addStore, 
    updateStore,
    deleteStore, 
    searchStores 
  };
}; 
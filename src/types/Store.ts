export interface Store {
  id: string;
  name: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  services: string[];
  imageUrl: string;
}

export interface StoreFormData {
  name: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  services: string;
} 
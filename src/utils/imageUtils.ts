// Utilisation de Lorem Picsum qui est plus permissif avec CORS
const getRandomPicsumId = () => Math.floor(Math.random() * 1000) + 1;

export const getRandomStoreImage = () => {
  // Génère une nouvelle URL à chaque appel pour éviter les doublons
  return `https://picsum.photos/seed/${getRandomPicsumId()}/800/600`;
}; 
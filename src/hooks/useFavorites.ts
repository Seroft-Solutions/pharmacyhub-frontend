import {useEffect, useState} from 'react';

const FAVORITES_KEY = 'pharmacyhub-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      }
    }
  }, []);

  const addFavorite = (href: string) => {
    const newFavorites = [...favorites, href];
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const removeFavorite = (href: string) => {
    const newFavorites = favorites.filter(fav => fav !== href);
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const toggleFavorite = (href: string) => {
    if (favorites.includes(href)) {
      removeFavorite(href);
    } else {
      addFavorite(href);
    }
  };

  const isFavorite = (href: string) => favorites.includes(href);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
}
import { useEffect, useState } from 'react';

// Requirement 4: only post IDs are stored, using the Web Storage API (localStorage)
const STORAGE_KEY = 'favouritePostIds';

function loadIds(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function useFavourites() {
  // Passing the function (not loadIds()) means it only runs on the first render
  const [favouriteIds, setFavouriteIds] = useState<string[]>(loadIds);

  // Every time the list changes, save it
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favouriteIds));
    } catch (error) {
      console.error('Could not save favourites', error);
    }
  }, [favouriteIds]);

  function isFavourite(id: string): boolean {
    return favouriteIds.includes(id);
  }

  function addFavourite(id: string): void {
    setFavouriteIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function removeFavourite(id: string): void {
    setFavouriteIds((prev) => prev.filter((savedId) => savedId !== id));
  }

  return { favouriteIds, isFavourite, addFavourite, removeFavourite };
}

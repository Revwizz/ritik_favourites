/*
 * FILE          : useFavourites.ts
 * PROJECT       : Advanced Web Frameworks - Reddit Favourites (Devvit)
 * PROGRAMMER    : Ritik Vyas
 * FIRST VERSION : 2026-11-05
 * DESCRIPTION   :
 *   A custom React hook that keeps the list of favourite post IDs and saves
 *   it with the Web Storage API (localStorage) every time it changes
 *   (Requirement 4). Only post IDs are stored, never any other post data.
 */

import { useEffect, useState } from 'react';

// localStorage key that holds the JSON array of favourite post IDs
const STORAGE_KEY = 'favouritePostIds';

//
// FUNCTION      : loadIds
// DESCRIPTION   :
//   Reads the saved favourite IDs from localStorage. Returns an empty list
//   if nothing is saved, the value is corrupted, or storage is blocked.
// PARAMETERS    :
//   none
// RETURNS       :
//   string[] : the saved post IDs
//
function loadIds(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

//
// FUNCTION      : useFavourites
// DESCRIPTION   :
//   Holds the favourite IDs in React state, loads them once on start-up and
//   writes them back to localStorage whenever they change.
// PARAMETERS    :
//   none
// RETURNS       :
//   object : { favouriteIds, isFavourite, addFavourite, removeFavourite }
//
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

  //
  // FUNCTION      : isFavourite
  // DESCRIPTION   : Checks whether a post is in the favourites list.
  // PARAMETERS    :
  //   string id : the post ID
  // RETURNS       :
  //   boolean : true if the post is a favourite
  //
  function isFavourite(id: string): boolean {
    return favouriteIds.includes(id);
  }

  //
  // FUNCTION      : addFavourite
  // DESCRIPTION   : Adds a post ID to the favourites (ignored if already there).
  // PARAMETERS    :
  //   string id : the post ID
  // RETURNS       :
  //   void
  //
  function addFavourite(id: string): void {
    setFavouriteIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  //
  // FUNCTION      : removeFavourite
  // DESCRIPTION   : Removes a post ID from the favourites.
  // PARAMETERS    :
  //   string id : the post ID
  // RETURNS       :
  //   void
  //
  function removeFavourite(id: string): void {
    setFavouriteIds((prev) => prev.filter((savedId) => savedId !== id));
  }

  return { favouriteIds, isFavourite, addFavourite, removeFavourite };
}

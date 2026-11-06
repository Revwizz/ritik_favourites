/*
 * FILE          : App.tsx
 * PROJECT       : Advanced Web Frameworks - Reddit Favourites
 * PROGRAMMER    : Ritik Vyas
 * FIRST VERSION : 2026-11-05
 * DESCRIPTION   :
 *   The top-level component of the full app. It owns the favourites state
 *   (through useFavourites) because both the hot posts list and the
 *   favourites list need it, and lays out the two panels.
 */

import { useState } from 'react';
import { HOT_POST_LIMIT } from '../shared/api';
import { FavouritesList } from './components/FavouritesList';
import { SubredditForm } from './components/SubredditForm';
import { SubredditPosts } from './components/SubredditPosts';
import { useFavourites } from './useFavourites';

//
// FUNCTION      : App
// DESCRIPTION   :
//   React component for the whole app: header, search form, hot posts
//   panel and favourites panel.
// PARAMETERS    :
//   none
// RETURNS       :
//   JSX.Element : the app
//
export function App() {
  const [subreddit, setSubreddit] = useState('');
  const { favouriteIds, isFavourite, addFavourite, removeFavourite } = useFavourites();

  //
  // FUNCTION      : toggleFavourite
  // DESCRIPTION   : Adds a post to the favourites, or removes it if already there.
  // PARAMETERS    :
  //   string id : the post ID
  // RETURNS       :
  //   void
  //
  function toggleFavourite(id: string): void {
    if (isFavourite(id)) {
      removeFavourite(id);
    } else {
      addFavourite(id);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="logo" aria-hidden="true">
          ★
        </span>
        <div>
          <h1>Reddit Favourites</h1>
          <p>Find a subreddit, star the posts you like, and they’ll be here next time.</p>
        </div>
      </header>

      <SubredditForm onSearch={setSubreddit} />

      <main className="columns">
        {subreddit ? (
          <SubredditPosts
            subreddit={subreddit}
            isFavourite={isFavourite}
            onToggleFavourite={toggleFavourite}
          />
        ) : (
          <section className="panel">
            <div className="panel-header">
              <h2>Hot posts</h2>
            </div>
            <div className="empty">
              <p className="status">
                Enter a subreddit above to see its top {HOT_POST_LIMIT} hot posts.
              </p>
            </div>
          </section>
        )}

        <FavouritesList favouriteIds={favouriteIds} onRemove={removeFavourite} />
      </main>
    </div>
  );
}

import { useState } from 'react';
import { FavouritesList } from './components/FavouritesList';
import { SubredditForm } from './components/SubredditForm';
import { SubredditPosts } from './components/SubredditPosts';
import { useFavourites } from './useFavourites';

export function App() {
  const [subreddit, setSubreddit] = useState('');
  const { favouriteIds, isFavourite, addFavourite, removeFavourite } = useFavourites();

  function toggleFavourite(id: string) {
    if (isFavourite(id)) {
      removeFavourite(id);
    } else {
      addFavourite(id);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Reddit Favourites</h1>
        <p>Find a subreddit, star the posts you like, and they’ll be here next time.</p>
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
            <h2>Hot posts</h2>
            <p className="status">Enter a subreddit above to see its top 10 hot posts.</p>
          </section>
        )}

        <FavouritesList favouriteIds={favouriteIds} onRemove={removeFavourite} />
      </main>
    </div>
  );
}

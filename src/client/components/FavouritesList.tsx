/*
 * FILE          : FavouritesList.tsx
 * PROJECT       : Advanced Web Frameworks - Reddit Favourites
 * PROGRAMMER    : Ritik Vyas
 * FIRST VERSION : 2026-11-05
 * DESCRIPTION   :
 *   Shows the user's favourite posts from all subreddits, with a button to
 *   remove each on. Post data is fetched from the Reddit
 *   API using the saved IDs and kept in memory only; it is never stored.
 */

import { useEffect, useState } from 'react';
import type { PostSummary } from '../../shared/api';
import { fetchPostsByIds } from '../api';
import { PostItem } from './PostItem';

type FavouritesListProps = {
  favouriteIds: string[];
  onRemove: (id: string) => void;
};

//
// FUNCTION      : FavouritesList
// DESCRIPTION   :
//   React component that fetches data for any favourite IDs it has not
//   loaded yet and lists every favourite. A post Reddit cannot find
//   is shown as "no longer available" so it can be removed.
// PARAMETERS    :
//   string[] favouriteIds : the saved post IDs, in the order they were added
//   function onRemove     : removes a post ID from the favourites
// RETURNS       :
//   JSX.Element : the "My favourites" panel
//
export function FavouritesList({ favouriteIds, onRemove }: FavouritesListProps) {
  // Post data from the Reddit API, kept in memory only.
  // null means Reddit could not find that post.
  const [postsById, setPostsById] = useState<Record<string, PostSummary | null>>({});
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0); // bumping this re-runs the fetch

  // Only fetch IDs we have not fetched yet
  const missingIds = favouriteIds.filter((id) => !(id in postsById));
  const missingKey = missingIds.join(',');

  useEffect(() => {
    if (missingKey === '') {
      return;
    }
    let ignore = false;
    const ids = missingKey.split(',');

    fetchPostsByIds(ids)
      .then((data) => {
        if (ignore) {
          return;
        }
        setPostsById((prev) => {
          const next = { ...prev };
          ids.forEach((id) => {
            next[id] = null;
          });
          data.posts.forEach((post) => {
            next[post.id] = post;
          });
          return next;
        });
        setError('');
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Something went wrong.';
        if (!ignore) {
          setError(`Could not load favourites. ${message}`);
        }
      });

    return () => {
      ignore = true;
    };
  }, [missingKey, attempt]);

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>My favourites</h2>
        <span className="count">{favouriteIds.length}</span>
      </div>

      {favouriteIds.length === 0 && (
        <div className="empty">
          <span className="empty-icon" aria-hidden="true">
            ☆
          </span>
          <p className="status">No favourites yet. Click ☆ Favourite on a post to save it here.</p>
        </div>
      )}
      {missingIds.length > 0 && !error && (
        <p className="status">
          <span className="spinner" aria-hidden="true" /> Loading favourites…
        </p>
      )}
      {error && (
        <p className="error">
          {error}{' '}
          <button type="button" className="link-btn" onClick={() => setAttempt((n) => n + 1)}>
            Try again
          </button>
        </p>
      )}

      <ul className="post-list">
        {favouriteIds.map((id) => {
          const post = postsById[id];

          if (post === undefined) {
            return null; // still loading
          }

          if (post === null) {
            return (
              <li key={id} className="post">
                <div className="post-body">
                  <p className="title muted">This post is no longer available</p>
                </div>
                <button type="button" className="fav-btn" onClick={() => onRemove(id)}>
                  Remove
                </button>
              </li>
            );
          }

          return (
            <PostItem
              key={id}
              post={post}
              isFavourite
              buttonLabel="Remove"
              onButtonClick={() => onRemove(id)}
            />
          );
        })}
      </ul>
    </section>
  );
}

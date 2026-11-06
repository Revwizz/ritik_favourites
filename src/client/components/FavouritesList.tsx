import { useEffect, useState } from 'react';
import type { PostSummary } from '../../shared/api';
import { fetchPostsByIds } from '../api';
import { PostItem } from './PostItem';

type FavouritesListProps = {
  favouriteIds: string[];
  onRemove: (id: string) => void;
};

export function FavouritesList({ favouriteIds, onRemove }: FavouritesListProps) {
  // Post data from the Reddit API, kept in memory only (never saved).
  // null means Reddit could not find that post (e.g. it was deleted).
  const [postsById, setPostsById] = useState<Record<string, PostSummary | null>>({});
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0); // bumping this re-runs the fetch

  // Only fetch IDs we have not fetched yet
  const missingIds = favouriteIds.filter((id) => !(id in postsById));
  const missingKey = missingIds.join(',');

  useEffect(() => {
    if (missingKey === '') return;
    let ignore = false;
    const ids = missingKey.split(',');

    fetchPostsByIds(ids)
      .then((data) => {
        if (ignore) return;
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
        if (!ignore) setError(`Could not load favourites. ${message}`);
      });

    return () => {
      ignore = true;
    };
  }, [missingKey, attempt]);

  return (
    <section className="panel">
      <h2>My favourites ({favouriteIds.length})</h2>

      {favouriteIds.length === 0 && (
        <p className="status">No favourites yet. Click ☆ on a post to add it.</p>
      )}
      {missingIds.length > 0 && !error && <p className="status">Loading favourites…</p>}
      {error && (
        <p className="error">
          {error}{' '}
          <button type="button" onClick={() => setAttempt((n) => n + 1)}>
            Try again
          </button>
        </p>
      )}

      <ul className="post-list">
        {favouriteIds.map((id) => {
          const post = postsById[id];

          if (post === undefined) return null; // still loading

          if (post === null) {
            return (
              <li key={id} className="post">
                <div className="post-body">
                  <p className="title">This post is no longer available</p>
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

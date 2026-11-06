import { useEffect, useState } from 'react';
import type { PostSummary } from '../../shared/api';
import { fetchHotPosts } from '../api';
import { PostItem } from './PostItem';

type SubredditPostsProps = {
  subreddit: string;
  isFavourite: (id: string) => boolean;
  onToggleFavourite: (id: string) => void;
};

type Result = {
  subreddit: string | null; // which subreddit these posts belong to
  posts: PostSummary[];
  error: string;
};

export function SubredditPosts({ subreddit, isFavourite, onToggleFavourite }: SubredditPostsProps) {
  const [result, setResult] = useState<Result>({ subreddit: null, posts: [], error: '' });

  useEffect(() => {
    let ignore = false; // ignore old responses if the user searches again quickly

    fetchHotPosts(subreddit)
      .then((posts) => {
        if (!ignore) setResult({ subreddit, posts, error: '' });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Something went wrong.';
        if (!ignore) setResult({ subreddit, posts: [], error: message });
      });

    return () => {
      ignore = true;
    };
  }, [subreddit]);

  // Still loading if the result is for a different (older) subreddit
  const loading = result.subreddit !== subreddit;

  return (
    <section className="panel">
      <h2>Hot in r/{subreddit}</h2>

      {loading && <p className="status">Loading…</p>}
      {!loading && result.error && <p className="error">{result.error}</p>}
      {!loading && !result.error && result.posts.length === 0 && (
        <p className="status">No posts found. Check the subreddit name.</p>
      )}

      {!loading && result.posts.length > 0 && (
        <ol className="post-list">
          {result.posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              isFavourite={isFavourite(post.id)}
              buttonLabel={isFavourite(post.id) ? '★ Favourited' : '☆ Favourite'}
              onButtonClick={() => onToggleFavourite(post.id)}
            />
          ))}
        </ol>
      )}
    </section>
  );
}

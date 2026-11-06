import { navigateTo } from '@devvit/web/client';
import type { PostSummary } from '../../shared/api';

type PostItemProps = {
  post: PostSummary;
  buttonLabel: string;
  onButtonClick: () => void;
  isFavourite: boolean;
};

// One post row: score, title, link to comments, and a button
export function PostItem({ post, buttonLabel, onButtonClick, isFavourite }: PostItemProps) {
  const commentsUrl = `https://www.reddit.com${post.permalink}`;

  return (
    <li className="post">
      <div className="score">{post.score.toLocaleString()}</div>

      <div className="post-body">
        <p className="title">{post.title}</p>
        <p className="meta">
          r/{post.subredditName} ·{' '}
          <a
            href={commentsUrl}
            onClick={(event) => {
              event.preventDefault(); // apps must open links with navigateTo
              navigateTo(commentsUrl);
            }}
          >
            {post.numberOfComments.toLocaleString()} comments
          </a>
        </p>
      </div>

      <button
        type="button"
        className={isFavourite ? 'fav-btn active' : 'fav-btn'}
        onClick={onButtonClick}
      >
        {buttonLabel}
      </button>
    </li>
  );
}

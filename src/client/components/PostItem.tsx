/*
 * FILE          : PostItem.tsx
 * PROJECT       : Advanced Web Frameworks - Reddit Favourites
 * PROGRAMMER    : Ritik Vyas
 * FIRST VERSION : 2026-11-05
 * DESCRIPTION   :
 *   One row in a list of posts. Shows the post's score, title and a link to
 *   its comments page, plus one action button. Used by both the hot posts
 *   list and the favourites list.
 */

import { navigateTo } from '@devvit/web/client';
import type { PostSummary } from '../../shared/api';

// Base address that a post's permalink is added to
const REDDIT_BASE_URL = 'https://www.reddit.com';

type PostItemProps = {
  post: PostSummary;
  buttonLabel: string;
  onButtonClick: () => void;
  isFavourite: boolean;
};

//
// FUNCTION      : PostItem
// DESCRIPTION   :
//   React component that renders one post row.
// PARAMETERS    :
//   PostSummary post        : the post to show
//   string buttonLabel      : text of the action button
//   function onButtonClick  : called when the button is clicked
//   boolean isFavourite     : true to show the button in its "saved" style
// RETURNS       :
//   JSX.Element : the <li> row
//
export function PostItem({ post, buttonLabel, onButtonClick, isFavourite }: PostItemProps) {
  const commentsUrl = `${REDDIT_BASE_URL}${post.permalink}`;

  return (
    <li className="post">
      <div className="score" title="Score">
        <span className="score-arrow" aria-hidden="true">
          ▲
        </span>
        <span className="score-value">{post.score.toLocaleString()}</span>
      </div>

      <div className="post-body">
        <p className="title">{post.title}</p>
        <p className="meta">
          <span className="sub-name">r/{post.subredditName}</span>
          <span aria-hidden="true"> · </span>
          <a
            href={commentsUrl}
            onClick={(event) => {
              event.preventDefault();
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

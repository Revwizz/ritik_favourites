/*
 * FILE          : api.ts (src/server/routes)
 * PROJECT       : Advanced Web Frameworks - Reddit Favourites
 * PROGRAMMER    : Ritik Vyas
 * FIRST VERSION : 2026-11-05
 * DESCRIPTION   :
 *   The server endpoints called by the React client. They run on Devvit's
 *   server and read post data from the Reddit API through Devvit's Reddit
 *   client. They only read from Reddit; nothing is stored on the server.
 *     GET /api/hot/:subreddit   - top hot posts of a subreddit
 *     GET /api/posts?ids=...    - current data for saved post IDs
 */

import { Hono } from 'hono';
import { reddit } from '@devvit/web/server';
import { HOT_POST_LIMIT, SUBREDDIT_NAME_PATTERN } from '../../shared/api';
import type {
  ErrorResponse,
  HotPostsResponse,
  PostsByIdResponse,
  PostSummary,
} from '../../shared/api';

// Reddit post IDs: "t3_" followed by a short base-36 ID
const POST_ID_PATTERN = /^t3_[a-z0-9]{1,12}$/;

// Most IDs looked up in a single request, to keep requests small
const MAX_IDS_PER_REQUEST = 100;

// HTTP status codes used below
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;

export const api = new Hono();

//
// FUNCTION      : isPostId
// DESCRIPTION   :
//   Checks that a string is a valid Reddit post ID, so only well-formed IDs
//   are sent to the Reddit API.
// PARAMETERS    :
//   string id : the value to check
// RETURNS       :
//   boolean : true if id is a valid post ID (TypeScript then treats it as `t3_${string}`)
//
function isPostId(id: string): id is `t3_${string}` {
  return POST_ID_PATTERN.test(id);
}

//
// FUNCTION      : toSummary
// DESCRIPTION   :
//   Copies only the fields the app displays out of Devvit's Post object, so
//   the client never receives the full post data.
// PARAMETERS    :
//   PostSummary post : a Devvit Post (or any object with these fields)
// RETURNS       :
//   PostSummary : a plain object with id, title, score, permalink,
//                 subredditName and numberOfComments
//
function toSummary(post: PostSummary): PostSummary {
  return {
    id: post.id,
    title: post.title,
    score: post.score,
    permalink: post.permalink,
    subredditName: post.subredditName,
    numberOfComments: post.numberOfComments,
  };
}

//
// ROUTE         : GET /api/hot/:subreddit
// DESCRIPTION   :
//   Returns the top HOT_POST_LIMIT posts of a subreddit, sorted by "hot".
//   Responds 400 for an invalid name and 404 if Reddit cannot load it.
// RETURNS       :
//   HotPostsResponse on success, ErrorResponse on failure
//
api.get('/hot/:subreddit', async (c) => {
  const subreddit = c.req.param('subreddit');

  if (!SUBREDDIT_NAME_PATTERN.test(subreddit)) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'That is not a valid subreddit name.' },
      HTTP_BAD_REQUEST
    );
  }

  try {
    const posts = await reddit
      .getHotPosts({ subredditName: subreddit, limit: HOT_POST_LIMIT, pageSize: HOT_POST_LIMIT })
      .get(HOT_POST_LIMIT);

    return c.json<HotPostsResponse>({
      type: 'hot',
      subreddit,
      posts: posts.map(toSummary),
    });
  } catch (error) {
    console.error(`Failed to load hot posts for r/${subreddit}:`, error);
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: `Could not load r/${subreddit}. Check the name and that the subreddit is public.`,
      },
      HTTP_NOT_FOUND
    );
  }
});

//
// ROUTE         : GET /api/posts?ids=t3_a,t3_b
// DESCRIPTION   :
//   Looks up the current data of saved favourite posts by ID. Invalid IDs
//   are ignored. Posts Reddit cannot find are listed in
//   missingIds instead of failing the whole request.
// RETURNS       :
//   PostsByIdResponse
//
api.get('/posts', async (c) => {
  const ids = (c.req.query('ids') ?? '')
    .split(',')
    .filter(isPostId)
    .slice(0, MAX_IDS_PER_REQUEST);

  // one deleted post should not break the whole list
  const results = await Promise.allSettled(ids.map((id) => reddit.getPostById(id)));

  const posts: PostSummary[] = [];
  const missingIds: string[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      posts.push(toSummary(result.value));
    } else {
      const id = ids[index];
      if (id) {
        missingIds.push(id);
      }
    }
  });

  return c.json<PostsByIdResponse>({ type: 'posts', posts, missingIds });
});

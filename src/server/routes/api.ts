import { Hono } from 'hono';
import { reddit } from '@devvit/web/server';
import type {
  ErrorResponse,
  HotPostsResponse,
  PostsByIdResponse,
  PostSummary,
} from '../../shared/api';

export const api = new Hono();

const SUBREDDIT_NAME = /^[A-Za-z0-9_]{2,21}$/;

// Post IDs look like "t3_1abc2de"
function isPostId(id: string): id is `t3_${string}` {
  return /^t3_[a-z0-9]{1,12}$/.test(id);
}

// Copy only the fields the app displays out of Devvit's Post object
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

// Requirement 1: top 10 "hot" posts of any subreddit
api.get('/hot/:subreddit', async (c) => {
  const subreddit = c.req.param('subreddit');

  if (!SUBREDDIT_NAME.test(subreddit)) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'That is not a valid subreddit name.' },
      400
    );
  }

  try {
    const posts = await reddit
      .getHotPosts({ subredditName: subreddit, limit: 10, pageSize: 10 })
      .get(10);

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
      404
    );
  }
});

// Requirement 3: look up posts from the saved IDs
api.get('/posts', async (c) => {
  const ids = (c.req.query('ids') ?? '').split(',').filter(isPostId).slice(0, 100);

  // allSettled: one deleted post should not break the whole list
  const results = await Promise.allSettled(ids.map((id) => reddit.getPostById(id)));

  const posts: PostSummary[] = [];
  const missingIds: string[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      posts.push(toSummary(result.value));
    } else {
      const id = ids[index];
      if (id) missingIds.push(id);
    }
  });

  return c.json<PostsByIdResponse>({ type: 'posts', posts, missingIds });
});

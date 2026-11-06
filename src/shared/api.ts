/*
 * FILE          : api.ts (src/shared)
 * PROJECT       : Advanced Web Frameworks - Reddit Favourites (Devvit)
 * PROGRAMMER    : Ritik Vyas
 * FIRST VERSION : 2026-11-05
 * DESCRIPTION   :
 *   Types and constants shared by the Devvit server (src/server) and the
 *   React client (src/client). Keeping them in one place means both sides
 *   agree on the shape of every API response.
 */

// Number of hot posts shown for a subreddit (Requirement 1)
export const HOT_POST_LIMIT = 10;

// Reddit subreddit names: 2-21 letters, numbers or underscores
export const SUBREDDIT_NAME_PATTERN = /^[A-Za-z0-9_]{2,21}$/;

// The only post data the client ever receives. It is shown on screen, never stored.
export type PostSummary = {
  id: string; // e.g. "t3_1abc2de"
  title: string;
  score: number;
  permalink: string; // e.g. "/r/reactjs/comments/1abc2de/some_title/"
  subredditName: string;
  numberOfComments: number;
};

// Response of GET /api/hot/:subreddit
export type HotPostsResponse = {
  type: 'hot';
  subreddit: string;
  posts: PostSummary[];
};

// Response of GET /api/posts?ids=t3_a,t3_b
export type PostsByIdResponse = {
  type: 'posts';
  posts: PostSummary[];
  missingIds: string[]; // IDs Reddit could not find (e.g. deleted posts)
};

// Response sent by any endpoint when something goes wrong
export type ErrorResponse = {
  status: 'error';
  message: string;
};

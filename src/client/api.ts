/*
 * FILE          : api.ts (src/client)
 * PROJECT       : Advanced Web Frameworks - Reddit Favourites
 * PROGRAMMER    : Ritik Vyas
 * FIRST VERSION : 2026-11-05
 * DESCRIPTION   :
 *   Functions the React client uses to get post data. A Devvit client cannot
 *   call Reddit directly, so these call the app's own /api endpoints, which
 *   run on Devvit's server and use the Reddit API.
 */

import type { HotPostsResponse, PostsByIdResponse, PostSummary } from '../shared/api';

//
// FUNCTION      : getJson
// DESCRIPTION   :
//   Sends a GET request to one of the app's /api endpoints and returns the
//   parsed JSON. Throws an Error with the server's message if it fails.
// PARAMETERS    :
//   string url : the endpoint to call, e.g. "/api/hot/reactjs"
// RETURNS       :
//   Promise<T> : the parsed response body
//
async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof body?.message === 'string' ? body.message : `Request failed (HTTP ${response.status}).`;
    throw new Error(message);
  }
  return body;
}

//
// FUNCTION      : fetchHotPosts
// DESCRIPTION   :
//   Gets the top hot posts of a subreddit.
// PARAMETERS    :
//   string subreddit : subreddit name without "r/", e.g. "reactjs"
// RETURNS       :
//   Promise<PostSummary[]> : the posts, in Reddit's hot order
//
export async function fetchHotPosts(subreddit: string): Promise<PostSummary[]> {
  const data = await getJson<HotPostsResponse>(`/api/hot/${encodeURIComponent(subreddit)}`);
  return data.posts;
}

//
// FUNCTION      : fetchPostsByIds
// DESCRIPTION   :
//   Gets the current data of the saved favourite posts.
// PARAMETERS    :
//   string[] ids : post IDs
// RETURNS       :
//   Promise<PostsByIdResponse> : the posts found, plus any missing IDs
//
export async function fetchPostsByIds(ids: string[]): Promise<PostsByIdResponse> {
  return getJson<PostsByIdResponse>(`/api/posts?ids=${encodeURIComponent(ids.join(','))}`);
}

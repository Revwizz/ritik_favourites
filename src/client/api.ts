// The client cannot call Reddit directly; it calls our own /api endpoints,
// which run on Devvit's server and use the Reddit API.
import type { HotPostsResponse, PostsByIdResponse, PostSummary } from '../shared/api';

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

// Requirement 1
export async function fetchHotPosts(subreddit: string): Promise<PostSummary[]> {
  const data = await getJson<HotPostsResponse>(`/api/hot/${encodeURIComponent(subreddit)}`);
  return data.posts;
}

// Requirement 3
export async function fetchPostsByIds(ids: string[]): Promise<PostsByIdResponse> {
  return getJson<PostsByIdResponse>(`/api/posts?ids=${encodeURIComponent(ids.join(','))}`);
}

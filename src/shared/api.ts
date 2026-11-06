// Types shared by the server (src/server) and the client (src/client)

// The only post data the client ever receives. It is shown on screen, never stored.
export type PostSummary = {
  id: string; // e.g. "t3_1abc2de"
  title: string;
  score: number;
  permalink: string; // e.g. "/r/reactjs/comments/1abc2de/some_title/"
  subredditName: string;
  numberOfComments: number;
};

// GET /api/hot/:subreddit
export type HotPostsResponse = {
  type: 'hot';
  subreddit: string;
  posts: PostSummary[];
};

// GET /api/posts?ids=t3_a,t3_b
export type PostsByIdResponse = {
  type: 'posts';
  posts: PostSummary[];
  missingIds: string[]; // IDs Reddit could not find (e.g. deleted posts)
};

export type ErrorResponse = {
  status: 'error';
  message: string;
};

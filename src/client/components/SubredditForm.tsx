import { useState } from 'react';
import type { FormEvent } from 'react';

type SubredditFormProps = {
  onSearch: (subreddit: string) => void;
};

export function SubredditForm({ onSearch }: SubredditFormProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the page from reloading

    // Accept "reactjs", "r/reactjs" or "/r/reactjs"
    const name = input.trim().replace(/^\/?r\//i, '');

    if (!/^[A-Za-z0-9_]{2,21}$/.test(name)) {
      setError('Enter a valid subreddit name, e.g. reactjs');
      return;
    }

    setError('');
    onSearch(name);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label htmlFor="subreddit">Subreddit</label>
      <div className="search-row">
        <span className="prefix">r/</span>
        <input
          id="subreddit"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="reactjs"
          autoComplete="off"
        />
        <button type="submit">Show posts</button>
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

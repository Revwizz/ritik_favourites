/*
 * FILE          : SubredditForm.tsx
 * PROJECT       : Advanced Web Frameworks - Reddit Favourites (Devvit)
 * PROGRAMMER    : Ritik Vyas
 * FIRST VERSION : 2026-11-05
 * DESCRIPTION   :
 *   The search form where the user types a subreddit name (Requirement 1).
 *   It accepts "reactjs", "r/reactjs" or "/r/reactjs" and rejects invalid
 *   names before anything is sent to the server.
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { SUBREDDIT_NAME_PATTERN } from '../../shared/api';

// Matches an optional leading "r/" or "/r/" so it can be removed
const SUBREDDIT_PREFIX_PATTERN = /^\/?r\//i;

type SubredditFormProps = {
  onSearch: (subreddit: string) => void;
};

//
// FUNCTION      : SubredditForm
// DESCRIPTION   :
//   React component with a text box and a "Show posts" button.
// PARAMETERS    :
//   function onSearch : called with the cleaned subreddit name on submit
// RETURNS       :
//   JSX.Element : the form
//
export function SubredditForm({ onSearch }: SubredditFormProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  //
  // FUNCTION      : handleSubmit
  // DESCRIPTION   :
  //   Cleans and validates the typed name, then passes it to onSearch or
  //   shows an error message.
  // PARAMETERS    :
  //   FormEvent event : the form submit event
  // RETURNS       :
  //   void
  //
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault(); // stop the page from reloading

    const name = input.trim().replace(SUBREDDIT_PREFIX_PATTERN, '');

    if (!SUBREDDIT_NAME_PATTERN.test(name)) {
      setError('Enter a valid subreddit name, e.g. reactjs');
      return;
    }

    setError('');
    onSearch(name);
  }

  return (
    <form className="search-card" onSubmit={handleSubmit}>
      <label htmlFor="subreddit">Subreddit</label>
      <div className="search-row">
        <div className="input-group">
          <span className="prefix">r/</span>
          <input
            id="subreddit"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="reactjs"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button type="submit" className="primary-btn">
          Show posts
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

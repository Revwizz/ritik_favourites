/*
 * FILE          : splash.tsx
 * PROJECT       : Advanced Web Frameworks - Reddit Favourites
 * PROGRAMMER    : Ritik Vyas
 * FIRST VERSION : 2026-11-05
 * DESCRIPTION   :
 *   Entry point of the small card shown inside the Reddit feed, loaded by
 *   splash.html. Its button opens the full app (the "game" entry point).
 */

import './index.css';

import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Name of the full-app entry point in devvit.json (post.entrypoints.game)
const FULL_APP_ENTRY = 'game';

//
// FUNCTION      : Splash
// DESCRIPTION   :
//   React component for the feed card: app name, a short description and
//   an "Open app" button.
// PARAMETERS    :
//   none
// RETURNS       :
//   JSX.Element : the feed card
//
export const Splash = () => {
  return (
    <div className="splash">
      <span className="logo logo-large" aria-hidden="true">
        ★
      </span>
      <h1>Reddit Favourites</h1>
      <p>Browse the top 10 hot posts of any subreddit and keep a list of your favourites.</p>
      <button
        type="button"
        className="primary-btn open-btn"
        onClick={(e) => requestExpandedMode(e.nativeEvent, FULL_APP_ENTRY)}
      >
        Open app
      </button>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);

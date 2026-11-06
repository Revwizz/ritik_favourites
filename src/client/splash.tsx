import './index.css';

import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// The small card shown in the Reddit feed. The button opens the full app (game.html).
export const Splash = () => {
  return (
    <div className="splash">
      <h1>Reddit Favourites</h1>
      <p>Browse the top 10 hot posts of any subreddit and keep a list of your favourites.</p>
      <button
        type="button"
        className="open-btn"
        onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
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

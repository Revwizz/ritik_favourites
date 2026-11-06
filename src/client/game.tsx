/*
 * FILE          : game.tsx
 * PROJECT       : Advanced Web Frameworks - Reddit Favourites (Devvit)
 * PROGRAMMER    : Ritik Vyas
 * FIRST VERSION : 2026-11-05
 * DESCRIPTION   :
 *   Entry point of the full-size (expanded) view, loaded by game.html.
 *   It renders the App component into the page.
 */

import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

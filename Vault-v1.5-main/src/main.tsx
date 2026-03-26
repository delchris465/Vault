import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GameProvider } from './context/GameContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </LanguageProvider>
  </StrictMode>,
);

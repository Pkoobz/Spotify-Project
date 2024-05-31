import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { ContextProvider } from "./context/ContextProvider";

const container = document.getElementById('root');
const root = createRoot(container!);
defineCustomElements(window);
root.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>
);
defineCustomElements(window);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ***********************************************
// 🛠️ KORREKTUR: Erzwingen der Root-Element-Existenz
// ***********************************************

const rootElement = document.getElementById('root');

if (!rootElement) {
  // Wenn 'root' nicht gefunden wird, Loggen wir einen Fehler, anstatt die App abstürzen zu lassen (gibt Debugging-Hinweis)
  console.error("Could not find root element to mount to!"); 
  // Wir erstellen es notfalls selbst, um die Anzeige zu erzwingen
  const body = document.querySelector('body');
  if (body) {
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    body.appendChild(newRoot);
    ReactDOM.createRoot(newRoot).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
} else {
  // Standard-Initialisierung, wenn 'root' existiert
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

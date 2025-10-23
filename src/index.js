import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: registration => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Новое содержимое доступно!', {
            body: 'Нажмите здесь, чтобы обновить страницу и получить последнюю версию.',
            icon: '/logo192.png', // Assuming you have a logo at public/logo192.png
            vibrate: [200, 100, 200]
          }).onclick = () => {
            window.location.reload();
          };
        } else {
          // Fallback to window.confirm if permission is not granted
          if (window.confirm('Новое содержимое доступно! Пожалуйста, обновите страницу, чтобы получить последнюю версию.')) {
            window.location.reload();
          }
        }
      });
    } else {
      // Fallback for browsers that don't support Notification API
      if (window.confirm('Новое содержимое доступно! Пожалуйста, обновите страницу, чтобы получить последнюю версию.')) {
        window.location.reload();
      }
    }
  }
});



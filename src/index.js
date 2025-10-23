import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { showNotification } from './utils/notificationManager';

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
    showNotification('Новое содержимое доступно!', {
      body: 'Нажмите здесь, чтобы обновить страницу и получить последнюю версию.',
      icon: '/logo192.png',
      vibrate: [200, 100, 200],
      onClickAction: 'reload'
    });
  }
});



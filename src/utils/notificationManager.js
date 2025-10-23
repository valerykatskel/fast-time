export const showNotification = (body, options = {}) => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification('Fast Time', { body, ...options }).onclick = () => {
      window.focus(); // Bring the app to foreground
      if (options.onClickAction === 'reload') {
        window.location.reload();
      }
    };
  } else if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Fast Time', { body, ...options }).onclick = () => {
          window.focus();
          if (options.onClickAction === 'reload') {
            window.location.reload();
          }
        };
      } else {
        console.warn('Notification permission denied.');
      }
    });
  } else {
    console.warn('Notification permission denied or blocked.');
  }
};
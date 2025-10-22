const SESSIONS_KEY = 'fastingSessions';

// Возвращает все сессии из localStorage
export const getSessions = () => {
  const sessions = localStorage.getItem(SESSIONS_KEY);
  return sessions ? JSON.parse(sessions) : [];
};

// Сохраняет одну сессию в localStorage
export const saveSession = (session) => {
  const sessions = getSessions();
  // Добавляем уникальный ID к новой сессии
  const newSession = { ...session, id: Date.now() };
  sessions.push(newSession);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

// Обновляет существующую сессию
export const updateSession = (sessionId, updatedSession) => {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  if (sessionIndex > -1) {
    sessions[sessionIndex] = { ...sessions[sessionIndex], ...updatedSession };
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }
};

// Удаляет сессию
export const deleteSession = (sessionId) => {
  let sessions = getSessions();
  sessions = sessions.filter(s => s.id !== sessionId);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};
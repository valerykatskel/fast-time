import React, { useState, useEffect, useCallback } from 'react';
import { Container, Modal, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import Timer from './components/Timer';
import History from './components/History';
import Charts from './components/Charts';
import CalendarComponent from './components/CalendarComponent';
import BottomNavBar from './components/BottomNavBar';
import { saveSession } from './utils/DataManager'; // Import saveSession
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './App.css';

const ACTIVE_FAST_KEY = 'activeFast';

// Helper to format datetime-local input
const toLocalISOString = (date) => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000; //смещение в миллисекундах
  const localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, -1);
  return localISOTime.substring(0, 16);
};

function App() {
  const [activeTab, setActiveTab] = useState('timer');
  const [hasActiveFast, setHasActiveFast] = useState(false);
  const [showCentralActionModal, setShowCentralActionModal] = useState(false);
  const [showManualAddModal, setShowManualAddModal] = useState(false);
  const [manualStart, setManualStart] = useState('');
  const [manualEnd, setManualEnd] = useState('');
  const [manualWeight, setManualWeight] = useState('');
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  // Check for active fast on load and when tabs change
  useEffect(() => {
    const activeFast = localStorage.getItem(ACTIVE_FAST_KEY);
    setHasActiveFast(!!activeFast);
  }, [activeTab, showManualAddModal]); // Re-check when manual add modal closes

  const handleCentralButtonClick = () => {
    const activeFast = localStorage.getItem(ACTIVE_FAST_KEY);
    if (activeFast) {
      // If active fast, open manual add modal
      setManualStart(toLocalISOString(Date.now())); // Pre-fill with current time
      setManualEnd(toLocalISOString(Date.now())); // Pre-fill with current time
      setShowManualAddModal(true);
    } else {
      // If no active fast, show choice modal
      setShowCentralActionModal(true);
    }
  };

  const handleCloseCentralActionModal = () => setShowCentralActionModal(false);
  const handleCloseManualAddModal = () => {
    setShowManualAddModal(false);
    setManualStart('');
    setManualEnd('');
    setManualWeight('');
  };

  const handleStartNewFast = () => {
    setActiveTab('timer');
    setShowCentralActionModal(false);
    // Timer component will handle starting the fast
  };

  const handleAddPastFast = () => {
    setShowCentralActionModal(false);
    setManualStart(toLocalISOString(Date.now())); // Pre-fill with current time
    setManualEnd(toLocalISOString(Date.now())); // Pre-fill with current time
    setShowManualAddModal(true);
  };

  const handleManualAddSave = useCallback(() => {
    if (manualStart && manualEnd && new Date(manualStart) < new Date(manualEnd)) {
      saveSession({
        start: new Date(manualStart).getTime(),
        end: new Date(manualEnd).getTime(),
        weight: manualWeight ? parseFloat(manualWeight) : undefined,
      });
      handleCloseManualAddModal();
      setActiveTab('history'); // Navigate to history to see the new entry
    } else {
      alert('Пожалуйста, убедитесь, что время начала раньше времени окончания.');
    }
  }, [manualStart, manualEnd, manualWeight]);

  useEffect(() => {
    serviceWorkerRegistration.register({
      onUpdate: registration => {
        setWaitingWorker(registration.waiting);
        setShowUpdateToast(true);
      }
    });
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      waitingWorker.addEventListener('statechange', event => {
        if (event.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  return (
    <div className="app-container">
      <ToastContainer position="top-center" className="p-3">
        <Toast show={showUpdateToast} onClose={() => setShowUpdateToast(false)}>
          <Toast.Header>
            <strong className="me-auto">Доступна новая версия</strong>
          </Toast.Header>
          <Toast.Body>
            <p>Обновить приложение до последней версии?</p>
            <Button variant="primary" onClick={handleUpdate}>Обновить</Button>
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Container className="my-4 container-mobile">
        <h1 className="text-center mb-4">Интервальное голодание</h1>
        
        {activeTab === 'timer' && (
          <div className="p-3">
            <Timer />
          </div>
        )}
        {activeTab === 'calendar' && (
          <div className="p-3">
            <CalendarComponent />
          </div>
        )}
        {activeTab === 'history' && (
          <div className="p-3">
            <History />
          </div>
        )}
        {activeTab === 'charts' && (
          <div className="p-3">
            <Charts />
          </div>
        )}
      </Container>
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} onCentralButtonClick={handleCentralButtonClick} />

      {/* Modal for Central Action Button (choice) */}
      <Modal show={showCentralActionModal} onHide={handleCloseCentralActionModal}>
        <Modal.Header closeButton>
          <Modal.Title>Действие</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Что вы хотите сделать?</p>
          <Button variant="primary" onClick={handleStartNewFast} className="w-100 mb-3">
            Начать новое голодание
          </Button>
          <Button variant="success" onClick={handleAddPastFast} className="w-100">
            Добавить прошедшее голодание
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCentralActionModal}>
            Отмена
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Manual Add Past Fast */}
      <Modal show={showManualAddModal} onHide={handleCloseManualAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить прошлый интервал</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Начало</Form.Label>
              <Form.Control type="datetime-local" value={manualStart} onChange={e => setManualStart(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Окончание</Form.Label>
              <Form.Control type="datetime-local" value={manualEnd} onChange={e => setManualEnd(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Вес (кг, необязательно)</Form.Label>
              <Form.Control type="number" step="0.1" value={manualWeight} onChange={e => setManualWeight(e.target.value)} placeholder="Например, 70.5" />
            </Form.Group>
            <Button variant="primary" onClick={handleManualAddSave} className="w-100">
              Сохранить интервал
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseManualAddModal}>
            Отмена
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
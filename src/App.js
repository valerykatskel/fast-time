import React, { useState, useEffect } from 'react';
import { Container, Modal, Button } from 'react-bootstrap';
import Timer from './components/Timer';
import History from './components/History';
import Charts from './components/Charts';
import CalendarComponent from './components/CalendarComponent'; // Import new CalendarComponent
import BottomNavBar from './components/BottomNavBar';
import './App.css'; // Import App.css

const ACTIVE_FAST_KEY = 'activeFast'; // Re-use from Timer.js

function App() {
  const [activeTab, setActiveTab] = useState('timer');
  const [hasActiveFast, setHasActiveFast] = useState(false);
  const [showCentralActionModal, setShowCentralActionModal] = useState(false);

  // Check for active fast on load and when tabs change
  useEffect(() => {
    const activeFast = localStorage.getItem(ACTIVE_FAST_KEY);
    setHasActiveFast(!!activeFast);
  }, [activeTab]);

  const handleCentralButtonClick = () => {
    const activeFast = localStorage.getItem(ACTIVE_FAST_KEY);
    if (activeFast) {
      // If active fast, directly open manual add modal (which is in History component)
      // For now, we'll just navigate to History and assume user will use the form there.
      // A better approach would be to lift the manual add modal state to App.js
      setActiveTab('history');
      // TODO: Ideally, open the manual add modal directly here.
    } else {
      // If no active fast, show choice modal
      setShowCentralActionModal(true);
    }
  };

  const handleCloseCentralActionModal = () => setShowCentralActionModal(false);

  const handleStartNewFast = () => {
    setActiveTab('timer');
    setShowCentralActionModal(false);
    // Timer component will handle starting the fast
  };

  const handleAddPastFast = () => {
    setActiveTab('history');
    setShowCentralActionModal(false);
    // History component will show the manual add form
  };

  return (
    <div className="app-container">
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

      {/* Modal for Central Action Button */}
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
    </div>
  );
}

export default App;

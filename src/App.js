import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Timer from './components/Timer';
import History from './components/History';
import Charts from './components/Charts'; // Import the new Charts component
import BottomNavBar from './components/BottomNavBar';

function App() {
  const [activeTab, setActiveTab] = useState('timer');

  const handleCentralButtonClick = () => {
    // Действие для центральной кнопки, например, быстрое добавление записи
    alert('Центральная кнопка нажата!');
  };

  return (
    <div className="app-container">
      <Container className="my-4 container-mobile">
        <h1 className="text-center mb-4">Интервальное голодание</h1>
        
        {activeTab === 'timer' && (
          <div className="p-3 border border-top-0">
            <Timer />
          </div>
        )}
        {activeTab === 'history' && (
          <div className="p-3 border border-top-0">
            <History />
          </div>
        )}
        {activeTab === 'charts' && (
          <div className="p-3 border border-top-0">
            <Charts />
          </div>
        )}
      </Container>
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} onCentralButtonClick={handleCentralButtonClick} />
    </div>
  );
}

export default App;
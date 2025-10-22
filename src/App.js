import React from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import Timer from './components/Timer';
import History from './components/History';

function App() {
  return (
    <Container className="my-4 container-mobile">
      <h1 className="text-center mb-4">Интервальное голодание</h1>
      <Tabs defaultActiveKey="timer" id="main-tabs" className="mb-3" fill>
        <Tab eventKey="timer" title="Таймер">
          <div className="p-3 border border-top-0">
            <Timer />
          </div>
        </Tab>
        <Tab eventKey="history" title="История и График">
          <div className="p-3 border border-top-0">
            <History />
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default App;
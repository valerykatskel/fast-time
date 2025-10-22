import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Row, Col, Form } from 'react-bootstrap';
import { saveSession } from '../utils/DataManager';

import CircularTimer from './CircularTimer';

const ACTIVE_FAST_KEY = 'activeFast';

const Timer = () => {
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [manualStartTime, setManualStartTime] = useState('');

  // При загрузке компонента, проверяем есть ли активный таймер в localStorage
  useEffect(() => {
    const activeFast = localStorage.getItem(ACTIVE_FAST_KEY);
    if (activeFast) {
      const { startTime: savedStartTime } = JSON.parse(activeFast);
      setStartTime(savedStartTime);
      setIsActive(true);
    }
  }, []);

  // Эффект для обновления таймера каждую секунду
  useEffect(() => {
    let interval = null;
    if (isActive && startTime) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const handleStart = () => {
    const start = manualStartTime ? new Date(manualStartTime).getTime() : Date.now();
    setStartTime(start);
    setIsActive(true);
    localStorage.setItem(ACTIVE_FAST_KEY, JSON.stringify({ startTime: start }));
    setManualStartTime('');
  };

  const handleStop = useCallback(() => {
    if (startTime) {
      saveSession({ start: startTime, end: Date.now() });
    }
    localStorage.removeItem(ACTIVE_FAST_KEY);
    setIsActive(false);
    setElapsed(0);
    setStartTime(null);
  }, [startTime]);

  const handleReset = () => {
    localStorage.removeItem(ACTIVE_FAST_KEY);
    setIsActive(false);
    setElapsed(0);
    setStartTime(null);
    setManualStartTime('');
  };

  return (
    <Card>
      <Card.Body className="text-center">
        <Card.Title>Таймер голодания</Card.Title>
        <div className="my-4 d-flex justify-content-center">
          <CircularTimer elapsed={elapsed} startTime={startTime} />
        </div>

        {!isActive && (
          <Form.Group className="mb-3">
            <Form.Label>Или укажите точное время начала:</Form.Label>
            <Form.Control
              type="datetime-local"
              value={manualStartTime}
              onChange={(e) => setManualStartTime(e.target.value)}
            />
          </Form.Group>
        )}

        <Row>
          <Col>
            {!isActive ? (
              <Button variant="success" size="lg" onClick={handleStart} className="w-100">
                Начать
              </Button>
            ) : (
              <Button variant="danger" size="lg" onClick={handleStop} className="w-100">
                Завершить
              </Button>
            )}
          </Col>
          <Col>
            <Button variant="secondary" size="lg" onClick={handleReset} className="w-100" disabled={!elapsed && !isActive}>
              Сбросить
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Timer;
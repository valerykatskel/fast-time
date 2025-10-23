import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Row, Col, Form, Modal } from 'react-bootstrap';
import { saveSession } from '../utils/DataManager';

import CircularTimer from './CircularTimer';

const ACTIVE_FAST_KEY = 'activeFast';

// Helper to format datetime-local input
const toLocalISOString = (date) => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000; //смещение в миллисекундах
  const localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, -1);
  return localISOTime.substring(0, 16);
};

const Timer = () => {
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [manualStartTime, setManualStartTime] = useState('');

  const [showEndModal, setShowEndModal] = useState(false);
  const [manualEndTime, setManualEndTime] = useState('');
  const [currentWeight, setCurrentWeight] = useState(''); // New state for weight
  const [currentWater, setCurrentWater] = useState(''); // New state for water

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

  const handleStopNow = useCallback(() => {
    if (startTime) {
      saveSession({
        start: startTime,
        end: Date.now(),
        weight: currentWeight ? parseFloat(currentWeight) : undefined,
        water: currentWater ? parseFloat(currentWater) : undefined, // Add water intake
      });
    }
    localStorage.removeItem(ACTIVE_FAST_KEY);
    setIsActive(false);
    setElapsed(0);
    setStartTime(null);
    setCurrentWeight(''); // Reset weight
    setCurrentWater(''); // Reset water
    setShowEndModal(false);
  }, [startTime, currentWeight, currentWater]); // Add currentWater to dependency array

  const handleStopAtTime = useCallback(() => {
    if (manualEndTime && startTime && new Date(manualEndTime).getTime() > startTime) {
      saveSession({
        start: startTime,
        end: new Date(manualEndTime).getTime(),
        weight: currentWeight ? parseFloat(currentWeight) : undefined,
        water: currentWater ? parseFloat(currentWater) : undefined, // Add water intake
      });
      localStorage.removeItem(ACTIVE_FAST_KEY);
      setIsActive(false);
      setElapsed(0);
      setStartTime(null);
      setManualEndTime('');
      setCurrentWeight(''); // Reset weight
      setCurrentWater(''); // Reset water
      setShowEndModal(false);
    } else {
      alert('Пожалуйста, укажите корректное время окончания, которое позже времени начала.');
    }
  }, [startTime, manualEndTime, currentWeight, currentWater]); // Add currentWater to dependency array

  const handleReset = () => {
    localStorage.removeItem(ACTIVE_FAST_KEY);
    setIsActive(false);
    setElapsed(0);
    setStartTime(null);
    setManualStartTime('');
    setCurrentWeight(''); // Reset weight
    setShowEndModal(false);
  };

  const handleShowEndModal = () => {
    setManualEndTime(toLocalISOString(Date.now())); // Предзаполняем текущим временем
    setShowEndModal(true);
  };

  const handleCloseEndModal = () => {
    setShowEndModal(false);
    setManualEndTime('');
    setCurrentWeight(''); // Reset weight
    setCurrentWater(''); // Reset water
  };

  return (
    <Card>
      <Card.Body className="text-center">
        <Card.Title>Таймер голодания</Card.Title>
        <div className="my-4 d-flex justify-content-center">
          <CircularTimer size={120} elapsed={elapsed} startTime={startTime} />
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
              <Button variant="danger" size="lg" onClick={handleShowEndModal} className="w-100">
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

      {/* Модальное окно для завершения голодания */}
      <Modal show={showEndModal} onHide={handleCloseEndModal}>
        <Modal.Header closeButton>
          <Modal.Title>Завершить голодание</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Как вы хотите завершить текущее голодание?</p>
          <Form.Group className="mb-3">
            <Form.Label>Ваш вес (кг, необязательно):</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="Например, 70.5"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Вода (литры, необязательно):</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={currentWater}
              onChange={(e) => setCurrentWater(e.target.value)}
              placeholder="Например, 1.5"
            />
          </Form.Group>
          <Button variant="primary" onClick={handleStopNow} className="w-100 mb-3">
            Завершить сейчас
          </Button>
          <hr />
          <Form.Group className="mb-3">
            <Form.Label>Или укажите точное время окончания:</Form.Label>
            <Form.Control
              type="datetime-local"
              value={manualEndTime}
              onChange={(e) => setManualEndTime(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" onClick={handleStopAtTime} className="w-100">
            Сохранить указанное время
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEndModal}>
            Отмена
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default Timer;
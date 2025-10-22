import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Button, ListGroup, Modal, Row, Col } from 'react-bootstrap';
import { getSessions, saveSession, updateSession, deleteSession } from '../utils/DataManager';

// Helper to format datetime-local input
const toLocalISOString = (date) => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000; //смещение в миллисекундах
  const localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, -1);
  return localISOTime.substring(0, 16);
};

const History = () => {
  const [sessions, setSessions] = useState([]);
  
  // State for manual add form
  const [manualStart, setManualStart] = useState('');
  const [manualEnd, setManualEnd] = useState('');

  // State for edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editWeight, setEditWeight] = useState(''); // New state for editing weight


  const loadAndProcessData = useCallback(() => {
    const allSessions = getSessions().sort((a, b) => b.start - a.start); // Сортируем по убыванию
    setSessions(allSessions);
  }, []);

  useEffect(() => {
    loadAndProcessData();
  }, [loadAndProcessData]);

  const handleManualSave = () => {
    if (manualStart && manualEnd && new Date(manualStart) < new Date(manualEnd)) {
      saveSession({
        start: new Date(manualStart).getTime(),
        end: new Date(manualEnd).getTime(),
      });
      setManualStart('');
      setManualEnd('');
      loadAndProcessData();
    } else {
      alert('Пожалуйста, убедитесь, что время начала раньше времени окончания.');
    }
  };

  const handleDelete = (sessionId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      deleteSession(sessionId);
      loadAndProcessData();
    }
  };

  const handleShowModal = (session) => {
    setEditingSession(session);
    setEditStart(toLocalISOString(session.start));
    setEditEnd(toLocalISOString(session.end));
    setEditWeight(session.weight ? session.weight.toString() : ''); // Pre-fill weight
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSession(null);
    setEditWeight(''); // Clear weight on close
  };

  const handleUpdate = () => {
    if (editStart && editEnd && new Date(editStart) < new Date(editEnd)) {
      updateSession(editingSession.id, {
        start: new Date(editStart).getTime(),
        end: new Date(editEnd).getTime(),
        weight: editWeight ? parseFloat(editWeight) : undefined, // Pass edited weight
      });
      handleCloseModal();
      loadAndProcessData();
    } else {
      alert('Пожалуйста, убедитесь, что время начала раньше времени окончания.');
    }
  };

  const formatSessionDate = (timestamp) => new Date(timestamp).toLocaleString();
  const formatDuration = (start, end) => {
      const durationMillis = end - start;
      const hours = Math.floor(durationMillis / (1000 * 60 * 60));
      const minutes = Math.floor((durationMillis % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours} ч. ${minutes} мин.`;
  }

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title className="text-center">Добавить прошлый интервал</Card.Title>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Начало</Form.Label>
              <Form.Control type="datetime-local" value={manualStart} onChange={e => setManualStart(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Окончание</Form.Label>
              <Form.Control type="datetime-local" value={manualEnd} onChange={e => setManualEnd(e.target.value)} />
            </Form.Group>
            <Button variant="primary" onClick={handleManualSave} className="w-100">
              Сохранить интервал
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Body>
          <Card.Title className="text-center">Список интервалов</Card.Title>
          <ListGroup variant="flush">
            {sessions.map(session => (
              <ListGroup.Item key={session.id}>
                <Row className="align-items-center">
                  <Col>
                    <div><strong>Начало:</strong> {formatSessionDate(session.start)}</div>
                    <div><strong>Конец:</strong> {formatSessionDate(session.end)}</div>
                    <div><strong>Длительность:</strong> {formatDuration(session.start, session.end)}</div>
                    {session.weight && <div><strong>Вес:</strong> {session.weight} кг</div>}
                  </Col>
                  <Col xs="auto">
                    <Button variant="outline-primary" size="sm" onClick={() => handleShowModal(session)}>
                      Изм.
                    </Button>
                    <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => handleDelete(session.id)}>
                      Удл.
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      {editingSession && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Редактировать интервал</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Начало</Form.Label>
              <Form.Control type="datetime-local" value={editStart} onChange={e => setEditStart(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Окончание</Form.Label>
              <Form.Control type="datetime-local" value={editEnd} onChange={e => setEditEnd(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Вес (кг, необязательно)</Form.Label>
              <Form.Control type="number" step="0.1" value={editWeight} onChange={e => setEditWeight(e.target.value)} placeholder="Например, 70.5" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Отмена
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Сохранить изменения
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default History;

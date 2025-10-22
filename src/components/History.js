import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Button, ListGroup, Modal, Row, Col } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getSessions, saveSession, updateSession, deleteSession } from '../utils/DataManager';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Helper to format datetime-local input
const toLocalISOString = (date) => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000; //смещение в миллисекундах
  const localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, -1);
  return localISOTime.substring(0, 16);
};

const History = () => {
  const [sessions, setSessions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [date, setDate] = useState(new Date());
  
  // State for manual add form
  const [manualStart, setManualStart] = useState('');
  const [manualEnd, setManualEnd] = useState('');

  // State for edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');


  const loadAndProcessData = useCallback(() => {
    const allSessions = getSessions().sort((a, b) => b.start - a.start); // Сортируем по убыванию
    setSessions(allSessions);

    const data = allSessions.reduce((acc, session) => {
      const dateKey = new Date(session.start).toLocaleDateString();
      const durationHours = (session.end - session.start) / (1000 * 60 * 60);
      
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, hours: 0 };
      }
      acc[dateKey].hours += durationHours;
      
      return acc;
    }, {});

    const formattedData = Object.values(data).map(d => ({...d, hours: parseFloat(d.hours.toFixed(1))})).sort((a, b) => new Date(a.date.split('.').reverse().join('-')) - new Date(b.date.split('.').reverse().join('-')));
    setChartData(formattedData);
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
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSession(null);
  };

  const handleUpdate = () => {
    if (editStart && editEnd && new Date(editStart) < new Date(editEnd)) {
      updateSession(editingSession.id, {
        start: new Date(editStart).getTime(),
        end: new Date(editEnd).getTime(),
      });
      handleCloseModal();
      loadAndProcessData();
    } else {
      alert('Пожалуйста, убедитесь, что время начала раньше времени окончания.');
    }
  };

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayStr = date.toLocaleDateString();
      const dayData = chartData.find(d => d.date === dayStr);

      if (dayData) {
        return <p className="text-center small m-0" style={{color: 'green'}}>{dayData.hours} ч</p>;
      }
    }
    return null;
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
          <Card.Title className="text-center">История голоданий</Card.Title>
          
          <div className="d-flex justify-content-center my-4">
            <Calendar
              onChange={setDate}
              value={date}
              tileContent={getTileContent}
            />
          </div>
          
          <hr />
          
          <div className="my-4">
            <h5 className="text-center">График прогресса (часы)</h5>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke="#8884d8" name="Часы голодания" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center">Нет данных для отображения графика.</p>
            )}
          </div>
        </Card.Body>
      </Card>

      <Card className="mt-4">
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
            <Form.Group>
              <Form.Label>Окончание</Form.Label>
              <Form.Control type="datetime-local" value={editEnd} onChange={e => setEditEnd(e.target.value)} />
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

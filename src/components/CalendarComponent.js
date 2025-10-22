import React, { useState, useEffect, useCallback } from 'react';
import { Card } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getSessions } from '../utils/DataManager';

const CalendarComponent = () => {
  const [sessions, setSessions] = useState([]);
  const [fastingHoursPerDay, setFastingHoursPerDay] = useState({}); // Для календаря
  const [date, setDate] = useState(new Date());

  const loadFastingData = useCallback(() => {
    const allSessions = getSessions();

    // Process fasting hours data for calendar
    const fastingData = allSessions.reduce((acc, session) => {
      const dateKey = new Date(session.start).toLocaleDateString();
      const durationHours = (session.end - session.start) / (1000 * 60 * 60);
      
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, hours: 0 };
      }
      acc[dateKey].hours += durationHours;
      
      return acc;
    }, {});
    setFastingHoursPerDay(fastingData);

  }, []);

  useEffect(() => {
    loadFastingData();
  }, [loadFastingData]);

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayStr = date.toLocaleDateString();
      const dayData = fastingHoursPerDay[dayStr];

      if (dayData) {
        return <p className="text-center small m-0" style={{color: 'green'}}>{dayData.hours.toFixed(1)} ч</p>;
      }
    }
    return null;
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title className="text-center">Календарь голоданий</Card.Title>
        
        <div className="d-flex justify-content-center my-4">
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={getTileContent}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default CalendarComponent;

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from 'react-bootstrap';
import { getSessions } from '../utils/DataManager';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const Charts = () => {
  const [chartData, setChartData] = useState([]);
  const [weightChartData, setWeightChartData] = useState([]);
  const [minWeight, setMinWeight] = useState(0);
  const [maxWeight, setMaxWeight] = useState(0);
  const [minHours, setMinHours] = useState(0);
  const [maxHours, setMaxHours] = useState(0);

  const loadAndProcessChartData = useCallback(() => {
    const allSessions = getSessions().sort((a, b) => b.start - a.start); // Сортируем по убыванию

    // Process fasting hours data
    const fastingData = allSessions.reduce((acc, session) => {
      const dateKey = new Date(session.start).toLocaleDateString();
      const durationHours = (session.end - session.start) / (1000 * 60 * 60);
      
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, hours: 0 };
      }
      acc[dateKey].hours += durationHours;
      
      return acc;
    }, {});

    const formattedFastingData = Object.values(fastingData).map(d => ({...d, hours: parseFloat(d.hours.toFixed(1))})).sort((a, b) => new Date(a.date.split('.').reverse().join('-')) - new Date(b.date.split('.').reverse().join('-')));
    setChartData(formattedFastingData);

    // Calculate min and max hours for dynamic Y-axis
    if (formattedFastingData.length > 0) {
      const hours = formattedFastingData.map(d => d.hours);
      if (hours.length === 1) {
        setMinHours(0);
        setMaxHours(hours[0]);
      } else {
        setMinHours(Math.min(...hours));
        setMaxHours(Math.max(...hours));
      }
    } else {
      setMinHours(0);
      setMaxHours(0);
    }

    // Process weight data
    const weightData = {};
    allSessions.forEach(session => {
      if (session.weight) {
        const dateKey = new Date(session.end).toLocaleDateString(); // Use end date for weight
        weightData[dateKey] = { date: dateKey, weight: session.weight }; // Take the last recorded weight for the day
      }
    });

    const formattedWeightData = Object.values(weightData).map(d => ({...d, weight: parseFloat(d.weight.toFixed(1))})).sort((a, b) => new Date(a.date.split('.').reverse().join('-')) - new Date(b.date.split('.').reverse().join('-')));
    setWeightChartData(formattedWeightData);

    // Calculate min and max weight for dynamic Y-axis
    if (formattedWeightData.length > 0) {
      const weights = formattedWeightData.map(d => d.weight);
      if (weights.length === 1) {
        setMinWeight(0);
        setMaxWeight(weights[0]);
      } else {
        setMinWeight(Math.min(...weights));
        setMaxWeight(Math.max(...weights));
      }
    } else {
      setMinWeight(0);
      setMaxWeight(0);
    }

  }, []);

  useEffect(() => {
    loadAndProcessChartData();
  }, [loadAndProcessChartData]);

  return (
    <Card>
      <Card.Body>
        <Card.Title className="text-center">Графики</Card.Title>
        
        <div className="my-4">
          <h5 className="text-center">График прогресса (часы)</h5>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" padding={{ interval: 0 }} />
                <YAxis domain={[minHours, maxHours]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hours" stroke="#8884d8" name="Часы голодания" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center">Нет данных для отображения графика.</p>
          )}
        </div>



        <hr />

        <div className="my-4">
          <h5 className="text-center">Динамика веса (кг)</h5>
          {weightChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" padding={{ interval: 0 }} />
                <YAxis domain={[minWeight, maxWeight]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#ff7300" name="Вес" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center">Нет данных для отображения динамики веса.</p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Charts;

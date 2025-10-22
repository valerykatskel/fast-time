import React from 'react';

const CircularTimer = ({ elapsed, startTime }) => {
  const radius = 85;
  const stroke = 15;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Сколько прошло времени в процентах от 24 часов
  const elapsedPercent = elapsed / (24 * 3600 * 1000);
  const strokeDashoffset = circumference - elapsedPercent * circumference;

  // Угол поворота, чтобы начать с правильного времени
  let startAngle = 0;
  if (startTime) {
    const startDate = new Date(startTime);
    const startHours = startDate.getHours();
    const startMinutes = startDate.getMinutes();
    // 360 градусов / 24 часа = 15 градусов в час. Сдвиг на -90, чтобы 0 был наверху.
    startAngle = (startHours / 24) * 360 + (startMinutes / (24 * 60)) * 360 - 90;
  }

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
    >
      {/* Фоновое кольцо */}
      <circle
        stroke="#e6e6e6"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      {/* Кольцо прогресса */}
      <circle
        stroke="#8884d8"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, strokeLinecap: 'round' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(${startAngle} ${radius} ${radius})`}
      />
      {/* Текст в центре */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="20"
        fontWeight="bold"
      >
        {new Date(elapsed).toISOString().substr(11, 8)}
      </text>
    </svg>
  );
};

export default CircularTimer;

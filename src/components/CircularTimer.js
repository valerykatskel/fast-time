import React from 'react';

const CircularTimer = ({ elapsed, startTime }) => {
  const radius = 85;
  const stroke = 15;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const colors = [
    'rgba(136, 132, 216, 0.65)', // #8884d8
    'rgba(130, 202, 157, 0.65)', // #82ca9d
    'rgba(255, 198, 88, 0.65)',  // #ffc658
    'rgba(255, 115, 0, 0.65)',   // #ff7300
    'rgba(0, 196, 159, 0.65)',   // #00c49f
    'rgba(208, 237, 87, 0.65)'    // #d0ed57
  ]; // Добавьте больше цветов по желанию

  // Расчет общего времени для текстового отображения
  const totalSeconds = Math.floor(elapsed / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');

  // Визуальный прогресс ограничен 24 часами, цвет меняется в зависимости от количества дней
  const currentDayElapsed = elapsed % (24 * 3600 * 1000);
  const elapsedPercent = currentDayElapsed / (24 * 3600 * 1000);
  const strokeDashoffset = circumference - elapsedPercent * circumference;

  // Выбираем цвет на основе количества прошедших дней
  const currentColor = colors[days % colors.length];

  // Угол поворота, чтобы начать с правильного времени
  // startAngle = (startHours / 24) * 360 + (startMinutes / (24 * 60)) * 360 - 90;

  const timeString = `${hours}:${minutes}:${seconds}`;

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

      {/* Часовые метки */}
      {[...Array(24)].map((_, i) => {
        const angleRad = (i / 24) * 2 * Math.PI - Math.PI / 2; // Угол в радианах, начиная с 12 часов
        const isMajor = i % 6 === 0; // Каждые 6 часов - более крупная метка
        const markerStrokeWidth = isMajor ? 2 : 1;

        const innerEdgeOfStroke = normalizedRadius - stroke / 2;
        const outerEdgeOfStroke = normalizedRadius + stroke / 2;

        const x1 = radius + innerEdgeOfStroke * Math.cos(angleRad);
        const y1 = radius + innerEdgeOfStroke * Math.sin(angleRad);
        const x2 = radius + outerEdgeOfStroke * Math.cos(angleRad);
        const y2 = radius + outerEdgeOfStroke * Math.sin(angleRad);

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#ccc"
            strokeWidth={markerStrokeWidth}
          />
        );
      })}

      {/* Кольцо прогресса */}
      <circle
        stroke={currentColor}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, strokeLinecap: 'butt' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
      {/* Текст в центре */}
      <text
        x="50%"
        y={days > 0 ? '45%' : '50%'}
        textAnchor="middle"
        dy=".3em"
        fontSize="20"
        fontWeight="bold"
      >
        {timeString}
      </text>
      {days > 0 && (
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          dy=".3em"
          fontSize="14"
        >
          {`${days} ${days > 1 && days < 5 ? 'дня' : 'дней'}`}
        </text>
      )}
    </svg>
  );
};

export default CircularTimer;

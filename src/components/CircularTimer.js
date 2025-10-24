import React from 'react';

const WrappedText = ({ text, x, y, width, lineHeight, ...props }) => {
  if (!text) return null;

  const words = text.split(' ');
  let line = '';
  const lines = [];

  words.forEach(word => {
    const testLine = line + word + ' ';
    // This is a rough approximation of width, a better way would be to measure the text
    if (testLine.length > width / 6) { // Assuming average char width of 6
      lines.push(line);
      line = word + ' ';
    } else {
      line = testLine;
    }
  });
  lines.push(line);

  return (
    <text x={x} y={y} {...props}>
      {lines.map((line, index) => (
        <tspan key={index} x={x} dy={index === 0 ? 0 : lineHeight}>
          {line.trim()}
        </tspan>
      ))}
    </text>
  );
};

const CircularTimer = ({ elapsed, startTime, size = 85, fastingStageMessage, nextStageCountdown, nextStageMessage }) => {
  const radius = size;
  const stroke = size / 6; // Adjust stroke proportionally
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const colors = [
    'rgba(76, 175, 80, 0.65)',  // #4CAF50 - Accent (Fasting Active)
    'rgba(255, 152, 0, 0.65)',   // #FF9800 - Accent (Eating Allowed)
    'rgba(136, 132, 216, 0.65)', // Original #8884d8
    'rgba(130, 202, 157, 0.65)', // Original #82ca9d
    'rgba(255, 198, 88, 0.65)',  // Original #ffc658
    'rgba(255, 115, 0, 0.65)',   // Original #ff7300
    'rgba(0, 196, 159, 0.65)',   // Original #00c49f
    'rgba(208, 237, 87, 0.65)'    // Original #d0ed57
  ]; // Добавьте больше цветов по желанию

  // Расчет общего времени для текстового отображения
  const totalSeconds = Math.floor(elapsed / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');

  // Расчет времени до следующей фазы
  const nextCountdownHours = Math.floor(nextStageCountdown / (1000 * 60 * 60));
  const nextCountdownMinutes = Math.floor((nextStageCountdown % (1000 * 60 * 60)) / (1000 * 60));
  const nextCountdownSeconds = Math.floor((nextStageCountdown % (1000 * 60)) / 1000);

  const nextCountdownString = nextStageCountdown > 0 
    ? `${nextCountdownHours} ч. ${nextCountdownMinutes} мин. ${nextCountdownSeconds} сек.`
    : '';

  // Визуальный прогресс ограничен 24 часами, цвет меняется в зависимости от количества дней
  const currentDayElapsed = elapsed % (24 * 3600 * 1000);
  const elapsedPercent = currentDayElapsed / (24 * 3600 * 1000);
  const strokeDashoffset = circumference - elapsedPercent * circumference;

  // Выбираем цвет на основе количества прошедших дней
  const currentColor = colors[days % colors.length];

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
        const angleRad = (i / 24) * 2 * Math.PI - Math.PI / 2;
        const isMajor = i % 6 === 0;
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
      
      {/* Текущая фаза */}
      {fastingStageMessage && (
        <text
          x="50%"
          y="20%"
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-secondary-text)"
        >
          Текущая фаза:
        </text>
      )}
      <WrappedText
        text={fastingStageMessage}
        x="50%"
        y="28%"
        width={normalizedRadius * 1.5} // Max width for text
        lineHeight="1.2em"
        textAnchor="middle"
        fontSize="10"
        fill="var(--color-primary-text)"
      />

      <text
        x="50%"
        y={days > 0 ? '50%' : '45%'}
        textAnchor="middle"
        dy=".3em"
        fontSize="20"
        fontWeight="bold"
        fill="var(--color-primary-text)"
      >
        {timeString}
      </text>
      {days > 0 && (
        <text
          x="50%"
          y="65%"
          textAnchor="middle"
          dy=".3em"
          fontSize="14"
          fill="var(--color-secondary-text)"
        >
          {`${days} ${days > 1 && days < 5 ? 'дня' : 'дней'}`}
        </text>
      )}

      {/* Следующая фаза */}
      {nextStageCountdown > 0 && (
        <text
          x="50%"
          y="64%"
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-secondary-text)"
        >
          Следующая фаза:
        </text>
      )}
      {nextStageCountdown > 0 && (
        <WrappedText
          text={`${nextStageMessage} через ${nextCountdownString}`}
          x="50%"
          y="72%"
          width={normalizedRadius * 1.5}
          lineHeight="1.2em"
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-primary-text)"
        />
      )}
    </svg>
  );
};

export default CircularTimer;

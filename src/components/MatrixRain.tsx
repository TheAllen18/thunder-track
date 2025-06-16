
import React, { useEffect, useRef } from 'react';

const MatrixRain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = '01';
    const columns = Math.floor(window.innerWidth / 20);

    const createMatrixChar = (column: number) => {
      const char = document.createElement('div');
      char.className = 'matrix-char';
      char.textContent = chars[Math.floor(Math.random() * chars.length)];
      
      const startY = -20;
      const endY = window.innerHeight + 20;
      const duration = Math.random() * 8 + 12;
      
      char.style.left = `${column * 20}px`;
      char.style.top = `${startY}px`;
      char.style.animationDuration = `${duration}s`;
      char.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(char);
      
      setTimeout(() => {
        if (char.parentNode) {
          char.parentNode.removeChild(char);
        }
      }, duration * 1000);
    };

    const intervals: NodeJS.Timeout[] = [];
    
    for (let i = 0; i < columns; i++) {
      const interval = setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance per interval
          createMatrixChar(i);
        }
      }, 1000);
      intervals.push(interval);
    }

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, []);

  return <div ref={containerRef} className="matrix-rain" />;
};

export default MatrixRain;

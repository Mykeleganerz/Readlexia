import { useState, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

export function ReadingRuler() {
  const { settings } = useAccessibility();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!settings.readingRulerEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [settings.readingRulerEnabled]);

  if (!settings.readingRulerEnabled || !isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-100"
      style={{
        top: position.y - settings.rulerHeight / 2,
        left: 0,
        width: '100%',
        height: settings.rulerHeight,
        backgroundColor: settings.rulerColor,
        borderTop: '2px solid rgba(100, 150, 255, 0.4)',
        borderBottom: '2px solid rgba(100, 150, 255, 0.4)',
      }}
    />
  );
}

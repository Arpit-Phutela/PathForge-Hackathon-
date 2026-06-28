import React, { useRef, useState, useEffect } from 'react';

interface HoverTiltProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxRotate?: number; // Maximum rotation in degrees
  scale?: number; // Optional slight scale on hover
}

export const HoverTilt: React.FC<HoverTiltProps> = ({
  children,
  maxRotate = 2.5,
  scale = 1.015,
  className = '',
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for prefers-reduced-motion to maintain standard compliance
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Position of cursor relative to element center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Normalize coordinates from -1 to 1
    const x = mouseX / (width / 2);
    const y = mouseY / (height / 2);

    setCoords({ x, y });
  };

  const handleMouseEnter = () => {
    if (reducedMotion) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  // Compute 3D rotation based on mouse coordinates
  const rotateY = coords.x * maxRotate; // Rotates around Y axis (horizontal mouse movement)
  const rotateX = -coords.y * maxRotate; // Rotates around X axis (vertical mouse movement)

  // Compute shine gradient center position (normalized from coords -1 to 1 into 0% to 100%)
  const shineX = (coords.x + 1) * 50;
  const shineY = (coords.y + 1) * 50;

  const style: React.CSSProperties = {
    transformStyle: 'preserve-3d',
    transform: isHovered 
      ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    transition: isHovered 
      ? 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)' 
      : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform',
    ...props.style
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${className} cursor-pointer relative overflow-hidden`}
      style={style}
      {...props}
    >
      {children}

      {/* Exquisite glossy reflection/shine overlay */}
      {!reducedMotion && isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-[inherit] mix-blend-overlay z-30"
          style={{
            background: `radial-gradient(circle 180px at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.03) 45%, transparent 85%)`,
            transition: 'background 0.05s ease-out',
          }}
        />
      )}
    </div>
  );
};

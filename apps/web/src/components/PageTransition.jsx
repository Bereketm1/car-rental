import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Page wrapper component to provide enter/exit animations.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('page-enter');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('page-exit');
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === 'page-exit') {
      setTransitionStage('page-enter');
      setDisplayLocation(location);
    }
  };

  return (
    <div
      className={transitionStage}
      onAnimationEnd={handleAnimationEnd}
      style={{ width: '100%', minHeight: '100%' }}
    >
      {children}
    </div>
  );
}

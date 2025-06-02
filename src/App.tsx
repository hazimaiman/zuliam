// src/App.tsx
import React, { useEffect, useState } from 'react';
import ComingSoon from './Comingsoon';
import Maintenance from './Maintenance';

const App: React.FC = () => {
  const [isWeekend, setIsWeekend] = useState(false);

  useEffect(() => {
    const today = new Date().getDay();
    setIsWeekend(today === 0 || today === 6); // 0 = Sunday, 6 = Saturday
  }, []);

  return isWeekend ?  <Maintenance /> : <ComingSoon />;
};

export default App;

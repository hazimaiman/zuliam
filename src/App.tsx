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
  // return isWeekend ?  <ComingSoon /> : <Maintenance/> ;

};

export default App;



// import React, { useEffect, useState } from 'react';
// import ComingSoon from './Comingsoon';
// import Maintenance from './Maintenance';

// const App: React.FC = () => {
//   const [showMaintenance, setShowMaintenance] = useState(false);

//   useEffect(() => {
//     const now = new Date();
//     const hour = now.getHours(); // 0 = midnight, 23 = 11pm

//     // Show Maintenance from 00:00 to 11:59
//     setShowMaintenance(hour < 12);
//   }, []);

//   return showMaintenance ? <Maintenance /> : <ComingSoon />;
// };

// export default App;


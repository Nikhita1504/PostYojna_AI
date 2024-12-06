// import { Search, Bell, Settings } from 'lucide-react';
// import styles from './Header.module.css';

// const Header = () => {
//   return (
//     <header className={styles.header}>
//       <div className={styles.search}>
//         {/* <Search className={styles.searchIcon} />
//         <input type="text" placeholder="Search..." className={styles.searchInput} /> */}
//       </div>
      
//       <div className={styles.actions}>
//         <button className={styles.actionButton}>
//           <Bell className={styles.actionIcon} />
//         </button>
//         {/* <button className={styles.actionButton}>
//           <Settings className={styles.actionIcon} />
//         </button> */}
//         <div className={styles.profile}>
//           <img src="/assets/user.jpeg" alt="Profile" className={styles.profileImage} />
//           {/* <div className={styles.profileInfo}>
//             <h4 className={styles.profileName}>Austin Robertson</h4>
//             <p className={styles.profileRole}>Marketing Administrator</p>
//           </div> */}
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup the timer
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.search}>
        {/* Uncomment if needed */}
        {/* <Search className={styles.searchIcon} />
        <input type="text" placeholder="Search..." className={styles.searchInput} /> */}
      </div>
      
      <div className={styles.actions}>
        <div className={styles.dateTime}>
          <p>{currentTime.toLocaleDateString()}</p>
          <p>{currentTime.toLocaleTimeString()}</p>
        </div>
        <button className={styles.actionButton}>
          <Bell className={styles.actionIcon} />
        </button>
        {/* <div className={styles.profile}>
          <img src="/assets/user.jpeg" alt="Profile" className={styles.profileImage} />
        </div> */}
      </div>
    </header>
  );
}

export default Header;


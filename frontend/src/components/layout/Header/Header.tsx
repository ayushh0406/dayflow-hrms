import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import styles from './Header.module.css';

interface HeaderProps {
  companyLogo?: string;
  companyName?: string;
  userName: string;
  userAvatar?: string;
  isCheckedIn: boolean;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
}

export const Header: FC<HeaderProps> = ({
  companyLogo,
  companyName = 'Company Logo',
  userName,
  userAvatar,
  isCheckedIn,
  onCheckIn,
  onCheckOut,
  onProfileClick,
  onLogout,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAttendanceClick = () => {
    if (isCheckedIn && onCheckOut) {
      onCheckOut();
    } else if (!isCheckedIn && onCheckIn) {
      onCheckIn();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          {companyLogo ? (
            <img src={companyLogo} alt={companyName} />
          ) : (
            <span>{companyName}</span>
          )}
        </div>
        
        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${styles.active}`}>Employees</button>
          <button className={styles.navItem}>Attendance</button>
          <button className={styles.navItem}>Time Off</button>
        </nav>
      </div>

      <div className={styles.rightSection}>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleAttendanceClick}
          className={styles.attendanceButton}
        >
          <span className={`${styles.statusDot} ${isCheckedIn ? styles.checkedIn : styles.checkedOut}`} />
          {isCheckedIn ? 'Check Out' : 'Check In'}
        </Button>

        <div className={styles.profileMenu} ref={profileMenuRef}>
          <button 
            className={styles.profileButton}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <Avatar src={userAvatar} alt={userName} size="sm" />
          </button>

          {showProfileMenu && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <Avatar src={userAvatar} alt={userName} size="md" />
                <span className={styles.userName}>{userName}</span>
              </div>
              <div className={styles.dropdownDivider} />
              <button className={styles.dropdownItem} onClick={() => {
                onProfileClick?.();
                setShowProfileMenu(false);
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                My Profile
              </button>
              <button className={styles.dropdownItem} onClick={() => {
                onLogout?.();
                setShowProfileMenu(false);
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
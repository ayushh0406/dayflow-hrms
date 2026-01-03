import type { FC } from 'react';
import type { AttendanceStatus } from '@/types/enums';
import styles from './StatusIndicator.module.css';

interface StatusIndicatorProps {
  status: AttendanceStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator: FC<StatusIndicatorProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = (): { type: string; color?: string; icon?: string; label: string } => {
    switch (status) {
      case 'PRESENT':
        return { type: 'dot', color: 'green', label: 'Present' };
      case 'LEAVE':
        return { type: 'icon', icon: 'airplane', label: 'On Leave' };
      case 'ABSENT':
        return { type: 'dot', color: 'yellow', label: 'Absent' };
      case 'HALF_DAY':
        return { type: 'dot', color: 'orange', label: 'Half Day' };
      default:
        return { type: 'dot', color: 'gray', label: 'Unknown' };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`${styles.indicator} ${styles[size]}`} title={config.label}>
      {config.type === 'dot' && config.color ? (
        <span className={`${styles.dot} ${styles[config.color]}`} />
      ) : (
        <div className={styles.iconContainer}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
          </svg>
        </div>
      )}
    </div>
  );
};
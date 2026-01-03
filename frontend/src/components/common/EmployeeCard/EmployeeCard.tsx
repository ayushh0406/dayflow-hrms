import type { FC } from 'react';
import { Avatar } from '@/components/common/Avatar';
import { StatusIndicator } from '@/components/common/StatusIndicator';
import type { AttendanceStatus } from '@/types/enums';
import styles from './EmployeeCard.module.css';

interface EmployeeCardProps {
  id: string;
  name: string;
  profilePicture?: string;
  position?: string;
  department?: string;
  status: AttendanceStatus;
  onClick?: () => void;
}

export const EmployeeCard: FC<EmployeeCardProps> = ({
  name,
  profilePicture,
  position,
  department,
  status,
  onClick,
}) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.statusBadge}>
        <StatusIndicator status={status} size="md" />
      </div>
      
      <div className={styles.avatarContainer}>
        <Avatar src={profilePicture} alt={name} size="lg" />
      </div>
      
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        {position && <p className={styles.position}>{position}</p>}
        {department && <p className={styles.department}>{department}</p>}
      </div>
    </div>
  );
};
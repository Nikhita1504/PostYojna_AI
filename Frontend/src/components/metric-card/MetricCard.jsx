import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from './metric-card.module.css';

const MetricCard = ({ title, value, trend = 'up', color = 'blue' }) => {
  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrapper} ${styles[color]}`}>
        {trend === 'up' ? (
          <ArrowUpRight className={styles.icon} />
        ) : (
          <ArrowDownRight className={styles.icon} />
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
}

export default MetricCard;

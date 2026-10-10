import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './StatusMessage.module.scss';

type StatusVariant = 'neutral' | 'error';

interface StatusMessageProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actions?: ReactNode;
  variant?: StatusVariant;
  headingLevel?: 1 | 2;
}

function StatusMessage({
  icon: Icon,
  title,
  description,
  actions,
  variant = 'neutral',
  headingLevel = 2,
}: StatusMessageProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';

  return (
    <section className={`${styles.status} ${styles[variant]}`}>
      <span className={styles.iconWrapper} aria-hidden="true">
        <Icon size={32} />
      </span>

      <Heading className={styles.title}>{title}</Heading>
      {description && <p className={styles.description}>{description}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </section>
  );
}

export default StatusMessage;
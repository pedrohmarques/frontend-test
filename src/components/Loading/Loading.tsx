import { LoaderCircle } from 'lucide-react';
import styles from './Loading.module.scss';

type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingProps {
  label?: string;
  showLabel?: boolean;
  size?: LoadingSize;
  fullPage?: boolean;
}

const ICON_SIZE: Record<LoadingSize, number> = {
  sm: 16,
  md: 24,
  lg: 40,
  xl: 64,
};

export function Loading({
  label = 'Loading...',
  showLabel = false,
  size = 'md',
  fullPage = false,
}: LoadingProps) {
  const className = [styles.loading, styles[size], fullPage && styles.fullPage]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} role="status" aria-live="polite">
      <LoaderCircle
        className={styles.icon}
        size={ICON_SIZE[size]}
        strokeWidth={size === 'xl' ? 1.75 : 2}
        aria-hidden="true"
      />
      <span className={showLabel ? styles.label : styles.srOnly}>{label}</span>
    </div>
  );
}
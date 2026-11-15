import type { ReactNode } from 'react';
import { cx } from '../lib/classNames';
import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
  /**
   * Botón preparado para una función que aún no existe.
   * No hace nada al pulsarlo y se anuncia como no disponible (sigue siendo enfocable
   * para que quien usa teclado o lector de pantalla pueda leer la explicación).
   */
  comingSoon?: boolean;
  /** `id` del texto que explica por qué el botón no está disponible. */
  describedBy?: string;
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', icon, comingSoon, describedBy, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(styles.button, styles[variant], comingSoon && styles.soon)}
      aria-disabled={comingSoon || undefined}
      aria-describedby={describedBy}
      onClick={comingSoon ? undefined : onClick}
    >
      {icon}
      {children}
    </button>
  );
}

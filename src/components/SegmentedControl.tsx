import { useId } from 'react';
import { cx } from '../lib/classNames';
import styles from './SegmentedControl.module.css';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  /** Texto visible junto al control (p. ej. "Ordenar por"). */
  label: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Selector de una opción entre pocas (botones unidos). Reutilizable para orden, filtros, etc. */
export function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  const labelId = useId();

  return (
    <div className={styles.root}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <div role="group" aria-labelledby={labelId} className={styles.group}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cx(styles.option, option.value === value && styles.active)}
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

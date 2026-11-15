import { useId } from 'react';
import { siteConfig } from '../config/site';
import { cx } from '../lib/classNames';
import styles from './Logo.module.css';

interface LogoProps {
  /** Dónde lleva el logotipo al pulsarlo. */
  href?: string;
  className?: string;
}

/** Logotipo de MangazX: marca "M" luminosa + nombre con la X destacada. */
export function Logo({ href = '#inicio', className }: LogoProps) {
  // Cada instancia necesita su propio id de degradado (hay un logo en el encabezado y otro en el pie).
  const gradientId = `logo-${useId().replace(/:/g, '')}`;

  return (
    <a href={href} className={cx(styles.logo, className)} aria-label={`${siteConfig.name}, ir al inicio`}>
      <svg className={styles.mark} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill="#0d1224" />
        <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="9.25" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
        <path
          d="M10 29V12l10 11.5L30 12v17"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.word}>
        Mangaz<span className={styles.x}>X</span>
      </span>
    </a>
  );
}

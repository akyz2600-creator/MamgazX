import { Link } from '../router/router';
import styles from './Breadcrumb.module.css';

interface Crumb {
  label: string;
  /** Sin `to`, es la página actual. */
  to?: string;
}

/** Ruta de navegación ("Inicio / Catálogo / Título") para volver atrás con un toque. */
export function Breadcrumb({ items }: { items: readonly Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className={styles.list}>
        {items.map((item) => (
          <li key={item.label} className={styles.item}>
            {item.to ? (
              <Link to={item.to} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

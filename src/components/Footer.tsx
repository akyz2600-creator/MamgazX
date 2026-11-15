import { siteConfig } from '../config/site';
import { primaryNav } from '../config/navigation';
import { Logo } from './Logo';
import styles from './Footer.module.css';

/** Páginas que se publicarán más adelante. Se muestran como "próximamente", sin enlace falso. */
const upcomingPages = ['Aviso legal', 'Contacto'] as const;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.about}>{siteConfig.tagline}</p>
        </div>

        <nav className={styles.group} aria-label="Navegación secundaria">
          <h2 className={styles.heading}>Explorar</h2>
          <ul className={styles.list}>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.group}>
          <h2 className={styles.heading}>Información</h2>
          <ul className={styles.list}>
            {upcomingPages.map((page) => (
              <li key={page} className={styles.soon}>
                {page}
                <span className={styles.tag}>Próximamente</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.legal}>
        <p className={`container ${styles.copyright}`}>
          © {new Date().getFullYear()} {siteConfig.name}. Los títulos, personajes y obras publicados pertenecen a sus
          respectivos autores y titulares de derechos.
        </p>
      </div>
    </footer>
  );
}

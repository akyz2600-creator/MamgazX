import { useEffect, useRef, useState } from 'react';
import { primaryNav } from '../config/navigation';
import { cx } from '../lib/classNames';
import type { Manga } from '../types/manga';
import { CloseIcon, MenuIcon, SearchIcon } from './icons';
import { Logo } from './Logo';
import { SearchBox } from './SearchBox';
import styles from './Header.module.css';

interface HeaderProps {
  mangas: Manga[];
}

/** Encabezado fijo: logotipo, navegación, buscador y menú adaptable a móvil. */
export function Header({ mangas }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hash, setHash] = useState(() => window.location.hash);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Al abrir el buscador en móvil, el cursor va directo al campo.
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const isActive = (href: string) => hash === href || (href === '#inicio' && hash === '');

  return (
    <header className={styles.header}>
      <div className={cx('container', styles.bar)}>
        <Logo className={styles.logo} />

        <div className={styles.toggles}>
          <button
            type="button"
            className={cx(styles.toggle, searchOpen && styles.toggleActive)}
            aria-label={searchOpen ? 'Cerrar buscador' : 'Abrir buscador'}
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((open) => !open);
              setMenuOpen(false);
            }}
          >
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>
          <button
            type="button"
            className={cx(styles.toggle, menuOpen && styles.toggleActive)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="menu-principal"
            onClick={() => {
              setMenuOpen((open) => !open);
              setSearchOpen(false);
            }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <nav id="menu-principal" className={cx(styles.nav, menuOpen && styles.navOpen)} aria-label="Principal">
          <ul className={styles.links}>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cx(styles.link, isActive(item.href) && styles.linkActive)}
                  aria-current={isActive(item.href) ? 'location' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={cx(styles.search, searchOpen && styles.searchOpen)}>
          <SearchBox mangas={mangas} inputRef={searchInputRef} />
        </div>
      </div>
    </header>
  );
}

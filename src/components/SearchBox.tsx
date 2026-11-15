import { useEffect, useId, useMemo, useRef, useState, type RefObject } from 'react';
import { routes } from '../config/routes';
import { getCoverUrl, getGenreNames, getLatestChapter, searchMangas } from '../lib/manga';
import { Link } from '../router/router';
import type { Manga } from '../types/manga';
import { Cover } from './Cover';
import { CloseIcon, SearchIcon } from './icons';
import styles from './SearchBox.module.css';

interface SearchBoxProps {
  mangas: Manga[];
  inputRef?: RefObject<HTMLInputElement | null>;
}

/**
 * Buscador por nombre. Filtra mientras se escribe, sobre los datos locales.
 * Los resultados se muestran en un panel bajo el campo.
 */
export function SearchBox({ mangas, inputRef }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  // El panel se puede cerrar (Escape o tocar fuera). Al tocar fuera se conserva lo escrito.
  const [dismissed, setDismissed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const results = useMemo(() => searchMangas(mangas, query), [mangas, query]);
  const hasQuery = query.trim().length > 0;
  const showPanel = hasQuery && !dismissed;

  useEffect(() => {
    if (!showPanel) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setDismissed(true);
    };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress);
  }, [showPanel]);

  function clear() {
    setQuery('');
    setDismissed(false);
    inputRef?.current?.focus();
  }

  const statusText = !hasQuery
    ? ''
    : results.length === 0
      ? 'Sin resultados'
      : `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}`;

  return (
    <div ref={rootRef} className={styles.root}>
      <form
        className={styles.field}
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <SearchIcon className={styles.icon} />
        <label className="visually-hidden" htmlFor={`${panelId}-input`}>
          Buscar mangas por nombre
        </label>
        <input
          id={`${panelId}-input`}
          ref={inputRef}
          className={styles.input}
          type="search"
          value={query}
          placeholder="Buscar manga…"
          autoComplete="off"
          enterKeyHint="search"
          aria-controls={panelId}
          onChange={(event) => {
            setQuery(event.target.value);
            setDismissed(false);
          }}
          onFocus={() => setDismissed(false)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setDismissed(true);
          }}
        />
        {query && (
          <button type="button" className={styles.clear} onClick={clear} aria-label="Limpiar búsqueda">
            <CloseIcon width={16} height={16} />
          </button>
        )}
      </form>

      {/* Anuncia la cantidad de resultados a lectores de pantalla. */}
      <p className="visually-hidden" role="status">
        {statusText}
      </p>

      <div id={panelId} className={styles.panel} hidden={!showPanel}>
        {results.length > 0 ? (
          <ul className={styles.list}>
              {results.map((manga) => {
                const latest = getLatestChapter(manga);
                return (
                  <li key={manga.id}>
                    <Link to={routes.manga(manga.slug)} className={styles.item} onClick={() => setDismissed(true)}>
                      <Cover title={manga.title} src={getCoverUrl(manga)} className={styles.thumb} />
                      <div className={styles.info}>
                        <span className={styles.name}>{manga.title}</span>
                        <span className={styles.meta}>
                          {getGenreNames(manga).slice(0, 2).join(' · ')}
                          {latest && ` · Cap. ${latest.number}`}
                        </span>
                      </div>
                      {manga.isExample && <span className={styles.tag}>Ejemplo</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
        ) : (
          <div className={styles.none}>
            <p className={styles.noneTitle}>Sin coincidencias</p>
            <p className={styles.noneText}>
              No encontramos mangas que coincidan con «{query.trim()}». Revisa la ortografía o prueba con
              otra palabra.
            </p>
            <button type="button" className={styles.noneClear} onClick={clear}>
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

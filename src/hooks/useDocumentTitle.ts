import { useEffect } from 'react';
import { siteConfig } from '../config/site';

/** Pone el título de la pestaña: "Página — MangazX" (o solo "MangazX" en el inicio). */
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} — ${siteConfig.name}` : siteConfig.name;
  }, [title]);
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';

/**
 * Enrutador mínimo basado en la API de historial del navegador (sin dependencias).
 * Cubre lo que MangazX necesita: URL reales, enlaces sin recarga, botón "atrás" y anclas.
 * Si más adelante hiciera falta algo más complejo, se puede sustituir por una librería
 * cambiando solo este archivo (ver docs/DECISIONS.md, D-016).
 */

export interface Location {
  pathname: string;
  search: string;
  hash: string;
}

interface NavigateOptions {
  /** Reemplaza la entrada actual del historial en lugar de añadir otra. */
  replace?: boolean;
  /** `false` evita volver al inicio de la página (p. ej. al cambiar el orden del catálogo). */
  scroll?: boolean;
}

interface RouterValue {
  location: Location;
  navigate: (to: string, options?: NavigateOptions) => void;
}

const RouterContext = createContext<RouterValue | null>(null);

function readLocation(): Location {
  const { pathname, search, hash } = window.location;
  return { pathname, search, hash };
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location>(readLocation);
  // Cada cambio de página incrementa este contador para que el efecto de scroll se ejecute.
  const [scrollTick, setScrollTick] = useState(0);

  useEffect(() => {
    const onPopState = () => {
      setLocation(readLocation());
      // Al volver con "atrás" el navegador restaura el scroll; solo gestionamos las anclas.
      if (window.location.hash) setScrollTick((tick) => tick + 1);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: string, options: NavigateOptions = {}) => {
    const url = new URL(to, window.location.href);
    const target = url.pathname + url.search + url.hash;
    if (options.replace) window.history.replaceState(null, '', target);
    else window.history.pushState(null, '', target);
    setLocation(readLocation());
    if (options.scroll !== false) setScrollTick((tick) => tick + 1);
  }, []);

  // Tras cada navegación: ir a la ancla (#seccion) si existe o, si no, al inicio de la página.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (target) target.scrollIntoView();
    else if (scrollTick > 0) window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [scrollTick]);

  const value = useMemo(() => ({ location, navigate }), [location, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

function useRouter(): RouterValue {
  const value = useContext(RouterContext);
  if (!value) throw new Error('useLocation/useNavigate/Link deben usarse dentro de <RouterProvider>.');
  return value;
}

export function useLocation(): Location {
  return useRouter().location;
}

export function useNavigate(): RouterValue['navigate'] {
  return useRouter().navigate;
}

interface LinkProps {
  to: string;
  className?: string;
  children: ReactNode;
  /** Se ejecuta al pulsar, antes de navegar (p. ej. para cerrar un menú). */
  onClick?: () => void;
  'aria-label'?: string;
  'aria-current'?: 'page' | 'location' | undefined;
}

/**
 * Enlace interno. Es un `<a href>` normal (se puede abrir en otra pestaña, copiar, etc.),
 * pero un clic simple navega sin recargar la página.
 */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const navigate = useNavigate();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.();
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  }

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { SparkIcon } from '../components/icons';
import { routes } from '../config/routes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './NotFoundPage.module.css';

interface NotFoundPageProps {
  title: string;
  text: string;
}

/** Página para direcciones, mangas o capítulos que no existen. */
export function NotFoundPage({ title, text }: NotFoundPageProps) {
  useDocumentTitle(title);

  return (
    <div className={`container ${styles.page}`}>
      <h1 className="visually-hidden">{title}</h1>
      <EmptyState icon={<SparkIcon />} title={title} text={text} />
      <div className={styles.actions}>
        <Button to={routes.home}>Ir al inicio</Button>
        <Button variant="secondary" to={routes.catalog}>
          Ver el catálogo
        </Button>
      </div>
    </div>
  );
}

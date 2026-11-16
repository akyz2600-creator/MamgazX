import { getApp, getApps, initializeApp } from 'firebase/app';
import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

/**
 * ÚNICO lugar donde se inicializa Firebase. El resto del código obtiene la app o la base
 * de datos con `getFirebaseApp()` / `getDb()` y nunca llama a `initializeApp` por su cuenta.
 *
 * - La configuración sale de variables de entorno (`.env.local`, ver `.env.example`).
 * - La inicialización es perezosa: importar este módulo no hace nada ni falla si faltan
 *   las variables. Así el sitio con datos de demostración sigue funcionando sin Firebase.
 * - Solo se usa Firestore. Las imágenes irán a Cloudflare R2, no a Firebase Storage.
 */

const env = import.meta.env;

const firebaseConfig: FirebaseOptions = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

/** Claves obligatorias y la variable de entorno que las alimenta. */
const REQUIRED_ENV = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  appId: 'VITE_FIREBASE_APP_ID',
} as const;

/** Nombres de las variables de entorno obligatorias que aún no tienen valor. */
export const missingFirebaseEnv: string[] = (
  Object.keys(REQUIRED_ENV) as Array<keyof typeof REQUIRED_ENV>
)
  .filter((key) => !firebaseConfig[key])
  .map((key) => REQUIRED_ENV[key]);

/** `true` si la configuración de Firebase está completa. */
export const isFirebaseConfigured = missingFirebaseEnv.length === 0;

/** Devuelve la app de Firebase (se crea una sola vez). Falla con un mensaje claro si falta configuración. */
export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error(
      `Firebase no está configurado. Faltan: ${missingFirebaseEnv.join(', ')}. ` +
        'Copia .env.example a .env.local y completa los valores.',
    );
  }
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

/** Devuelve la instancia de Firestore (`getFirestore` reutiliza la misma instancia). */
export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

/// <reference types="vite/client" />

/**
 * Variables de entorno propias del proyecto (solo las que empiezan por `VITE_` llegan al navegador).
 * Se definen en `.env.local` (ver `.env.example`). Son datos PÚBLICOS de configuración de Firebase:
 * la seguridad la dan `firestore.rules`, no el secreto de estos valores.
 */
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
}

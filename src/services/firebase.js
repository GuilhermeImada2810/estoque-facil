import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const getEnv = (key) => {
  const val = import.meta.env[key] ?? import.meta.env[`\uFEFF${key}`];
  return typeof val === 'string' ? val.trim() : val;
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
};

// Verifica se as variáveis de ambiente necessárias foram informadas
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'sua_api_key_aqui' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'seu-projeto'
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Erro ao inicializar o Firebase:', error);
  }
}

export { auth, db };

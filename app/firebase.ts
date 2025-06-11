import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase do seu projeto
const firebaseConfig = {
 const apiKey = process.env.API_KEY;
  authDomain: 'adominus-wealth.firebaseapp.com',
  projectId: 'adominus-wealth',
  storageBucket: 'adominus-wealth.appspot.com',
  messagingSenderId: '190563876780',
  appId: '1:190563876780:web:66c14d54f28f0e27868409',
  measurementId: 'G-S6NJ065186',
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firestore security rules devem ser configuradas apenas no console do Firebase ou em um arquivo .rules, nunca no código fonte do app.

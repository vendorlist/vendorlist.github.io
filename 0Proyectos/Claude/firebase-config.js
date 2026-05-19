// ==========================================
// firebase-config.js
// Configura Firebase para VendorList
//
// INSTRUCCIONES:
// 1. Ve a https://console.firebase.google.com
// 2. Crea un nuevo proyecto llamado "vendorlist"
// 3. Ve a Configuración del proyecto > Tus apps > Web app
// 4. Copia tu firebaseConfig y reemplaza los valores abajo
// 5. Activa: Authentication > Email/Password
//            Firestore Database
//            Storage
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// ⚠️  REEMPLAZA ESTOS VALORES CON TU CONFIG DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBliW24Q72mKpM2GdnRnLzXAXoX6Lj5X24",
  authDomain: "vendorlist-21641.firebaseapp.com",
  projectId: "vendorlist-21641",
  storageBucket: "vendorlist-21641.firebasestorage.app",
  messagingSenderId: "713239281448",
  appId: "1:713239281448:web:c85267c9f6c54a07cf9a1d",
  measurementId: "G-FH1SFPTD3N"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

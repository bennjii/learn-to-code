import firebaseClient from "firebase/app";
import "firebase/auth";

const CLIENT_CONFIG = {
  apiKey: "AIzaSyB7alTf1WYDY8vBC5kJ8U1tmSi7dg6gxD8",
  authDomain: "learn-to-code-nz.firebaseapp.com",
  databaseURL: "https://learn-to-code-nz.firebaseio.com",
  projectId: "learn-to-code-nz",
  storageBucket: "learn-to-code-nz.appspot.com",
  messagingSenderId: "299048324789",
  appId: "1:299048324789:web:ca0ceca1c5d9cf8598b8fc",
  measurementId: "G-04BXSRYWNC"
};

if (typeof window !== "undefined" && !firebaseClient.apps.length) {
  firebaseClient.initializeApp(CLIENT_CONFIG);
  firebaseClient
    .auth()
    .setPersistence(firebaseClient.auth.Auth.Persistence.SESSION);
  (window as any).firebase = firebaseClient;
}

export { firebaseClient };
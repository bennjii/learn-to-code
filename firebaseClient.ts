import firebaseClient from "firebase/app";
import "firebase/auth";

/*
Copy/paste your *client-side* Firebase credentials below. 
To get these, go to the Firebase Console > open your project > Gear Icon >
Project Settings > General > Your apps. If you haven't created a web app
already, click the "</>" icon, name your app, and copy/paste the snippet.
Otherwise, go to Firebase SDK Snippet > click the "Config" radio button >
copy/paste.
*/

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
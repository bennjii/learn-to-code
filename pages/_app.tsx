import { AppProps } from 'next/app'
import '../styles/globals.css'  

import { AuthProvider } from '../auth';

import cookie from 'js-cookie';
import firebase from 'firebase';
import 'firebase/auth';

var firebaseConfig = {
  apiKey: "AIzaSyB7alTf1WYDY8vBC5kJ8U1tmSi7dg6gxD8",
  authDomain: "learn-to-code-nz.firebaseapp.com",
  databaseURL: "https://learn-to-code-nz.firebaseio.com",
  projectId: "learn-to-code-nz",
  storageBucket: "learn-to-code-nz.appspot.com",
  messagingSenderId: "299048324789",
  appId: "1:299048324789:web:ca0ceca1c5d9cf8598b8fc",
  measurementId: "G-04BXSRYWNC"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const tokenName = 'tokenName';
let user = null;

firebase.auth().onAuthStateChanged(async (_user: firebase.User) => {
  if (_user) {
    const token = await _user.getIdToken();
    cookie.set(tokenName, token, { expires: 1 });
    user = _user;
  } else {
    cookie.remove(tokenName);
    user = null;
  }
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
export default MyApp;
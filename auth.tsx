// @ts-nocheck
import React, { useState, useEffect, useContext, createContext } from "react";

import nookies from "nookies";
import cookie from 'js-cookie';

import firebase from 'firebase';
import { firebaseClient } from "./firebaseClient";

const AuthContext = createContext<{ user: firebaseClient.User | null }>({
  user: null,
});

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

firebase.auth().onAuthStateChanged(async (_user: firebase.User) => {
  if (_user) {
    const token = await _user.getIdToken();
    cookie.set(tokenName, token, { expires: 1 });
  } else {
    cookie.remove(tokenName);
  }
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<firebaseClient.User | null>(null);

  //firebaseClient.auth().setPersistence(firebaseClient.auth.Auth.Persistence.SESSION)

  useEffect(() => {
    if (typeof window !== undefined) {
      (window as any).nookies = nookies;
    }
    
    return firebaseClient.auth().onIdTokenChanged(async (user) => {
      console.log(`token changed!`);
      if (!user) {
        console.log(`no token found...`);
        setUser(null);
        nookies.destroy(null, "token");
        nookies.set(null, "token", "", {});
        return;
      }

      console.log(`updating token...`);
      const token = await user.getIdToken();
      setUser(user);
      nookies.destroy(null, "token");
      nookies.set(null, "token", token, {});
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      console.log(`refreshing token...`);
      const user = firebaseClient.auth().currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
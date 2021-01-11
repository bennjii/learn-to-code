import Head from 'next/head'
import Router from 'next/router'
import styles from '../styles/Home.module.css'

import firebase from 'firebase'
import 'firebase/auth'

function gotoAuth() { 
  Router.push("/auth");
}

let _user: firebase.User;

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Hi {_user.displayName} Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <a onClick={() => gotoAuth()}>Login</a>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

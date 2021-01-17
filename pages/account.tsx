import React from "react";
import { useState } from "react"

import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Header from '../public/components/header'

import nookies from "nookies"
import { firebaseAdmin } from "../firebaseAdmin"
import Router from 'next/router'

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;
    const user = token;

    return {
      props: { message: `Your email is ${email} and your UID is ${uid}.`, user: user },
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth",
      },
      props: {} as never,
    };
  }
};

const Account = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [ loadStatus, setLoadStatus ] = useState<number>(0);
  const user = props.user;

  return (
    <div className={styles.container}>
      <Head>
        <title>Learn to Code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header user={user} progress={loadStatus} loading={false} router={Router}/>

      <div className={styles.body}>
        <h1>Good {(new Date().getHours() < 13) ? (new Date().getHours() > 10) ? "Day" : "Morning" : (new Date().getHours() < 20) ? "Afternoon" : "Evening"}, {user.name}</h1>
      </div>

      <div className={styles.fullScreen}>
        <div className={styles.insideFullScreen}>
          <div>
            <h1>{user.name}</h1>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}

export default Account;
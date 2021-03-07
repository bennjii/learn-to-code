import React from "react";
import { useState } from "react"
import nookies from "nookies";

import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { firebaseAdmin } from "../firebaseAdmin"

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import Header from "../public/components/header";

import Router from 'next/router'
import Footer from "../public/components/footer";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
      const cookies = nookies.get(ctx);
      // console.log(JSON.stringify(cookies, null, 2));
      const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
      const { uid, email } = token;
      const user = token;
  
      // the user is authenticated!
      // FETCH STUFF HERE
  
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
  
    // SET THEME DARK
    // document.documentElement.setAttribute('theme', 'dark'); 
  };

const HomePage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const user = props.user;

  return (
    <div className={styles.container}>
        <Head>
            <title>Learn to Code</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={user} progress={0} loading={false} router={Router}/>

        <div className={styles.fullScreen2}>
          <h1>What would you like to learn?</h1>

          <div className={styles.coursesOverview}>
            <div style={{ backgroundColor: '#f7df1e5f', borderColor: '#f7df1e3f', color: '#535c6b' }}>
              <h2>JS</h2>
              <h4>Javascript</h4>
            </div>

            <div style={{ backgroundColor: '#007ACC5f', borderColor: '#007ACC3f', color: 'rgb(77 103 121)' }}>
              <h2>TS</h2>
              <h4>Typescript</h4>
            </div>

            <div style={{ backgroundColor: '#ee8cb1c4', borderColor: 'rgb(230 124 164 / 63%)', color: 'rgb(112 73 88)' }}>
              <h2>CSS</h2>
              <h4>CSS</h4>
            </div>

            <div style={{ backgroundColor: '#cc12006b', borderColor: '#cc12003f', color: 'hsl(5deg 20% 42%);' }}>
              <h2>HTML</h2>
              <h4>HTML</h4>
            </div>

            <div style={{ backgroundColor: '#7f87d985', borderColor: '#a0a7f39e', color: '#54577a' }}>
              <h2>Py</h2>
              <h4>Python</h4>
            </div>

            <div style={{ backgroundColor: '#17499366', borderColor: '#378dc76b', color: '#406076' }}>
              <h2>C++</h2>
              <h4>C++</h4>
            </div>
          </div>
        </div>

        <Footer />
    </div>
  );
}

export default HomePage;
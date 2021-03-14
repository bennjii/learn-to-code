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

      const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
      const { uid, email } = token;
      const user = token;
  
      const db = firebaseAdmin.firestore();
      let pageData = [];
  
      await db.collection(`course_index`).get().then(snapshot => {
        snapshot.forEach(doc => {
          let data = doc.data();
          pageData.push(data);
        });
      }).catch(e => {
        console.log(e)
      })

      return {
        props: { message: `Your email is ${email} and your UID is ${uid}.`, user: user, pageData: pageData },
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
            {
              props.pageData.map(e => {
                return (
                  // <div style={{ backgroundColor: `${e.colour}`, borderColor: `${e.colour}e0`, color: '#2a2a2ab5' }} onClick={() => Router.push(`./course/${e.link}`)}>
                  //   <h2>{e._short}</h2>
                  //   <h4>{e.name}</h4>
                  // </div>

                  <div style={{ backgroundColor: `${e.colour}1a`, borderColor: `${e.colour}e0` }} onClick={() => Router.push(`./course/${e.link}`)}>
                    <h2>{e._short}</h2>
                    <h4>{e.name}</h4>
                  </div>
                )
              })
            }

            {/*
            TEMPLATE COLOURS

            <div style={{ backgroundColor: '#9cc9e8', borderColor: '#007ACC3f', color: 'rgb(77 103 121)' }}>
              <h2>TS</h2>
              <h4>Typescript</h4>
            </div>

            <div style={{ backgroundColor: '#e69890', borderColor: '#cc12003f', color: 'rgb(106 68 68)' }}>
              <h2>HTML</h2>
              <h4>HTML</h4>
            </div>

            <div style={{ backgroundColor: '#f0a5c1', borderColor: 'rgb(230 124 164 / 63%)', color: 'rgb(112 73 88)' }}>
              <h2>CSS</h2>
              <h4>CSS</h4>
            </div>

            <div style={{ backgroundColor: '#b9bde8', borderColor: '#a0a7f39e', color: '#54577a' }}>
              <h2>Py</h2>
              <h4>Python</h4>
            </div> */}
          </div>
        </div>

        <Footer />
    </div>
  );
}

export default HomePage;
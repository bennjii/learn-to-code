import React from "react";
import { useState } from "react"
import nookies from "nookies";

import styles from '../../styles/Home.module.css'
import Head from 'next/head'
import { firebaseAdmin } from "../../firebaseAdmin"

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import Header from "../../public/components/header";

import Router from 'next/router'
import Footer from "../../public/components/footer";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
      const cookies = nookies.get(ctx);
      // console.log(JSON.stringify(cookies, null, 2));
      const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
      const { uid, email } = token;
      const user = token;
  
      const db = firebaseAdmin.firestore();
      const courseId = ctx.params.course_id;
      let pageData;
  
      await db.doc(`courses/${courseId}`).get().then((doc) => {
        pageData = doc.data();
      }).catch((e) => {
          return {
              redirect: {
                permanent: false,
                destination: "/err",
              },
              props: {} as never,
          };
      });

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
          <div className={styles.courseSylibus}>
            <h1>{props.pageData.title}</h1>
            <p>{props.pageData.desc}</p>
          </div>
          

          <div className={styles.courseSylibusOverview}>
            {
              props.pageData.lessons.map(e => {
                return (
                  <div className={styles.lessonOverview}>
                    {e.name}
                  </div>
                )
              })
            }
          </div>
        </div>

        <Footer />
    </div>
  );
}

export default HomePage;
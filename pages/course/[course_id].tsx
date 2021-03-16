import React from "react";
import { useState } from "react"
import nookies from "nookies";

import Button from '../../public/components/button'

import styles from '../../styles/Home.module.css'
import Head from 'next/head'
import { firebaseAdmin } from "../../firebaseAdmin"

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import Header from "../../public/components/header";

import Router from 'next/router'
import Footer from "../../public/components/footer";
import { firebaseClient } from "../../firebaseClient";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
      const cookies = nookies.get(ctx);

      const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
      const { uid, email } = token;
      const user = token;
  
      const db = firebaseAdmin.firestore();
      const courseId = ctx.params.course_id;
      const pageData = await(await db.doc(`courses/${courseId}`).get()).data()
      
      const master = (await db.collection("users").doc(user.uid).get()).data();

      return {
        props: { message: `Your email is ${email} and your UID is ${uid}.`, user: user, pageData: pageData, master: master },
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
  const db = firebaseClient.firestore();
  
  const [ courseSubsriber, setCourseSubscriber ] = useState(props.master.courses.findIndex(e => e._loc == props.pageData.inherit_id));

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

          <Button title={(courseSubsriber >= 0) ? "Resume Course" : "Join Course"} onClick={async (e, callback) => {
              if(courseSubsriber == -1) {
                props.master.courses.push({
                  title: props.pageData.title,
                  desc: props.pageData.desc,
                  _loc: props.pageData.inherit_id,
                  lesson: 0,
                  sub_lesson: 0
                });
  
                db.collection("users").doc(user.uid).set(props.master).then(e => {
                  callback();
                  setCourseSubscriber(true);
                });
              }else {
                Router.push(`/learn/${props.pageData.inherit_id}/${props.master.courses[courseSubsriber].lesson}/${props.master.courses[courseSubsriber].sub_lesson}`)
              }
          }} />
        </div>

        <Footer />
    </div>
  );
}

export default HomePage;
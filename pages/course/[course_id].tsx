import React, { useEffect } from "react";
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
      const pageData = await(await db.doc(`courses/${courseId}`).get()).data();

      const userData =
      await (await db.doc(`users/${user.uid}`).get()).data();

      if(userData.date) {
        console.log(86400000 - (new Date().getTime() - userData.date));
        
        if(new Date().getTime() - userData.date > 86400000 && new Date().getTime() - userData.date < (2*86400000))  {// 1 < Day < 2     Difference
          userData.date = new Date().getTime();
          userData.streak += 1;
  
          db.doc(`users/${user.uid}`).set(userData);
        }else if (new Date().getTime() - userData.date > (2*86400000)) {
          userData.streak = 0;
          db.doc(`users/${user.uid}`).set(userData);
        }
      }else {
        userData.date = new Date().getTime();
        userData.streak = 0;
  
        db.doc(`users/${user.uid}`).set(userData);
      }
      
      const master = (await db.collection("users").doc(user.uid).get()).data();

      return {
        props: { userData, user, pageData, master },
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
  
  const [ courseSubscriber, setCourseSubscriber ] = useState(null);

  useEffect(() => {
    console.log("Indexed.")
    setCourseSubscriber(props.master.courses.findIndex(e => e._loc == props.pageData.inherit_id));
  }, [props])

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
              props.pageData.lessons.map((e, index) => {
                return (
                  <div className={styles.lessonOverviewParent}>
                    <div className={styles.lessonOverview}>
                      {index+1}: {e.name}
                    </div>

                    <div className={styles.lessonOverviewSubLessons}>
                      {
                        e.sub_lessons.map((data, data_index) => {
                          return (
                            <div>
                              <p>{index+1}.{data_index+1}: {data.name}</p>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>  
                )
              })
            }
          </div>

          {
            (props.userData.account_type == 'student')
            ?
            <Button title={(courseSubscriber >= 0) ? "Resume Course" : "Join Course"} onClick={async (e, callback) => {
              if(courseSubscriber == -1) {
                props.master.courses.push({
                  title: props.pageData.title,
                  desc: props.pageData.desc,
                  _loc: props.pageData.inherit_id,
                  lesson: 0,
                  sub_lesson: 0
                });
  
                db.collection("users").doc(user.uid).set(props.master).then(e => {
                  callback();
                  setCourseSubscriber(props.master.courses.findIndex(e => e._loc == props.pageData.inherit_id));
                });
              }else {
                Router.push(`/learn/${props.pageData.inherit_id}/${props.master.courses[courseSubscriber].lesson}/${props.master.courses[courseSubscriber].sub_lesson}`)
              }
            }} />
            :
            <Button title={"Edit Course"} onClick={async (e, callback) => {
              Router.push(`/create/${props.pageData.inherit_id}/${props.master.courses[courseSubscriber].lesson}/${props.master.courses[courseSubscriber].sub_lesson}`)
          }} />
          }
          
          
        </div>

        <Footer />
    </div>
  );
}

export default HomePage;
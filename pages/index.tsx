import React, { useEffect } from "react";
import nookies from "nookies";

import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Button from '../public/components/button'
import Footer from '../public/components/footer'

import Header from "../public/components/header"
import Router from 'next/router'

import { firebaseAdmin } from "../firebaseAdmin"

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import TextInput from "../public/components/text_input";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    // console.log(JSON.stringify(cookies, null, 2));
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;
    const user = token;

    const db = firebaseAdmin.firestore();
    const userData =
    await db.doc(`users/${user.uid}`).get()
    .catch(e => {
      return {
        redirect: {
          permanent: false,
          destination: "/auth",
        },
        props: {} as never,
      };
    });

    

    return {
      props: { userData: await (userData.data()), user },
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

  if(props.userData.courses.length == 0) Router.push('/courses')

  return (
    <div className={styles.container}>
      <Head>
        <title>Learn to Code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header user={user} progress={0} loading={false} router={Router}/>

      <div className={styles.body}>
        <h1>Good {(new Date().getHours() < 13) ? (new Date().getHours() > 10) ? "Day" : "Morning" : (new Date().getHours() < 20) ? "Afternoon" : "Evening"}, {user.name}</h1>
      </div>

      <div className={styles.fullScreen}>
        <div className={styles.insideFullScreen}>
          <div>
            {
              props.userData.courses.map(e => {
                return (
                  <div className={styles.boxDiv}>
                    <div>
                      <div>
                        <h4>COURSE</h4>
                        <h1>{e.title}</h1>
                      </div>
                      
                      <div className={styles.boxProgress}>
                        <h5>27% Progress</h5>

                        <div className={styles.progressBar}>
                          <div style={{ width: "27%" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.progress}>
                      <h4>1 : Variables</h4>

                      <div>
                        <div className={styles.first}>
                          <div className={styles.circle}><h6>1.2</h6></div>
                          <h5>Lesson</h5>
                          <p>Constants</p>
                        </div>

                        <div className={styles.active}>
                          <div className={styles.circle}><h6>1.3</h6></div>
                          <h5>Lesson</h5>
                          <p>Assignment</p>
                        </div>

                        <div>
                          <div className={styles.circle}><h6>1.4</h6></div>
                          <h5>Lesson</h5>
                          <p>Mutation</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* /create/S7ioyCGZ1xow6DRyX3Rw/0/0 */}
                      <button onClick={() => Router.push(`/course/${e._loc}`)}>
                        View Syllabus
                      </button>

                      <Button title="Resume Learning" redirect={`/learn/${e._loc}/${e.lesson}/${e.sub_lesson}`} router={Router}/>
                    </div>
                  </div>
                )
              })
            }

            {
              (props.userData.courses.length == 0) ?
              <div className={styles.boxDiv}>
                <div>
                  <div>
                    <h4>WELCOME</h4>
                    <h1>Try to learn a new Language!</h1>
                  </div>
                </div>

                <div>
                  <button onClick={() => Router.push(`/courses`)}>
                    View Course List
                  </button>

                  <Button title="Join a course" redirect={`/courses`} router={Router}/>
                </div>
              </div>
              :
              <></>
            }
          </div>

          <div>
            {/* <h2>Challenges</h2> */}

            <div className={styles.boxDiv}>
              <div className={styles.teaching}>
                {/* PRESUMING TEACHER IS ASSIGNED ; */}
                <div>
                  <h4>Daily Streak</h4>
                  <h1><strong>0</strong> <h3>Days</h3></h1>
                </div>
              </div>
            </div>
          </div>       
        </div>
      </div>
      
		  <Footer />
    </div>
  );
}

export default HomePage;
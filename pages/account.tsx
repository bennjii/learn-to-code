import React from "react";

import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Button from '../public/components/button'

import nookies from "nookies"
import { firebaseAdmin } from "../firebaseAdmin"

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";

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
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    return {
      redirect: {
        permanent: false,
        destination: "/auth",
      },
      // `as never` is required for correct type inference
      // by InferGetServerSidePropsType below
      props: {} as never,
    };
  }
};

const Account = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const user = props.user;

  return (
    <div className={styles.container}>
      <Head>
        <title>Learn to Code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.header}>
        <div>
          <div className={styles.linear}>
            <h3 className={styles.headerTitle}>Learn to Code.</h3> 

            <a href="">Dashboard</a>
            <a href="">Courses</a>
            <a href="">My Account</a>
          </div>
          
          {(!user) 
            ? 
            <a>Login</a>
            :
            <div className={styles.linear}>
              <h5>{user.name}</h5>
              {/* <a onClick={() => firebaseClient.auth().signOut()}>Signout</a> */}
            </div>
          }
        </div>
      </main>

      <div className={styles.body}>
        <h1>Good {(new Date().getHours() < 13) ? (new Date().getHours() > 10) ? "Day" : "Morning" : (new Date().getHours() < 20) ? "Afternoon" : "Evening"}, {user.name}</h1>
      </div>

      <div className={styles.fullScreen}>
        <div className={styles.insideFullScreen}>
          <div>
            <h2>Learn</h2>

            <div className={styles.boxDiv}>
              <div>
                <div>
                  <h4>COURSE</h4>
                  <h1>Learn Javascript</h1>
                </div>
                
                <div>
                  <h5>27% Progress</h5>

                  <div className={styles.progressBar}>
                    <div style={{ width: "27%" }}></div>
                  </div>
                </div>
              </div>
              
              <p>In this course, you will learn about the in's and out's of the JavaScript Language, starting with the basics.</p>

              <div className={styles.progress}>
                <h4>1 Variables</h4>

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
                <button>
                  View Syllabus
                </button>

                <Button title="Resume Learning"/>
              </div>
              
            </div>
          </div>

          <div>
            <h2>Contact</h2>

            <div className={styles.boxDiv}>
              <div>
                <div>
                  <h1>EDENS NOODLE SHOP</h1>
                </div>
              </div>

              <Button title="Resume"/>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}

export default Account;
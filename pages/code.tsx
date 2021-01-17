import React from "react";
import nookies from "nookies";

import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Button from "../public/components/button"

import Router from 'next/router'
import dynamic from 'next/dynamic'
const TextEditor = dynamic(import('../public/components/text_editor'), {
  ssr: false
})

import { firebaseAdmin } from "../firebaseAdmin"

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBook, faBookOpen } from "@fortawesome/free-solid-svg-icons";

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
};

const HomePage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const user = props.user;

  return (
    <div className={styles.container}>
        <Head>
            <title>Learn to Code</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={styles.headerCustom}>
            <div className={styles.headerInsideCustom}>
                <h3 className={styles.headerTitle} onClick={() => Router.push("/")}>Learn to Code.</h3> 

                <h4>Learn Javascript</h4>

                {(!user) 
                    ? 
                    <a>Login</a>
                    :
                    <div className={styles.linear}>
                      <a onClick={() => Router.push("/account")}>{user.name}</a>
                      {/* <a onClick={() => firebaseClient.auth().signOut()}>Signout</a> */}
                    </div>
                }
            </div>
        </div>

        <div className={styles.codeGrid}>
            <div className={styles.codeDesc}>
                <h4>
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    size="1x"
                    />
                  
                  Learn
                </h4>

                <div>
                  <h3>VARIABLES I</h3>
                  <h2>Learn</h2>
                  <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae praesentium modi ipsum sed. Aspernatur est mollitia sint commodi deleniti cupiditate voluptatem alias ipsum dignissimos enim saepe maiores voluptatum, tenetur provident.</p>
                </div>
            </div>
              
            <TextEditor lan='javascript'/>

            <div>

            </div>

            <div className={styles.linearDark}>
              <FontAwesomeIcon
                icon={faBars}
                size="1x"
              />
              <h4>1.1 Understanding Variables</h4>
            </div>

            <div></div>

            <div>
              <Button title="Submit"></Button>
            </div>
        </div>

    </div>
  );
}

export default HomePage;
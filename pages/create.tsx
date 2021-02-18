import React from "react";
import nookies from "nookies";

import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Button from '../public/components/button'

import Header from "../public/components/header"
import Router from 'next/router'
import { useState } from "react"

import { firebaseAdmin } from "../firebaseAdmin"

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import ReactQuill from "react-quill";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    // console.log(JSON.stringify(cookies, null, 2));
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;
    const user = token;

    // the user is authenticated!
    // FETCH STUFF HERE
    const db = firebaseAdmin.firestore();
    const courseId = "S7ioyCGZ1xow6DRyX3Rw" // TEMPVAR
    let pageData;

    await db.doc(`courses/${courseId}`).get().then((doc) => {
      pageData = doc.data()
    })

    const lV = [ 0, 0 ]  // TEMPVAR

    return {
      props: { message: `Your email is ${email} and your UID is ${uid}.`, user: user, pageData: pageData, lessonVariance: lV },
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

type LessonParent = {
    name: string,
    sub_lessons: Array<Lesson>,
}

type Instruction = {
    desc: string,
    desired_output: string,
    server_code?: string
}

type Lesson = {
    desc: string,
    instructions?: Array<Instruction>,
    name: string,
    template_code?: string
}

const HomePage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const user = props.user;

  const [ activeEdit, setActiveEdit ] = useState(props.pageData.lessons[props.lessonVariance[0]][props.lessonVariance[1]]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Learn to Code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.headerCustom}>
            <div className={styles.headerInsideCustom}>
                <h3 className={styles.headerTitle} onClick={() => Router.push("/")}>Learn to Code.</h3> 

                <h4>{}</h4>

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

      <div className={styles.createCode + " " + styles.dark}>
          <div className={styles.refrence + " " + styles.vertical}>
                <div className={styles.courseSelector}>
                    {props.pageData.title}
                </div>
                    
                <div className={styles.centerExpand}>
                {
                    props.pageData.lessons.map((e, index) => {
                        return ( 
                            <div onClick={(e) => {
                                if(e.target.getElementsByTagName("A")[0].innerHTML == "-") {
                                    e.target.getElementsByTagName("A")[0].innerHTML = "";

                                    console.log(e.target);
                                    e.target.parentElement.getElementsByClassName(styles.collectionArr)[0].style.height = "0%";
                                    e.target.parentElement.getElementsByClassName(styles.collectionArr)[0].style.padding = "0%";
                                }else {
                                    e.target.getElementsByTagName("A")[0].innerHTML = "-";

                                    e.target.parentElement.getElementsByClassName(styles.collectionArr)[0].style.height = "100%";
                                    e.target.parentElement.getElementsByClassName(styles.collectionArr)[0].style.padding = "1rem";
                                }
                            }}>
                                <div>
                                    {index + 1}. {e.name}

                                    {
                                      (props.lessonVariance[0] == index)?
                                      <a href="">-</a>
                                      :
                                      <a href=""></a>
                                    }
                                </div>

                                <div className={styles.collectionArr}>
                                    {
                                        e.sub_lessons.map((e2, index2) => {
                                            return (
                                                <div>
                                                    {index + 1}.{index2 + 1} {e2.name}
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
                
                <Button title={"Create"}></Button>
          </div>

          <div className={styles.vertical}>
              <div>
                {
                  (process.browser == true)
                  ?
                    // <ReactQuill 
                    //   value={props.pageData.lessons[props.lessonVariance[0]][props.lessonVariance[1]].desc}
                      
                    // />
                    <div></div>
                  :
                    <div></div>
                }
                
                
              </div>

              <div>
                Template Code Editor
              </div>
          </div>
      </div>
    </div>
  );
}

export default HomePage;
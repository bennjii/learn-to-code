import React from "react";
import { useState } from "react"
import nookies from "nookies";

import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Button from "../public/components/button"

import Router from 'next/router'
import dynamic from 'next/dynamic'
const TextEditor = dynamic(import('../public/components/text_editor'), {
  ssr: false
});

import { firebaseAdmin } from "../firebaseAdmin"

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBookOpen } from "@fortawesome/free-solid-svg-icons";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  

  try {
    const cookies = nookies.get(ctx);
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
    console.log(err)

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

  const [ [lesson, subLesson], setLessonVariance ] = useState(props.lessonVariance);
  const [ lessonCompleted, setLessonCompleted ] = useState(true)

  const [ lessonSelectorVisible, setLessonSelectorVisible ] = useState(false)
  const currentLesson = props.pageData.lessons[lesson].sub_lessons[subLesson];

  return (
    <div className={styles.container}>
        <Head>
            <title>Learn to Code</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={styles.headerCustom}>
            <div className={styles.headerInsideCustom}>
                <h3 className={styles.headerTitle} onClick={() => Router.push("/")}>Learn to Code.</h3> 

                <h4>{props.pageData.title}</h4>

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
        
        <div className={`${styles.codeDesc} ${(!lessonSelectorVisible) ? styles.lessonsHidden : styles.lessonSelect}`} > {/* hidden={!lessonSelectorVisible}  style={{ display: (!lessonSelectorVisible)? "none" : "block" }}*/}
          {
            props.pageData.lessons.map(e => {
              return ( 
                <div>
                  <div className={styles.subClasses}>
                    <h2>{props.pageData.title} </h2>

                    <h5>{e.name}</h5>
                    <h3>LESSONS</h3>
                    
                    <div className={styles.lessonList}>
                      {
                        e.sub_lessons.map((e2, index) => {
                          return (
                            <div className={styles.exc} onClick={() => { setLessonVariance([lesson, index]); setLessonSelectorVisible(!lessonSelectorVisible)}}>{`${lesson+1}.${index+1}`} {e2.name}</div>
                          )
                        })
                      }
                    </div>
                  </div>                    
                </div>
              )
            })
          }
        </div>
        
        <div className={`${(!lessonSelectorVisible) ? styles.normalOut : styles.blackOut}`} onClick={() => setLessonSelectorVisible(!lessonSelectorVisible)}></div>

        <div className={`${styles.codeGrid}`} >
            <div className={styles.codeDesc} > {/*hidden={lessonSelectorVisible} */}
                <h4>
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    size="1x"
                    />
                  
                  Learn
                </h4>

                <div>
                  <h3>{`${props.pageData.lessons[lesson].name.toUpperCase()} ${"I"}`}</h3>
                  <h2>{currentLesson.name}</h2>
                  <p>{currentLesson.desc}</p>
                </div>
            </div>

            <TextEditor lan='javascript' placeholder={currentLesson.template_code}/>
            {/* <div className="textEditor">
              <div>
                  <h5>main.js</h5> 
              </div>  

              {
                (process.browser)?
                <AceEditor
                    mode={`${currentLesson.lan}`}
                    theme="night_owl"
                    onChange={currentLesson.onChange}
                    name="editor"
                    editorProps={{
                        $blockScrolling: true
                    }}
                    fontSize={"16px"}
                    height=''
                    width='100%'
                    value={currentLesson.placeholder}
                />
                :
                <div></div>
              }
            </div> */}

            {
              console.log(TextEditor)
            }

            <div className={styles.consolePage}>

            </div>

            <div className={styles.linearDark} onClick={() => setLessonSelectorVisible(!lessonSelectorVisible)}>
              <FontAwesomeIcon
                icon={faBars}
                size="1x"
              />
              <h4>{`${lesson + 1}.${subLesson + 1}`} {currentLesson.name}</h4>
            </div>

            <div className={styles.navigationBottom}>
              <Button title={"Go Back"} onClick={() => setLessonVariance([lesson, subLesson-1])}></Button>
              <h3>{subLesson + 1} / {props.pageData.lessons[lesson].sub_lessons.length}</h3>
              <Button title={"Next Lesson"} onClick={() => setLessonVariance([lesson, subLesson-1])} disabled={(lessonCompleted)}></Button>
            </div>

            <div>
              <Button title="Submit" redirect="" router={Router}></Button>
            </div>
        </div>     
    </div>
  );
}

export default HomePage;
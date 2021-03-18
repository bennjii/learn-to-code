import React, { useEffect } from "react";
import { useState } from "react"
import nookies from "nookies";

import styles from '../../../../styles/Home.module.css'
import Head from 'next/head'
import Button from "../../../../public/components/button"
import { EditorState, convertFromRaw, ContentState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'

import Router from 'next/router'
import dynamic from 'next/dynamic'
const TextEditor = dynamic(import('../../../../public/components/text_editor'), {
  ssr: false
});

import { firebaseAdmin } from "../../../../firebaseAdmin"

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { firebaseClient } from "../../../../firebaseClient";

const styleMap = {
  'CODE': {
    backgroundColor: '#051927',
    fontFamily: 'monospace',
    color: '#f4f4f4',
    padding: '1rem',
    borderRadius: '5px',
    width: '100%',
    display: 'block',
    boxSizing: 'border-box',
    fontSize: '1rem !important'
  },
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;
    const user = token;

    const db = firebaseAdmin.firestore();
    const courseId = ctx.params.courseId;
    let pageData;

    await db.doc(`courses/${courseId}`).get().then((doc) => {
      pageData = doc.data()
    });

    const userData = await (await db.doc(`users/${user.uid}`).get()).data();

    const lV = [ parseInt(ctx.params.lesson[0]), parseInt(ctx.params.sub_lesson[0]) ] 

    return {
      props: { message: `Your email is ${email} and your UID is ${uid}.`, user: user, userData: userData, pageData: pageData, lessonVariance: lV },
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
  const [ lessonCompleted, setLessonCompleted ] = useState(false)

  const [ lessonSelectorVisible, setLessonSelectorVisible ] = useState(false)
  let currentLesson = props.pageData.lessons[lesson].sub_lessons[subLesson];

  const [ content, setContent ] = useState(EditorState.createWithContent(
    convertFromRaw(currentLesson.desc)
  ))

  useEffect(() => {
    const les = props.userData.courses.find(f => f._loc == props.pageData.inherit_id);
    if(currentLesson.type !== "code") setLessonCompleted(true);
    else if(les.lesson < lesson) setLessonCompleted(false);
    else if(les.sub_lesson < subLesson) setLessonCompleted(false);
    else setLessonCompleted(false);
    
  }, [currentLesson]);

  return (
    <div className={styles.container}>
        <Head>
            <title>Learn to Code</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

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
                            <div className={styles.exc} onClick={() => { 
                              setLessonVariance([lesson, index]); 
                              setLessonSelectorVisible(!lessonSelectorVisible);

                              setContent(EditorState.createWithContent(
                                convertFromRaw(props.pageData.lessons[lesson].sub_lessons[index].desc)
                              ))

                              currentLesson = (
                                props.pageData.lessons[lesson].sub_lessons[index]
                              )
                            }}>
                            
                              {`${lesson+1}.${index+1}`} {e2.name}
                            </div>
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

        <div className={styles.learnInterface}>
          <div className={`${styles.codeGrid}`} >
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

            {
              (currentLesson.type === 'code') ?
                <div className={styles.codeInterface}>
                  <div className={styles.codeDesc}> {/*hidden={lessonSelectorVisible} */}
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
                      {/* <p>{currentLesson.desc}</p> */}

                      
                      <Editor               
                        // @ts-ignore       
                        editorState={content} 
                        onChange={() => {}}
                        readOnly={true}
                        customStyleMap={styleMap}
                      />
                      
                    </div>
                  </div>

                  <TextEditor lan='javascript' placeholder={currentLesson.template_code}/>
                  
                </div>
              :
                <div className={styles.widthContent}>
                  <div>
                    <h1>{currentLesson.name}</h1>
                    
                    <Editor
                      // @ts-ignore
                      editorState={content}
                      onChange={() => {}}
                      readOnly={true}
                      customStyleMap={styleMap}
                    />
                  </div>
                </div>
            }
              <div className={styles.codeFooter}>
                <div className={styles.linearDark} onClick={() => setLessonSelectorVisible(!lessonSelectorVisible)}>
                  <FontAwesomeIcon
                    icon={faBars}
                    size="1x"
                  />
                  <h4>{`${lesson + 1}.${subLesson + 1}`} {currentLesson.name}</h4>
                </div>

                <div className={styles.navigationBottom}>
                  <Button title={"Go Back"} onClick={(e, callback) => { 
                    if(!props.pageData.lessons[lesson].sub_lessons[subLesson-1]) return callback();
                    setLessonVariance([lesson, subLesson-1]);

                    // Going Backwards is not going to change the progress.

                    setContent(EditorState.createWithContent(
                      convertFromRaw(props.pageData.lessons[lesson].sub_lessons[subLesson-1].desc)
                    ))

                    currentLesson = (
                      props.pageData.lessons[lesson].sub_lessons[subLesson-1]
                    );

                    callback();
                  }}></Button>
                  <h3>{subLesson + 1} / {props.pageData.lessons[lesson].sub_lessons.length}</h3>
                  <Button title={"Next Lesson"} onClick={(e, callback) => { 
                    if(!props.pageData.lessons[lesson].sub_lessons[subLesson+1]) return callback();
                    setLessonVariance([lesson, subLesson+1]);

                    const data = props.userData.courses.findIndex(f => f._loc == props.pageData.inherit_id)
                    if(data !== -1) {
                      if(props.userData.courses[data].lesson < lesson) { props.userData.courses[data].lesson = lesson; props.userData.courses[data].sub_lesson = subLesson+1; }
                      else if(props.userData.courses[data].lesson == lesson && props.userData.courses[data].sub_lesson < lesson) { props.userData.courses[data].sub_lesson = subLesson+1; }

                      props.userData.courses[props.userData.courses.findIndex(f => f._loc == props.pageData.inherit_id)] = data;
                      
                      console.log(props.userData.courses[data]);
                      firebaseClient.firestore().doc(`users/${user.uid}`).set(props.userData);
                    }
                    

                    setContent(EditorState.createWithContent(
                      convertFromRaw(props.pageData.lessons[lesson].sub_lessons[subLesson+1].desc)
                    ))

                    currentLesson = (
                      props.pageData.lessons[lesson].sub_lessons[subLesson+1]
                    );

                    callback();
                  }} disabled={(!lessonCompleted)}></Button>
                </div>

                <div>
                  {
                    (currentLesson.type === 'code') ?
                    <Button title="Submit" redirect="" router={Router}></Button>
                    :
                    <div></div>
                  }
                  
                </div>
              </div>
          </div> 
        </div>
            
    </div>
  );
}

export default HomePage;
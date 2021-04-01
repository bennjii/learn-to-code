import React, { useEffect } from "react";
import { useState } from "react"
import nookies from "nookies";

import styles from '@styles/Home.module.css'
import Head from 'next/head'
import Button from "@components/button"

import { EditorState, convertFromRaw, ContentState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'

import Router from 'next/router'
import dynamic from 'next/dynamic'
const TextEditor = dynamic(import('@components/text_editor'), {
  ssr: false
});

import { MultiChoice } from '@components/multi_choice'

import { updateSync } from '@components/debounce'
import { firebaseAdmin } from "@root/firebaseAdmin"
import { firebaseClient } from "@root/firebaseClient";

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { Test } from "@components/test";

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
    if(userData.date) {
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

  const [ lessonSelectorVisible, setLessonSelectorVisible ] = useState(false);

  const currentLessonTemplate = Object.create(props.pageData.lessons[lesson].sub_lessons[subLesson]);
  const [ currentLesson, setCurrentLesson ] = useState(currentLessonTemplate);
  const [ editTest, setEditTest ] = useState({ open: false, location: null });

  const [ content, setContent ] = useState(EditorState.createWithContent(
    convertFromRaw(currentLesson.desc)
  ))

  useEffect(() => {
    if(
    localStorage.getItem(`${props.pageData.inherit_id}.${lesson}.${subLesson}`) !== null && 
    localStorage.getItem(`${props.pageData.inherit_id}.${lesson}.${subLesson}`) !== undefined &&
    localStorage.getItem(`${props.pageData.inherit_id}.${lesson}.${subLesson}`) !== 'undefined' &&
    localStorage.getItem(`${props.pageData.inherit_id}.${lesson}.${subLesson}`) !== 'null' &&
    localStorage.getItem(`${props.pageData.inherit_id}.${lesson}.${subLesson}`) !== '' &&  
    localStorage.getItem(`${props.pageData.inherit_id}.${lesson}.${subLesson}`) !== currentLesson.tempalate_code) {
      let cloneLesson = currentLesson;
      cloneLesson.template_code = localStorage.getItem(`${props.pageData.inherit_id}.${lesson}.${subLesson}`);
  
      setCurrentLesson(currentLesson);
    }
  }, [currentLesson])

  useEffect(() => {
    const data = props.userData.courses.findIndex(f => f._loc == props.pageData.inherit_id)
    if(data !== -1) {
      if(props.userData.courses[data].lesson < lesson) { props.userData.courses[data].lesson = lesson; props.userData.courses[data].sub_lesson = subLesson; }
      else if(props.userData.courses[data].lesson == lesson && props.userData.courses[data].sub_lesson < subLesson) { props.userData.courses[data].sub_lesson = subLesson; }

      props.userData.courses[data].progress = (props.userData.courses[data].lesson + 1 / props.pageData.lessons.length); // + ((props.userData.courses[data].sub_lesson + 1 / props.pageData.lessons[lesson].sub_lessons.length) / props.pageData.lessons.length)
      firebaseClient.firestore().doc(`users/${user.uid}`).set(props.userData);
    }
    
    const les = props.userData.courses.find(f => f._loc == props.pageData.inherit_id);

    if(currentLesson.type !== "code") 
      setLessonCompleted(true);
    else if(les.lesson > lesson) 
      setLessonCompleted(true);
    else if(les.lesson >= lesson && les.sub_lesson >= subLesson) 
      setLessonCompleted(true);
    else 
      setLessonCompleted(false);

  }, [currentLesson]);

  return (
    <div className={styles.container}>
        <Head>
            <title>Learn to Code</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={`${styles.createTest} ${(editTest.open) ? styles.testOpen : styles.lessonsHidden }`} > {/* hidden={!lessonSelectorVisible}  style={{ display: (!lessonSelectorVisible)? "none" : "block" }}*/}
        {
          editTest.location !== null ? 
            <div className={styles.subClasses}>
              <h2>{props.pageData.title}</h2>

              <Test 
                value={{  //props.pageData.lessons[lesson].test
                questions: [{ 
                  type: "multichoice",
                  correct_ans: [2],
                  possible_ans: [{value: "Console.log(\"Hello!\")", index: 0}, {value: "log.console(\"Hello!\")", index: 1}, {value: "console.log(\"Hello!\")", index: 2}, {value: "log.console(\"Hello!\")", index: 3}],
                  question: "How would you log Hello! to the console?"
                },
                { 
                  type: "multichoice",
                  correct_ans: [1],
                  possible_ans: [{value: "// \n //", index: 0}, {value: "/*\n*/", index: 1}, {value: "//", index: 2}, {value: "*/\n/*", index: 3}],
                  question: "What is the standard to comment more than two lines?"
                },
                { 
                  type: "drag",
                  correct_ans: [1],
                  possible_ans: [{value: "console", index: 0}, {value: ".log", index: 1}, {value: "(\"Hello World\")", index: 2}],
                  question: "What is the correct order to log to the console?"
                },
                { 
                  type: "errorfind",
                  correct_ans: [0],
                  possible_ans: [{value: "for(let i = 0; i < arr.length) {", index: 0}, {value: "\tconsole.log(i)", index: 1}, {value: "}", index: 2}],
                  question: "What is the error in this statement?"
                }],
                dificulty: 0,
                title: "Javascript Basic Concepts"
              }} submitForm={(pass, score) => {
                console.log("RESULTS", pass, score);

                if(pass) {
                  setLessonVariance([lesson+1, 0]);

                  setContent(EditorState.createWithContent(
                    convertFromRaw(props.pageData.lessons[lesson+1].sub_lessons[0].desc)
                  ))

                  setCurrentLesson(props.pageData.lessons[lesson+1].sub_lessons[0])
                }
                
              }} closeForm={() => {
                setEditTest({open: false, location: -1});
              }}/>
              
            </div>                    
          :
            <></>
        }
      </div>

        <div className={`${styles.codeDesc} ${(!lessonSelectorVisible) ? styles.lessonsHidden : styles.lessonSelect}`} > {/* hidden={!lessonSelectorVisible}  style={{ display: (!lessonSelectorVisible)? "none" : "block" }}*/}
          
            <div>
              <div className={styles.subClasses}>
                  <h2>{props.pageData.title}</h2>
                  {
                    props.pageData.lessons.map((e, index1) => {
                    return ( 
                      <div>
                        <h5>{e.name}</h5>
                        <h3>LESSONS</h3>
                        
                        <div className={styles.lessonList}>
                          {
                            e.sub_lessons.map((e2, index) => {
                              return (
                                <div className={styles.exc} onClick={() => { 
                                  setLessonVariance([index1, index]); 
                                  setLessonSelectorVisible(!lessonSelectorVisible);

                                  setContent(EditorState.createWithContent(
                                    convertFromRaw(props.pageData.lessons[index1].sub_lessons[index].desc)
                                  ))

                                  setCurrentLesson(props.pageData.lessons[index1].sub_lessons[index])
                                }}>
                                
                                  {`${index1+1}.${index+1}`} {e2.name}
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
            </div>
            
          
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

                  <TextEditor lan='javascript' placeholder={currentLesson.template_code} onChange={(e) => {
                    let edit = currentLesson;
                    edit.template_code = e;
                    setCurrentLesson(edit);

                    updateSync(() => {
                      localStorage.setItem(`${props.pageData.inherit_id}.${lesson}.${subLesson}`, e);
                    })
                  }} onReset={(e, callback) => {
                    localStorage.setItem(`${props.pageData.inherit_id}.${lesson}.${subLesson}`, props.pageData.lessons[lesson].sub_lessons[subLesson].template_code);
                    let cloneLesson = currentLesson;
                    cloneLesson.template_code = props.pageData.lessons[lesson].sub_lessons[subLesson].template_code;

                    setCurrentLesson(cloneLesson);
                    callback(props.pageData.lessons[lesson].sub_lessons[subLesson].template_code)
                  }}/>
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
                  <Button title={"Return"} onClick={(e, callback) => { 
                    if((subLesson == 0 && lesson-1 >= 0)) {
                      let size = props.pageData.lessons[lesson-1].sub_lessons.length;

                      setLessonVariance([lesson-1, size-1]);

                      setContent(EditorState.createWithContent(
                        convertFromRaw(props.pageData.lessons[lesson-1].sub_lessons[size-1].desc)
                      ))
  
                      setCurrentLesson(props.pageData.lessons[lesson-1].sub_lessons[size-1]);

                      callback();
                      return;
                    }

                    if(!props.pageData.lessons[lesson].sub_lessons[subLesson-1]) return callback();
                    setLessonVariance([lesson, subLesson-1]);

                    // Going Backwards is not going to change the progress.

                    setContent(EditorState.createWithContent(
                      convertFromRaw(props.pageData.lessons[lesson].sub_lessons[subLesson-1].desc)
                    ))
                    
                    setCurrentLesson(props.pageData.lessons[lesson].sub_lessons[subLesson-1])

                    callback();
                  }} disabled={(subLesson == 0 && lesson == 0)}></Button>
                  <h3>{subLesson + 1} / {props.pageData.lessons[lesson].sub_lessons.length}</h3>
                  <Button title={(props.pageData.lessons[lesson].sub_lessons.length == subLesson+1) ? ((lesson == props.pageData.lessons.length-1 && subLesson == props.pageData.lessons[lesson].sub_lessons.length-1)) ? "Finish" : "Test" : "Next"} onClick={(e, callback) => { 
                    if((props.pageData.lessons[lesson].sub_lessons.length == subLesson+1) && !(lesson == props.pageData.lessons.length-1 && subLesson == props.pageData.lessons[lesson].sub_lessons.length-1)) {
                      setEditTest({ open: true, location: lesson });
                      callback();
                      return;
                    }
                    
                    if((props.pageData.lessons[lesson].sub_lessons.length == subLesson+1)) {
                      setLessonVariance([lesson+1, 0]);

                      setContent(EditorState.createWithContent(
                        convertFromRaw(props.pageData.lessons[lesson+1].sub_lessons[0].desc)
                      ))
  
                      setCurrentLesson(props.pageData.lessons[lesson+1].sub_lessons[0])

                      callback();
                      return;
                    }

                    if(!props.pageData.lessons[lesson].sub_lessons[subLesson+1]) return callback();
                    setLessonVariance([lesson, subLesson+1]);

                    setContent(EditorState.createWithContent(
                      convertFromRaw(props.pageData.lessons[lesson].sub_lessons[subLesson+1].desc)
                    ))

                    setCurrentLesson(props.pageData.lessons[lesson].sub_lessons[subLesson+1])

                    callback();
                  }} disabled={(!lessonCompleted || (lesson == props.pageData.lessons.length-1 && subLesson == props.pageData.lessons[lesson].sub_lessons.length-1))}></Button>
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
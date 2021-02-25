import React, { useEffect } from "react";
import nookies from "nookies";

import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Button from '../public/components/button'

import Header from "../public/components/header"
import Router from 'next/router'
import { useState } from "react"

import dynamic from 'next/dynamic'
const TextEditor = dynamic(import('../public/components/text_editor'), {
  ssr: false
});

import { ContentState } from 'draft-js' 

import { firebaseAdmin } from "../firebaseAdmin"
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";

import { SimpleEditor } from '../public/components/editor' 
import { firebaseClient } from "../firebaseClient";

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
  const [ activeEdit, setActiveEdit ] = useState(props.pageData.lessons[props.lessonVariance[0]].sub_lessons[props.lessonVariance[1]]);
  const [ activeLocation, setActiveLocation ] = useState(props.lessonVariance);

  const [ syncStatus, setSyncStatus ] = useState(false)

  return (
    <div className={styles.container}>
      <Head>
        <title>Learn to Code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.headerCustom}>
            <div className={styles.headerInsideCustom}>
                <h3 className={styles.headerTitle} onClick={() => Router.push("/")}>Learn to Code.</h3> 

                <h4>{activeEdit.name}</h4>

                <div className={styles.linear}>
                  <a>
                  {
                    (syncStatus)
                    ?
                    "Synced"
                    :
                    "Not Synced"
                    }
                  </a>
                </div>
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
                            <div key={index}>
                                <div>
                                    {e.name}
                                    {
                                      (props.lessonVariance[0] == index)?
                                      <a href="">^</a>
                                      :
                                      <a href=""></a>
                                    }
                                </div>

                                <div className={styles.collectionArr}>
                                  {
                                    e.sub_lessons.map((e2, index2) => {
                                      return (
                                        <div key={`${index} ${index2}`} className={`${styles.changeDefault} ${(props.pageData.lessons[index].sub_lessons[index2] == activeEdit) ? styles.changeActive : ''}`} onClick={() => { 
                                          setActiveEdit(props.pageData.lessons[index].sub_lessons[index2]);
                                          setActiveLocation([index, index2]);
                                        }}>
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
                <Button title={"Create"} onClick={() => {}}></Button>
          </div>

          <div className={`${styles.vertical} ${styles.createWindow}`}>
              <div>
                {
                  (true)
                  ?
                    <div className={styles.textEditor}>

                      <div className={styles.editingContent}> 
                        <SimpleEditor content={activeEdit.desc} changeParent={setActiveEdit} currentParent={activeEdit} callback={() => { useDebounce(reMergeContent(activeEdit, activeLocation, props), 2500) }}/>

                        {/* <Button title={"Upload"} onClick={() => setSyncStatus(reMergeContent(activeEdit, activeLocation, props))}></Button> */}
                      </div>
                      

                      <div className={styles.borderRadius}>
                        <TextEditor lan='javascript' placeholder={activeEdit.template_code} onChange={(e) => {
                          let newEdit = activeEdit;
                          newEdit.template_code = e;
                          setActiveEdit(newEdit)

                          useDebounce(reMergeContent(activeEdit, activeLocation, props), 2500);
                          console.log("TEXTEDITOR - CODE")
                        }}/>
                      </div>
                    </div>
                  :
                    <div>{"No Browser..."}</div>
                }
              </div>
          </div>
      </div>
    </div>
  );
}

let lastDebounce = new Date();

const reMergeContent = (newAddition, additionLocation, master) => {
  console.log("CMD RUN");

  if(new Date().getTime() - lastDebounce.getTime() > 2500) {
    if(typeof newAddition.desc !== 'string') {
      newAddition.desc = newAddition.desc.getPlainText();
    }
    
    master.pageData.lessons[additionLocation[0]].sub_lessons[additionLocation[1]] = newAddition;
    
    const db = firebaseClient.firestore();
    const courseId = "S7ioyCGZ1xow6DRyX3Rw" // TEMPVAR
  
    db.doc(`courses/${courseId}`).set(master.pageData).then((doc) => {
      console.log("Update Sucessful.");
    });

    lastDebounce = new Date();
    
    return true;
  }else {
    lastDebounce = new Date();

    return false;
  }
}

const useDebounce = (value, delay) => {
  const [ debouncedValue, setDebouncedValue ] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default HomePage;
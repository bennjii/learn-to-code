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

import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js'

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

type EventTarget = {
  getElementsByTagName: Function
}

const HomePage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const user = props.user;

  const initialData = {
    blocks: [
      {
        key: '16d0k',
        text: 'You can edit this text.',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [{ offset: 0, length: 23, style: 'BOLD' }],
        entityRanges: [],
        data: {},
      },
      {
        key: '98peq',
        text: '',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: 'ecmnc',
        text:
          'Luke Skywalker has vanished. In his absence, the sinister FIRST ORDER has risen from the ashes of the Empire and will not rest until Skywalker, the last Jedi, has been destroyed.',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [
          { offset: 0, length: 14, style: 'BOLD' },
          { offset: 133, length: 9, style: 'BOLD' },
        ],
        entityRanges: [],
        data: {},
      },
      {
        key: 'fe2gn',
        text: '',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: '4481k',
        text:
          'With the support of the REPUBLIC, General Leia Organa leads a brave RESISTANCE. She is desperate to find her brother Luke and gain his help in restoring peace and justice to the galaxy.',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [
          { offset: 34, length: 19, style: 'BOLD' },
          { offset: 117, length: 4, style: 'BOLD' },
          { offset: 68, length: 10, style: 'ANYCUSTOMSTYLE' },
        ],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  }

  let state = {
    editorState: EditorState.createWithContent(convertFromRaw(props.pageData.lessons[props.lessonVariance[0]].sub_lessons[props.lessonVariance[1]].desc)),
    showToolbar: true,
    windowWidth: 0,
    toolbarMeasures: {
      w: 0,
      h: 0,
    },
    selectionMeasures: {
      w: 0,
      h: 0,
    },
    selectionCoordinates: {
      x: 0,
      y: 0,
    },
    toolbarCoordinates: {
      x: 0,
      y: 0,
    },
    showRawData: false,
  }

  const [ editorState, setEditorState ] = useState(state.editorState);
  const [ activeEdit, setActiveEdit ] = useState(props.pageData.lessons[props.lessonVariance[0]].sub_lessons[props.lessonVariance[1]]);
  const [ activeLocation, setActiveLocation ] = useState(props.lessonVariance);

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
                            <div key={index} onClick={(e) => {
                                // if((e.target as HTMLDivElement).getElementsByTagName("A")[0].innerHTML == "-") {
                                //   (e.target as HTMLDivElement).getElementsByTagName("A")[0].innerHTML = "";

                                //   ((e.target as HTMLDivElement).parentElement.getElementsByClassName(styles.collectionArr)[0] as HTMLDivElement).style.height = "0%";
                                //   ((e.target as HTMLDivElement).parentElement.getElementsByClassName(styles.collectionArr)[0] as HTMLDivElement).style.padding = "0%";
                                // }else {
                                //   (e.target as HTMLDivElement).getElementsByTagName("A")[0].innerHTML = "-";

                                //   ((e.target as HTMLDivElement).parentElement.getElementsByClassName(styles.collectionArr)[0] as HTMLDivElement).style.height = "100%";
                                //   ((e.target as HTMLDivElement).parentElement.getElementsByClassName(styles.collectionArr)[0] as HTMLDivElement).style.padding = "1rem";
                                // }
                            }}>
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
                                        <div className={`${styles.changeDefault} ${(props.pageData.lessons[index].sub_lessons[index2] == activeEdit) ? styles.changeActive : ''}`} onClick={() => { 
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
                
                <Button title={"Create"}></Button>
          </div>

          <div className={`${styles.vertical} ${styles.createWindow}`}>
              <div>
                {
                  //props.pageData.lessons[props.lessonVariance[0]][props.lessonVariance[1]].desc
                  
                  (true)
                  ?
                    <div className={styles.textEditor}>
                      <Editor 
                        editorState={editorState}
                        placeholder={`Start Typing a description for ${activeEdit.name}`}
                        spellcheck={true}
                        onChange={(es: EditorState) => { 
                          setEditorState(es);
                          let newEdit = activeEdit;
                          newEdit.desc = es.getCurrentContent();
                          setActiveEdit(newEdit);
                        }}
                      />

                      <div>
                        <Button title={"Upload"} onClick={() => reMergeContent(activeEdit, activeLocation, props)}></Button>
                      </div>
                    </div>
                  :
                    <div>{"No Browser..."}</div>
                }
                
                
              </div>

              {/* <div>
                Template Code Editor
              </div> */}
          </div>
      </div>
    </div>
  );
}

const reMergeContent = (newAddition, additionLocation, master) => {
  const remerged = master.pageData.lessons[additionLocation[0]].sub_lessons[additionLocation[1]] = newAddition;
  console.log(remerged);
}

export default HomePage;
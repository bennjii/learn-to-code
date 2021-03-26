import React, { useEffect, useReducer, useState } from "react";
import nookies from "nookies";

import styles from '../../../../styles/Home.module.css'
import Head from 'next/head'
import Button from '../../../../public/components/button'
import Router from 'next/router'

import TextInput from '../../../../public/components/text_input'

import { EditorState, convertFromRaw, ContentState } from 'draft-js'

import dynamic from 'next/dynamic'
const TextEditor = dynamic(import('../../../../public/components/text_editor'), {
  ssr: false
});

import { convertToRaw } from 'draft-js'

import { firebaseAdmin } from "../../../../firebaseAdmin"
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";

import { SimpleEditor } from '../../../../public/components/editor' 
import { firebaseClient } from "../../../../firebaseClient";
import { useRouter } from 'next/router'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    
    const { uid, email } = token;
    const user = token;

    const db = firebaseAdmin.firestore();
    const courseId = ctx.params.id;
    let pageData;

    await db.doc(`courses/${courseId}`).get().then((doc) => {
      pageData = doc.data()
    }).catch((e) => {
        return {
            redirect: {
              permanent: false,
              destination: "/err",
            },
            props: {} as never,
        };
    })

    const lV = [ parseInt(ctx.params.lesson[0]), parseInt(ctx.params.sub_lesson[0]) ] 

    return {
      props: { message: `Your email is ${email} and your UID is ${uid}.`, user: user, pageData: pageData, lessonVariance: lV, courseId: courseId },
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
  template_code?: string,
  type: string
}

let allowed = true;

const HomePage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const user = props.user;
  const [ activeEdit, setActiveEdit ] = useState(props.pageData.lessons[props.lessonVariance[0]].sub_lessons[props.lessonVariance[1]]);
  const [ activeLocation, setActiveLocation ] = useState(props.lessonVariance);
  const [ overlayVisible, setOverlayVisible ] = useState(false);

  const [ chooseLessonVisible, setChooseLessonVisible ] = useState(false);
  const [ createNewLessonVisible, setCreateNewLessonVisible ] = useState(false);
  const [ syncStatus, setSyncStatus ] = useState(true);

  const [ newLesson, setNewLesson ] = useState({
    desc: convertToRaw(EditorState.createEmpty().getCurrentContent()),
    name: '',
    type: '',
    template_code: ''
  });

  const [ newSection, setNewSection ] = useState({
    name: '',
    desc: '',
    sub_lessons: []
  });

  useEffect(() => {
    console.log("New Edit");
    console.log(activeEdit);

  }, [activeEdit])

  return (
    <div className={styles.container}>
      <Head>
        <title>Learn to Code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`${styles.codeDesc} ${(!overlayVisible) ? styles.lessonsHidden : styles.lessonSelect}`} > {/* hidden={!lessonSelectorVisible}  style={{ display: (!lessonSelectorVisible)? "none" : "block" }}*/}
        <div>
          <div className={styles.subClasses}>
            <h2>{props.pageData.title}</h2>
            <h5>Create Lesson</h5>

            <form action="#">
              <div>
                <h3>TITLE</h3>
                <TextInput placeholder="Enter lesson name" onChange={(e) => {
                  console.log(e);

                  let temp_lesson = newLesson;
                  temp_lesson.name = e.target.value;
                    
                  setNewLesson(temp_lesson);
                }}/>

                <h3>FORMAT</h3>
                <div className={styles.multiChoice}>
                  <div className={`${styles.radialInput} ${(newLesson.type == 'code') ? styles.activeRadialInput : styles.normal}`}  onClick={(e) => {
                      let temp_lesson = newLesson;
                      temp_lesson.type = "code";

                      setNewLesson(temp_lesson);
                    }}>

                    <input type="radio" className={styles.createInputRadial} value={"Interactive"} name={"type"} />

                    <label>Interactive</label>
                  </div>
                  
                  <div className={`${styles.radialInput} ${(newLesson.type == 'learn') ? styles.activeRadialInput : styles.normal}`} onClick={(e) => {
                      let temp_lesson = newLesson;
                      temp_lesson.type = "learn";

                      setNewLesson(temp_lesson);
                    }}>

                    <input type="radio" className={styles.createInputRadial} value={"Learn"} name={"type"}/>

                    <label>Learner</label>
                  </div>
                </div>
              </div>

              <Button title={"Create"} onClick={(e, callback) => {
                e.preventDefault();

                props.pageData.lessons[props.lessonVariance[0]].sub_lessons.push(newLesson);
                const db = firebaseClient.firestore();

                db.doc(`courses/${props.courseId}`).set(props.pageData).then((doc) => {
                  console.log("Update Sucessful.");
                  
                  callback();
                  setNewLesson({
                    desc: convertToRaw(EditorState.createEmpty().getCurrentContent()),
                    name: '',
                    type: ''
                  });
                }).catch(e => {
                  console.log(e);
                });
              }}></Button>
            </form>
          </div>                    
        </div>
      </div>
      <div className={`${(!overlayVisible) ? styles.normalOut : styles.blackOut}`} onClick={() => setOverlayVisible(!overlayVisible)}></div>

      <div className={`${styles.codeDesc} ${(!createNewLessonVisible) ? styles.lessonsHidden : styles.lessonSelect}`} > {/* hidden={!lessonSelectorVisible}  style={{ display: (!lessonSelectorVisible)? "none" : "block" }}*/}
        <div>
          <div className={styles.subClasses}>
            <h2>{props.pageData.title}</h2>
            <h5>Create Section</h5>

            <form action="#">
              <div>
                <h3>TITLE</h3>
                <TextInput placeholder="Enter Section Name" onChange={(e) => {
                  console.log(e);

                  let temp_lesson = newSection;
                  temp_lesson.name = e.target.value;
                    
                  setNewSection(temp_lesson);
                }}/>

                <h3>DESCRPTION</h3>
                <TextInput placeholder="Brief Descrption" onChange={(e) => {
                  console.log(e);

                  let temp_lesson = newSection;
                  temp_lesson.desc = e.target.value;
                    
                  setNewSection(temp_lesson);
                }}/>
              </div>

              <Button title={"Create"} onClick={(e, callback) => {
                e.preventDefault();

                props.pageData.lessons.push(newSection);
                const db = firebaseClient.firestore();

                db.doc(`courses/${props.courseId}`).set(props.pageData).then((doc) => {
                  console.log("Update Sucessful.");
                  
                  callback();
                  setNewSection({
                    name: '',
                    desc: '',
                    sub_lessons: []
                  });
                }).catch(e => {
                  console.log(e);
                });
              }}></Button>
            </form>
          </div>                    
        </div>
      </div>
      <div className={`${(!createNewLessonVisible) ? styles.normalOut : styles.blackOut}`} onClick={() => setCreateNewLessonVisible(!createNewLessonVisible)}></div>

      <div className={`${styles.codeDesc} ${(!chooseLessonVisible) ? styles.lessonsHidden : styles.lessonSelect}`} > {/* hidden={!lessonSelectorVisible}  style={{ display: (!lessonSelectorVisible)? "none" : "block" }}*/}
        <div>
          <div className={styles.subClasses}>
            <h2>{props.pageData.title}</h2>
            <h5>Lesson Plan</h5>

            <br/><br/>

            <div className={styles.lessonSylabusOverview}>
            {
              props.pageData.lessons.map((e, index) => {
                return (
                  <div className={styles.lessonOverviewBlue} onClick={() => {
                    Router.push(`../../../create/${props.pageData.inherit_id}/${index}/0`);
                    setChooseLessonVisible(!chooseLessonVisible);
                  }}>
                    { index+1 }. { e.name }
                  </div>
                )
              })
            }
            </div>
            
            <Button title={"Create New"} onClick={(e, callback) => {
              setCreateNewLessonVisible(!createNewLessonVisible);
              setChooseLessonVisible(!chooseLessonVisible);
              callback();
            }}></Button>
          </div>                    
        </div>
      </div>
      <div className={`${(!chooseLessonVisible) ? styles.normalOut : styles.blackOut}`} onClick={() => setChooseLessonVisible(!chooseLessonVisible)}></div>

      <div className={styles.headerCustom}>
            <div className={styles.headerInsideCustom}>
                <h3 className={styles.headerTitle} onClick={() => Router.push("/")}>Learn to Code.</h3> 

                <h4>{activeEdit.name}</h4>

                <div className={styles.linear}>
                  <a className={(syncStatus) ? styles.syncStatusTrue : styles.syncStatusFalse}>
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
                            <div onClick={() => setChooseLessonVisible(!chooseLessonVisible)}>
                              {e.name}
                            </div>

                            <div className={styles.collectionArr}>
                              {
                                e.sub_lessons.map((e2, index2) => {
                                  return (
                                    <div key={`${index} ${index2}`} className={`${styles.changeDefault} ${(props.pageData.lessons[index].sub_lessons[index2] == props.pageData.lessons[props.lessonVariance[0]].sub_lessons[props.lessonVariance[1]]) ? styles.changeActive : ''}`} onClick={() => { 
                                      setActiveEdit(props.pageData.lessons[index].sub_lessons[index2]);
                                      setActiveLocation([index, index2]);

                                      Router.push(`../../${props.courseId}/${index}/${index2}`);
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
                <Button title={"Create"} onClick={(e, callback) => {
                  setOverlayVisible(!overlayVisible);
                  callback();
                }}></Button>
          </div>

          <div className={`${styles.vertical} ${styles.createWindow}`}>
              <div>
                {
                  (activeEdit.type == 'code')
                  ?
                    <div className={styles.textEditor}>

                      <div className={styles.editingContent}> 
                        <input type="text" placeholder={activeEdit.name} defaultValue={activeEdit.name} onChange={(e) => {
                          let editClone = activeEdit;
                          editClone.name = (e.target.value);
                          setActiveEdit(editClone)

                          setSyncStatus(false);

                          console.log(activeEdit);

                          updateSync(() => {
                            // @ts-ignore
                            reMergeContent(activeEdit, activeLocation, props, setSyncStatus, props.courseId)  
                          })   
                        }}/>

                        <SimpleEditor content={activeEdit.desc} changeParent={setActiveEdit} currentParent={activeEdit} callback={() => { 
                          setSyncStatus(false);

                          updateSync(() => {
                            // @ts-ignore
                            reMergeContent(activeEdit, activeLocation, props, setSyncStatus, props.courseId)  
                          })                       
                        }}/>
                      </div>
                      

                      <div className={styles.borderRadius}>
                        
                        <TextEditor lan='javascript' placeholder={activeEdit.template_code} onChange={(e) => {
                          let newEdit = activeEdit;
                          newEdit.template_code = e;
                          setActiveEdit(newEdit);
                          setSyncStatus(false);

                          updateSync(() => {
                            // @ts-ignore
                            reMergeContent(activeEdit, activeLocation, props, setSyncStatus, props.courseId)    
                          })
                        }}/>
                      </div>
                    </div>
                  :
                    <div className={styles.editingContent}>
                      <SimpleEditor content={activeEdit.desc} changeParent={setActiveEdit} currentParent={activeEdit} callback={() => { 
                          setSyncStatus(false);

                          updateSync(() => {
                            // @ts-ignore
                            reMergeContent(activeEdit, activeLocation, props, setSyncStatus, props.courseId)  
                          })                       
                        }}/>
                    </div>
                }
              </div>
          </div>
      </div>
    </div>
  );
}

let lastDebounce = new Date();

const updateSync = (callback) => {
    lastDebounce = new Date();

    setTimeout(() => { 
      if(new Date().getTime() - lastDebounce.getTime() >= 2500) {
        lastDebounce = new Date();
        return callback();
      }
    }, 2500);
}

const reMergeContent = (newAddition, additionLocation, master, callback: Function, courseId: string) => {
  if(!newAddition.desc.blocks) {
    newAddition.desc = convertToRaw(newAddition.desc);
  } 

  master.pageData.lessons.forEach((e, i) => {
    e.sub_lessons.forEach((__e, k) => {
      if(!__e.desc.blocks) {
        console.log(`ATTEMPTING TO CONVERT:`);
        console.log(master.pageData.lessons[i].sub_lessons[k])
        master.pageData.lessons[i].sub_lessons[k].desc = convertToRaw(__e.desc);
      } 

      // console.log(master.pageData.lessons[i].sub_lessons[k].desc);
    })
  })
  
  master.pageData.lessons[additionLocation[0]].sub_lessons[additionLocation[1]] = newAddition;
  
  const db = firebaseClient.firestore();
  // db.doc(`courses/${courseId}`).set(master.pageData).then((doc) => {
  //   console.log("Update Sucessful.");
  //   lastDebounce = new Date();

  //   callback(true);
  // }).catch(e => {
  //   callback(false);
  // });
}

export default HomePage;
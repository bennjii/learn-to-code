import React, { useEffect } from "react";
import nookies from "nookies";

import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Button from '../public/components/button'
import Footer from '../public/components/footer'

import Header from "../public/components/header"
import Router from 'next/router'

import { firebaseAdmin } from "../firebaseAdmin"
import { firebaseClient } from "../firebaseClient";

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
    const userData = await (await db.doc(`users/${user.uid}`).get()).data();

    if(userData.date) {
      console.log(86400000 - (new Date().getTime() - userData.date));

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

    let pageData = [];

    for(let i = 0; i < userData.courses.length; i++){
      const data = await (await db.doc(`courses/${userData.courses[i]._loc}`).get()).data();
      pageData.push(data);
    }

    return {
      props: { userData, pageData, user },
    };
  } catch (err) {
    console.log(err);
    
    return {
      redirect: {
        permanent: false,
        destination: "/auth",
      },
      props: {} as never,
    };
  }
};

function capitalize (value) {
  var textArray = value.split(' ')
  var capitalizedText = ''
  for (var i = 0; i < textArray.length; i++) {
    capitalizedText += textArray[i].charAt(0).toUpperCase() + textArray[i].slice(1) + ' '
  }
  return capitalizedText
}

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
        {
          (props.userData.account_type == "student")
          ?
          <div className={styles.insideFullScreen}>
            <div>
              {
                props.userData.courses.map((e, index) => {
                  return (
                    <div className={styles.boxDiv} key={index}>
                      <div>
                        <div>
                          <h4>COURSE</h4>
                          <h1>{e.title}</h1>
                        </div>
                        
                        <div className={styles.boxProgress}>
                          <h5>{e.progress ?  (e.finished) ? 100 : (e.progress * 100) : 0 }% Progress</h5>

                          <div className={styles.progressBar}>
                            <div style={{ width: `${e.progress ?  (e.finished) ? 100 : (e.progress * 100) : 0 }%` }}></div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.progress}>
                        <h4>{e.lesson+1} : { props.pageData[index].lessons[e.lesson].name}</h4> 
                        <div>
                          {
                            (e.sub_lesson <= 0) ?
                              <></>
                            :
                              <div className={styles.first}>
                                <div className={styles.circle}><h6>{e.lesson+1}.{e.sub_lesson}</h6></div>
                                <h5>{capitalize(props.pageData[index].lessons[e.lesson].sub_lessons[e.sub_lesson-1].type)}</h5>
                                <p>{props.pageData[index].lessons[e.lesson].sub_lessons[e.sub_lesson-1].name}</p>
                              </div>
                          }
                          
                          <div className={styles.active}>
                            <div className={styles.circle}><h6>{e.lesson+1}.{e.sub_lesson+1}</h6></div>
                            <h5>{capitalize(props.pageData[index].lessons[e.lesson].sub_lessons[e.sub_lesson].type)}</h5>
                            <p>{props.pageData[index].lessons[e.lesson].sub_lessons[e.sub_lesson].name}</p>
                          </div>

                          {
                            (!props.pageData[index].lessons[e.lesson].sub_lessons[e.sub_lesson+1]) ?
                              <></>
                            :
                              <div className={styles.first}>
                                <div className={styles.circle}><h6>{e.lesson+1}.{(e.sub_lesson+1) +1}</h6></div>
                                <h5>{capitalize(props.pageData[index].lessons[e.lesson].sub_lessons[e.sub_lesson+1].type)}</h5>
                                <p>{props.pageData[index].lessons[e.lesson].sub_lessons[e.sub_lesson+1].name}</p>
                              </div>
                          }
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
                    <h1><strong>{props.userData.streak}</strong> <i>Days</i></h1>
                  </div>
                </div>
              </div>
            </div>       
          </div>
          :
          <div className={styles.insideFullScreen}>
            <div>
              {
                props.userData.courses.map(e => {
                  if(process.browser) {
                    firebaseClient.firestore().doc(`courses/${e._loc}`).get().then(doc => {
                      console.log(doc.data())
                      return (
                        <div>
                          {
                            doc.data().lessons[e.lesson].name
                            //sub_lessons[e.sub_lessons]
                          }
                        </div>
                      );
                    });
                  }

                  return (
                    <div className={styles.boxDiv}>
                      <div className={styles.adminCourses}>
                        <div>
                          <h4>COURSE</h4>
                          <h1>{e.title}</h1>
                        </div>   
                    
                        <div className={styles.adminButtons}>
                          {/* /create/S7ioyCGZ1xow6DRyX3Rw/0/0 */}
                          <button onClick={() => Router.push(`/course/${e._loc}`)}>
                            View Syllabus
                          </button>

                          <Button title="Resume Editing" redirect={`/create/${e._loc}/${e.lesson}/${e.sub_lesson}`} router={Router}/>
                        </div>                   
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
                    <h4>CREATE</h4>

                    <h1>Create a Course</h1>

                    <br/>
                    <Button title={"Create"} onClick={() => {
                      let id; // eeee
                      firebaseClient.firestore().collection(`courses`).add({
                        desc: "...",
                        dificulty: 1,
                        inherit_id: "",
                        language: "",
                        lessons: [],
                        title: ""
                      }).then(e => {
                        id = e.id;
                      });

                      firebaseClient.firestore().collection(`course_index`).add({
                        _short: "...",
                        colour: "#f8efa7",
                        desc: "...",
                        link: "",
                        lessons: [],
                        title: ""
                      })
                    }}></Button>
                  </div>
                </div>
              </div>
            </div>       
          </div>
        }
        
      </div>
      
		  <Footer />
    </div>
  );
}

export default HomePage;
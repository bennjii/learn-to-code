import styles from '../styles/Home.module.css'
import * as React from 'react'
import { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cookie from 'js-cookie';
import 'firebase/auth'

import Button from '../public/components/button'
import TextInput from '../public/components/text_input'

import {
    faLock,
    faEnvelope,
    faUser,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons'

import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons'
import Router from 'next/router'

import { firebaseClient } from '../firebaseClient';

let submitting = false;

const tokenName = 'tokenName';

firebaseClient.auth().onAuthStateChanged(async (user: firebaseClient.User) => {
  if (user) {
    const token = await user.getIdToken();
    cookie.set(tokenName, token, { expires: 1 });
  } else {
    cookie.remove(tokenName);
  }
});

const login = async (e) => {
    const form = e.nativeEvent.target;
    if(!form[0].value || !form[1].value) return false;

    let _status = null;

    await firebaseClient.auth().signInWithEmailAndPassword(form[0].value, form[1].value)
    .then((user) => {
        Router.push("/")
    })
    .catch(async (error) => {
        _status = { error_code: await e.code, error_message: await e.message };
        console.log(`${e.code} [::] ${e.message}`);
    });

    return _status;
}

const submitForm = async (event) => {
    const form = event.nativeEvent.target;
    if(!form[0].value || !form[1].value || !form[2].value) return false;

    if(submitting) return false;
    submitting = true;

    for(var i = 0; i < form.size; i++) {
        console.log(form[i].value)
    }

    let _status = null;

    await firebaseClient.auth().createUserWithEmailAndPassword(form[1].value, form[2].value)
    .then(e => {
        e.user.updateProfile({
            displayName: form[0].value
        }).then(async a => {
            await firebaseClient.firestore().collection(`users`).doc(e.user.uid).get()
            .then(async doc =>  {
                let document = await doc;
                
                (!document.exists) 
                ?
                    await firebaseClient.firestore().collection(`users`).doc(e.user.uid).set({
                        account_type: 'student',
                        courses: [],
                        badges: []
                    }).then(e => {
                        Router.push("/")
                    })
                :
                    Router.push("/")
            });

            Router.push("/");
            return null;
        });
    }).catch(async e => {
        console.log(`${e.code} [::] ${e.message}`);
        _status = { error_code: await e.code, error_message: await e.message };

        return { error_code: e.code, error_message: e.message };
    });

    return _status;
}

function handleSocialSignin(prov) {
    var provider;

    if(prov == "Google")
        provider = new firebaseClient.auth.GoogleAuthProvider();
    else if(prov == "Github")
        provider = new firebaseClient.auth.GithubAuthProvider();
    else return 0

    const result = firebaseClient.auth()
    .signInWithPopup(provider)
    .then(async (result) =>  {
        console.log(firebaseClient.firestore().collection(`users`).doc(result.user.uid).get());

        await firebaseClient.firestore().collection(`users`).doc(result.user.uid).get()
        .then(async doc =>  {
            let document = await doc;
            
            (!document.exists) 
            ?
                await firebaseClient.firestore().collection(`users`).doc(result.user.uid).set({
                    account_type: 'student',
                    courses: [],
                    badges: []
                }).then(e => {
                    Router.push("/")
                })
            :
                Router.push("/")
            
            return null;
        });
    }).catch((e) => {
        console.log(`${e.code} [::] ${e.message}`);
        return e;
    });

    return result;
}

import nookies from "nookies";
import { firebaseAdmin } from "../firebaseAdmin"
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import Header from '../public/components/header';
import Head from 'next/head';
import { userInfo } from 'os';

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
        props: { user: null }
      }
    }
  };

const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    if(props.user && process.browser) Router.push('./');

    const [ isProgrammer, setIsProgrammer ] = useState<boolean>(true);
    const [ authError, setAuthError ] = useState(null);
    const [ authMessage, setAuthMessage ] = useState(null);

    const toggleSignup = () => {
        setIsProgrammer(!isProgrammer)        
    }

    useEffect(() => {
        if(authError)
            authError.then(e => {
                setAuthMessage(e)
            });
    }, [authError])

    return (
        <div className={styles.authPage}>
            <Head>
                <title>Learn to Code</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.flexLarge}>
                <h5 onClick={() => Router.push("/")} className={styles.backToHome}>Learn To Code</h5>

                <h1>
                    Learn to Code. <br/>
                    Interactively. <br/>
                    For Free.
                </h1>

                {/* <h5 style={{ justifySelf: 'flex-end' }}>A Saint Kentigern Initiative</h5> */}
                <p> 
                    <a href="https://github.com/UnRealReincarlution">
                        <FontAwesomeIcon
                            icon={faGithub}
                            size="1x"
                        />
                    </a>
                    &nbsp; 
                    UnRealReincarlution 
                </p>

                {
                    (props.user)
                    ?
                    <div className={styles.signinBubble}onClick={() => Router.push("/")}>
                        <div>
                            <h3>Continue As</h3>
                            <h2>{props.user.name}</h2>
                        </div>
                        
                        <FontAwesomeIcon
                        icon={faChevronRight}
                        size="1x"
                        />
                    </div>
                    :
                    <></>
                }
                
            </div>

            <div className={styles.authInput}>
                <h1 style={{  margin: '0' }}> 
                    Learn to Code
                </h1>

                <p>
                    Master languages of front-end <br/> and back-end development
                </p>

                <br/>

                {
                    (isProgrammer)
                    ?
                    <div>
                        <form onSubmit={(e) => { setAuthError(submitForm(e)); e.preventDefault() }} method="POST">
                            <TextInput placeholder="Enter your Username" icon={faUser} />

                            <TextInput placeholder="Enter your Email" icon={faEnvelope} />

                            <TextInput placeholder="Enter your Password" icon={faLock} />

                            <Button title="Start coding now" redirect="" router={Router} />
                        </form>
                    </div>
                    :
                    <div>
                        <form onSubmit={(e) => { setAuthError(login(e)); e.preventDefault() }} method="POST">
                            <TextInput placeholder="Enter your Email" icon={faEnvelope} />

                            <TextInput placeholder="Enter your Password" icon={faLock} />

                            <Button title="Start coding now"  redirect="" router={Router}/>
                        </form>
                    </div>
                }

                <br />
                
                {
                    (authError && authMessage) && 
                    <div className={styles.authError}>
                        <p>{authMessage.error_message}</p>
                    </div>
                }

                <br />
                
                <h6>Or continue with a social profile</h6>
                
                <div className={styles.socialProfiles}>
                    <div className={styles.socialProfile} onClick={() => handleSocialSignin("Google")}>
                        <FontAwesomeIcon
                        icon={faGoogle}
                        size="1x"
                        />

                        <h5>Google</h5>
                    </div>

                    <div className={styles.socialProfile} onClick={() => handleSocialSignin("Github")}>
                        <FontAwesomeIcon
                        icon={faGithub}
                        size="1x"
                        />

                        <h5>Github</h5>
                    </div>
                </div>

                <h5 style={{ textAlign: 'center' }}>{(isProgrammer ? "Already a member? " : "Want to join us? " )} <a onClick={toggleSignup}>{(isProgrammer ? "Login" : "Signup" )}</a></h5>
            </div>
        </div>
    )
}

export default Home

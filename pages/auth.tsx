import styles from '../styles/Home.module.css'
import * as React from 'react'
import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cookie from 'js-cookie';
import firebase from 'firebase'
import 'firebase/auth'

import {
    faLock,
    faEnvelope,
    faUser,
    IconDefinition,
    faCircleNotch
} from '@fortawesome/free-solid-svg-icons'

import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons'
import Router from 'next/router'

import { firebaseClient } from '../firebaseClient';

let submitting = false;

const tokenName = 'tokenName';

firebaseClient.auth().onAuthStateChanged(async (user: firebase.User) => {
  if (user) {
    const token = await user.getIdToken();
    cookie.set(tokenName, token, { expires: 1 });
  } else {
    cookie.remove(tokenName);
  }
});

function login(e) {
    const form = e.nativeEvent.target;
    if(!form[0].value || !form[1].value) return false;

    firebaseClient.auth().signInWithEmailAndPassword(form[0].value, form[1].value)
    .then((user) => {
        Router.push("/")
    })
    .catch((error) => {
        console.log(`${e.code} [::] ${e.message}`);
    });
}

function submitForm(event) {
    const form = event.nativeEvent.target;
    if(!form[0].value || !form[1].value || !form[2].value) return false;

    if(submitting) return false;
    submitting = true;

    for(var i = 0; i < form.size; i++) {
        console.log(form[i].value)
    }

    firebaseClient.auth().createUserWithEmailAndPassword(form[1].value, form[2].value)
    .then(e => {
        e.user.updateProfile({
            displayName: form[0].value
        }).then(a => {
            Router.push("/")
        })
    }).catch(e => {
        console.log(`${e.code} [::] ${e.message}`);

        // TODO: Handle and Show user Errors regarding - Email, Password Etc...
    })
}

function handleSocialSignin(prov) {
    var provider;

    if(prov == "Google")
        provider = new firebase.auth.GoogleAuthProvider();
    else if(prov == "Github")
        provider = new firebase.auth.GithubAuthProvider();
    else return 0

    firebaseClient.auth()
    .signInWithPopup(provider)
    .then((result) => {
        Router.push("/")
    }).catch((e) => {
        console.log(`${e.code} [::] ${e.message}`);
    });
}

function Home() {
    const [isProgrammer, setIsProgrammer] = useState<boolean>(true)

    const toggleSignup = () => {
        setIsProgrammer(!isProgrammer)        
    }

    return (
        <div className={styles.authPage}>
            <title>l2c</title>
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
                        <form onSubmit={(e) => { submitForm(e); e.preventDefault() }} method="POST">
                            <TextInput placeholder="Enter your Username" icon={faUser} />

                            <TextInput placeholder="Enter your Email" icon={faEnvelope} />

                            <TextInput placeholder="Enter your Password" icon={faLock} />

                            <Button title="Start coding now" />
                        </form>
                    </div>
                    :
                    <div>
                        <form onSubmit={(e) => { login(e); e.preventDefault() }} method="POST">
                            <TextInput placeholder="Enter your Email" icon={faEnvelope} />

                            <TextInput placeholder="Enter your Password" icon={faLock} />

                            <Button title="Start coding now" />
                        </form>
                    </div>
                }
                
                
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

interface Input {
    active: boolean,
    hovered: boolean,
    value: string,
    activated: boolean
}

class TextInput extends React.Component<{icon: IconDefinition, placeholder: string}, Input> {
    constructor(props) {
        super(props)

        this.state = { active: false, hovered: false, value: '', activated: false }
        this.activate = this.activate.bind(this);
        this.deactivate = this.deactivate.bind(this);

        this.handleInput = this.handleInput.bind(this);
    }

    activate() {
        this.setState({ active: true })
    }

    deactivate() {
        this.setState({ active: false })
    }

    handleInput(e) {
        this.setState({ value: e.target.value });
    }

    render() {
        return (
            <div className={(this.state.active) ? `${styles.activeAuthInput} ${styles.authenticationInput}` : (this.state.value !== "") ? `${styles.idle} ${styles.authenticationInput}` : `${styles.authenticationInput}`}>
                <FontAwesomeIcon
                  icon={this.props.icon}
                  size="1x"
                />

                <input onChange={this.handleInput} type={(this.props.icon == faLock ? "password" : (this.props.icon == faEnvelope) ? "email" : "text")} placeholder={this.props.placeholder} onFocus={this.activate} onBlur={this.deactivate} required/>
            </div>
        )
    }
}

class Button extends React.Component<{title: string}, Input> {
    constructor(props) {
        super(props)

        this.state = { active: false, hovered: false, value: '', activated: false }

        this.activate = this.activate.bind(this);
        this.deactivate = this.deactivate.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    activate() {
        this.setState({ active: true })
    }

    deactivate() {
        this.setState({ active: false })
    }

    handleClick() {
        
        this.setState({ activated: true });
    }

    render() {
        return (
            <button type="submit" onClick={this.handleClick} className={(this.state.hovered) ? `${styles.hoverButton} ${styles.button}` : `${styles.button}`} onMouseOver={() => this.setState({ hovered: true })} onMouseLeave={() => this.setState({ hovered: false })}>
                {
                    (!this.state.activated)
                    ?
                    this.props.title
                    :
                    <FontAwesomeIcon
                    icon={faCircleNotch}
                    size="1x"
                    spin
                    />
                }
            </button>
        )
    }
}
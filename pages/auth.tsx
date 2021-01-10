import styles from '../styles/Home.module.css'
import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
    faLock,
    faEnvelope,
    faUser,
    IconDefinition
} from '@fortawesome/free-solid-svg-icons'

import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons'

function submitForm(e) {
    const form = e.nativeEvent.target;

    for(var i = 0; i < form.size; i++) {
        console.log(form[i].value)
    }
}

function formHandler() {
    
}

export default function Home() {
  return (
    <div className={styles.authPage}>
        <div className={styles.flexLarge}>
            <h5>L2C</h5>

            <h1>
                Learn to Code. <br/>
                Interactively. <br/>
                For Free.
            </h1>
        </div>

        <div className={styles.authInput}>
            <h1 style={{  margin: '0' }}> 
                Learn to Code
            </h1>

            <p>
                Master languages of front-end and back-end development
            </p>

            <br/>

            <div>
                <form onSubmit={(e) => { submitForm(e); e.preventDefault() }} method="POST">
                    <TextInput placeholder="Enter your Username" icon={faUser} onChangeHandler={() => formHandler()}/>

                    <TextInput placeholder="Enter your Email" icon={faEnvelope} />

                    <TextInput placeholder="Enter your Password" icon={faLock} />

                    <Button title="Start coding now"/>
                </form>
                
            </div>
            
            <h6>Or continue with a social profile</h6>
            
            <div className={styles.socialProfiles}>
                <div className={styles.socialProfile}>
                    <FontAwesomeIcon
                    icon={faGoogle}
                    size="1x"
                    />

                    <h5>Google</h5>
                </div>

                <div className={styles.socialProfile}>
                    <FontAwesomeIcon
                    icon={faGithub}
                    size="1x"
                    />

                    <h5>Github</h5>
                </div>
            </div>

            <h5 style={{ textAlign: 'center' }}>Already a member? <a>Login</a></h5>
        </div>
    </div>
  )
}



interface Input {
    active: boolean,
    hovered: boolean,
    value: string
}

class TextInput extends React.Component<{icon: IconDefinition, placeholder: string}, Input> {
    constructor(props) {
        super(props)

        this.state = { active: false, hovered: false, value: '' }
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

        this.state = { active: false, hovered: false }
        this.activate = this.activate.bind(this);
        this.deactivate = this.deactivate.bind(this);
    }

    activate() {
        this.setState({ active: true })
    }

    deactivate() {
        this.setState({ active: false })
    }

    render() {
        return (
            <button type="submit" className={(this.state.hovered) ? `${styles.hoverButton} ${styles.button}` : `${styles.button}`} onMouseOver={() => this.setState({ hovered: true })} onMouseLeave={() => this.setState({ hovered: false })}>
                {this.props.title}
            </button>
        )
    }
}
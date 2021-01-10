import styles from '../styles/Home.module.css'
import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
    faLock,
    faEnvelope,
    faUser,
    IconDefinition
} from '@fortawesome/free-solid-svg-icons'

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
            <h3 style={{  margin: '0' }}> 
                Learn to Code
            </h3>

            <p>
                Master languages of front-end and back-end development
            </p>

            <div>
                <TextInput placeholder="Enter your Email" icon={faEnvelope} />

                <TextInput placeholder="Enter your Username" icon={faUser} />

                <TextInput placeholder="Enter your Password" icon={faLock} />
            </div>
        </div>
    </div>
  )
}

interface Input {
    active: boolean
}

class TextInput extends React.Component<{icon: IconDefinition, placeholder: string}, Input> {
    constructor(props) {
        super(props)

        this.state = { active: false }
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
            <div className={(this.state.active) ? `${styles.activeAuthInput} ${styles.authenticationInput}` : `${styles.authenticationInput}`}>
                <FontAwesomeIcon
                  icon={this.props.icon}
                  size="1x"
                />

                <input type="text" placeholder={this.props.placeholder} onFocus={this.activate} onBlur={this.deactivate} />
            </div>
        )
    }
}
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../../styles/Home.module.css'

import {
    faLock,
    faEnvelope,
    IconDefinition
} from '@fortawesome/free-solid-svg-icons'

interface Input {
    active: boolean,
    hovered: boolean,
    value: string,
    activated: boolean
}

class TextInput extends React.Component<{icon?: IconDefinition, onChange?: Function, placeholder: string}, Input> {
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

        if(this.props.onChange) {
            this.props.onChange(e);
        }
    }

    render() {
        return (
            <div className={(this.state.active) ? `${styles.activeAuthInput} ${styles.authenticationInput}` : (this.state.value !== "") ? `${styles.idle} ${styles.authenticationInput}` : `${styles.authenticationInput}`}>
                {
                    (this.props.icon)
                    ?
                    <FontAwesomeIcon
                        icon={this.props.icon}
                        size="1x"
                        />
                    :
                    <div></div>
                }
                

                <input onChange={this.handleInput} type={(this.props.icon == faLock ? "password" : (this.props.icon == faEnvelope) ? "email" : "text")} placeholder={this.props.placeholder} onFocus={this.activate} onBlur={this.deactivate} required/>
            </div>
        )
    }
}

export default TextInput
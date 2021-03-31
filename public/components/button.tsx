import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../../styles/Home.module.css'

import {
    faCircleNotch
} from '@fortawesome/free-solid-svg-icons'
import { SingletonRouter } from 'next/router'

interface Input {
    active: boolean,
    hovered: boolean,
    value: string,
    activated: boolean
}

class Button extends React.Component<{title: string, redirect?: string | never, router?: SingletonRouter | never, onClick?: Function, disabled?: boolean}, Input> {
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

    handleClick(e) {
        this.setState({ activated: true });

        if(this.props.onClick) { 
            this.props.onClick(e, (e) => { this.setState({ activated: false }) });
        }
        
        if(this.props.redirect) {
            this.props.router.push(this.props.redirect);
            this.setState({ activated: false });
        }
    }

    render() {
        return (
            <button 
                type="submit" 
                onClick={this.handleClick}  
                className={(this.state.hovered) ? `${styles.hoverButton} ${styles.button} ${(this.props.disabled) ? styles.buttonDisabled : styles.buttonEnabled}` : `${(this.props.disabled) ? styles.buttonDisabled : styles.buttonEnabled} ${styles.button}`} 
                onMouseOver={() => this.setState({ hovered: true })} 
                onMouseLeave={() => this.setState({ hovered: false })}
                disabled={this.props?.disabled}
            >
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

export default Button;
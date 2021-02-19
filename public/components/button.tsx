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
        if(this.props.onClick) this.props.onClick(e);

        this.setState({ activated: true });

        if(this.props.redirect) {
            this.props.router.push(this.props.redirect)
        }
    }

    render() {
        return (
            <button type="submit" onClick={this.handleClick} style={(this.props.disabled) ? { backgroundColor: 'rgb(98 104 112 / 20%)', color: 'rgba(255,255,255,.1)' } : {}}  className={(this.state.hovered) ? `${styles.hoverButton} ${styles.button}` : `${styles.button}`} onMouseOver={() => this.setState({ hovered: true })} onMouseLeave={() => this.setState({ hovered: false })}>
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
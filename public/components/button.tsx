import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../../styles/Home.module.css'

import {
    faCircleNotch
} from '@fortawesome/free-solid-svg-icons'

interface Input {
    active: boolean,
    hovered: boolean,
    value: string,
    activated: boolean
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

export default Button;
import React, { useState } from 'react'
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

const TextInput: React.FC<{icon?: IconDefinition, onChange?: Function, placeholder: string}> = ({icon, onChange, placeholder}) => {
    const [ state, setState ] = useState({ active: false, hovered: false, value: '', activated: false });

    const activate = () => {
        setState({ ...state, active: true });
    }

    const deactivate = () => {
        setState({ ...state, active: false });
    }

    const handleInput = (e) => {
        setState({ ...state, value: e.target.value })

        if(onChange) {
            onChange(e);
        }
    }

    return (
        <div className={(state.active) ? `${styles.activeAuthInput} ${styles.authenticationInput}` : (state.value !== "") ? `${styles.idle} ${styles.authenticationInput}` : `${styles.authenticationInput}`}>
            {
                (icon)
                ?
                <FontAwesomeIcon
                    icon={icon}
                    size="1x"
                    />
                :
                <div></div>
            }
            

            <input onChange={handleInput} type={(icon == faLock ? "password" : (icon == faEnvelope) ? "email" : "text")} placeholder={placeholder} onFocus={activate} onBlur={deactivate} required/>
        </div>
    )
}

export default TextInput
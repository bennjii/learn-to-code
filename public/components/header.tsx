import React from 'react'
import styles from '../../styles/Home.module.css'

import { firebaseAdmin } from '../../firebaseAdmin'
import { SingletonRouter } from 'next/router'

class Header extends React.Component<{user: firebaseAdmin.auth.DecodedIdToken, progress: number, loading: boolean, router: SingletonRouter}, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={styles.header}>
                <div className={styles.headerProgress} style={{ width: `${this.props.progress}% !important`, opacity: (this.props.loading) ? "1" : "0" }}></div>

                <div className={styles.headerInside}>
                    <div className={styles.linear}>
                        <h3 className={styles.headerTitle} onClick={() => this.props.router.push("/")}>Learn to Code.</h3> 

                        <a href="">Dashboard</a>
                        <a href="">Courses</a>
                        <a href="">My Account</a>
                    </div>
                    
                    {(!this.props.user) 
                        ? 
                        <a>Login</a>
                        :
                        <div className={styles.linear}>
                        <a onClick={() => this.props.router.push("/account")}>{this.props.user.name}</a>
                        {/* <a onClick={() => firebaseClient.auth().signOut()}>Signout</a> */}
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Header
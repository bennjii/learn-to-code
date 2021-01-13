import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import * as React from 'react'

import { useAuth } from '../auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { InferGetServerSidePropsType } from "next"
import authenticateUser from '../clientAuth'
import { firebaseClient } from '../firebaseClient'

import {
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons'

export default function Home(props: InferGetServerSidePropsType<typeof authenticateUser>) {  
    const user = useAuth();
    const currentUser = firebaseClient.auth().currentUser;

    return (
        <div className={styles.container}>
        <Head>
            <title>Learn to Code</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.header}>
            <h3>Learn to Code.</h3> 

            <div className={styles.linear}>
            <a href="">Dashboard</a>
            <a href="">Courses</a>
            <a href="">My Account</a>
            </div>
            
            {(!user) 
            ? 
            <a >Login</a>
            :
            <div className={styles.linear}>
                <h5>{currentUser.displayName}</h5>
                {/* <a onClick={() => firebaseClient.auth().signOut()}>Signout</a> */}
            </div>
            }
        </main>

        <div className={styles.body}>
            <h1>Good Evening, {currentUser.displayName}</h1>
        </div>

        <div className={styles.fullScreen}>
            <div className={styles.insideFullScreen}>
            <div className={styles.boxDiv}>
                <h4>COURSE</h4>
                <h1>Learn Javascript</h1>

                <Button title="Resume"/>
            </div>
            </div>
            
        </div>
        </div>
    )
}

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

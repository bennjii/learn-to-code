import Head from 'next/head'
import styles from '../styles/Home.module.css'
import * as React from 'react'

import firebase from "firebase"

import { useAuth } from '../auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons'

Home.getInitialProps = async (ctx) => {
  return { ctx }
}

export default function Home(ctx) {
  useAuth();

  const user = firebase.auth().currentUser

  if(!user) {
    if (ctx.res) {
      ctx.res.writeHead(301, {
        Location: 'auth'
      });
      ctx.res.end();
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Learn to Code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.header}>
        <div>
          <div className={styles.linear}>
            <h3 className={styles.headerTitle}>Learn to Code.</h3> 

            <a href="">Dashboard</a>
            <a href="">Courses</a>
            <a href="">My Account</a>
          </div>
          
          {(!user) 
            ? 
            <a>Login</a>
            :
            <div className={styles.linear}>
              <h5>{user.displayName}</h5>
              {/* <a onClick={() => firebaseClient.auth().signOut()}>Signout</a> */}
            </div>
          }
        </div>
      </main>

      <div className={styles.body}>
        <h1>Good {(new Date().getHours() < 13) ? (new Date().getHours() > 10) ? "Day" : "Morning" : (new Date().getHours() < 20) ? "Afternoon" : "Evening"}, {user.displayName}</h1>
      </div>

      <div className={styles.fullScreen}>
        <div className={styles.insideFullScreen}>
          <div>
            <h2>Learn</h2>

            <div className={styles.boxDiv}>
              <div>
                <div>
                  <h4>COURSE</h4>
                  <h1>Learn Javascript</h1>
                </div>
                
                <div>
                  <h5>27% Progress</h5>

                  <div className={styles.progressBar}>
                    <div style={{ width: "27%" }}></div>
                  </div>
                </div>
              </div>
              
              <p>In this course, you will learn about the in's and out's of the JavaScript Language, starting with the basics.</p>

              <div className={styles.progress}>
                <h4>1 Variables</h4>

                <div>
                  <div className={styles.first}>
                    <div className={styles.circle}><h6>1.2</h6></div>
                    <h5>Lesson</h5>
                    <p>Constants</p>
                  </div>

                  <div className={styles.active}>
                    <div className={styles.circle}><h6>1.3</h6></div>
                    <h5>Lesson</h5>
                    <p>Assignment</p>
                  </div>

                  <div>
                    <div className={styles.circle}><h6>1.4</h6></div>
                    <h5>Lesson</h5>
                    <p>Mutation</p>
                  </div>
                </div>
              </div>

              <div>
                <button>
                  View Syllabus
                </button>

                <Button title="Resume Learning"/>
              </div>
              
            </div>
          </div>

          <div>
            <h2>Contact</h2>

            <div className={styles.boxDiv}>
              <div>
                <div>
                  <h1>EDENS NOODLE SHOP</h1>
                </div>
              </div>

              <Button title="Resume"/>
            </div>
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

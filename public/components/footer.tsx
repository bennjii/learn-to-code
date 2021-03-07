import React from 'react'
import styles from '../../styles/Home.module.css'

import Button from "./button"

class Footer extends React.Component<{}, {theme: string}> {
    constructor(props) {
        super(props);

        this.state = { 
            theme: (process.browser) ?
                localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light' 
                :
                'light'
        }

        this.toggleTheme = this.toggleTheme.bind(this);
    }

    toggleTheme() {
        const theme = (this.state.theme == 'light') ? 'dark' : 'light';
        this.setState({ theme: theme });

        document.documentElement.setAttribute("theme", theme);
        localStorage.setItem('theme', theme);
    }

    render() {
        if(process.browser) document.documentElement.setAttribute('theme', this.state.theme);

        return (
            <div className={styles.footer}>
                <div>
                    <div>
                        <h1>{"</>"}</h1>
                    </div>

                    <div className={styles.footerContent}>
                        <div>
                            <h3>Languages</h3>
                            <p>Javascript</p>
                            <p>Typescript</p>
                            <p>Python</p>
                            <p>C++</p>
                            <p>HTML & CSS</p>
                        </div>

                        <div>
                            <h3>L2C</h3>
                            <p>Our Origin</p>
                            <p>Contact Us</p>
                            <p>Support</p>
                            <p>Tutoring</p>
                        </div>
                    </div>

                    <div>
                        <h5>Contact Us</h5>
                        <input type="text" placeholder={"Email Us"} className={styles.authenticationInput}/>
                        
                        <div className={styles.footerSpacing}>
                            <Button title={"Toggle Theme"} onClick={this.toggleTheme}></Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer
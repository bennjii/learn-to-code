import AceEditor from 'react-ace';

import styles from '../../styles/Home.module.css'
import brace from 'brace';
import "brace/theme/solarized_dark";
import "brace/theme/tomorrow_night";

import 'brace/theme/github';
import "brace/mode/javascript"

import React from 'react'
import Button from './button';

import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface Console {
    language: string,
    output: string,
    ran: boolean,
    stderr: string,
    stdout: string,
    version: string
}

class TextEditor extends React.Component<{lan: string, onChange: Function, placeholder: string}, {console: Console, consoleVisible: boolean, value: string}> {
    constructor(props) {
        super(props);

        this.state = { console: null, consoleVisible: true, value: this.props.placeholder };
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.props.onChange(e);

        this.setState({ value: e });
    }
    
    render() {
        return (
            <div className="textEditor">
                <div className={styles.textEditorToolbar}>
                    <h5>main.js</h5> 

                    <Button title={"Run"} onClick={async (e, callback) => {
                        const response = await axios.post(
                            "https://emkc.org/api/v1/piston/execute",
                            {
                                "language": this.props.lan,
                                "source": this.state.value,
                                "args": []
                            },
                            { headers: {'Content-Type': 'application/json'} }
                        ).then((res) => {
                            callback();
                            return res;
                        })

                        this.setState({ console: response.data, consoleVisible: false });
                    }}/>
                </div>
                
                <AceEditor
                    mode={`${this.props.lan}`}
                    theme="solarized_dark"
                    // @ts-ignore
                    onChange={this.onChange}
                    name="editor"
                    editorProps={{
                        $blockScrolling: true
                    }}
                    fontSize={"16px"}
                    height=''
                    width='100%'
                    value={this.state.value}
                    tabSize={2}
                />

                <div className={styles.textEditorFooter}>
                    <div className={styles.textEditorFooterSticky}>
                        <p>CONSOLE</p>

                        <FontAwesomeIcon icon={(!this.state.consoleVisible) ? faChevronUp : faChevronDown} onClick={() => {
                            this.setState({ consoleVisible: !this.state.consoleVisible });
                        }}/>
                    </div>

                    <div hidden={this.state.consoleVisible} className={styles.consoleElement}>
                        <p className={`${styles.consoleHeader} ${(!this.state.console?.stderr) ? styles.consoleCompiled : styles.consoleErrored}`}>
                            {
                                (this.state.console?.stderr) ?
                                "STDERR"
                                :
                                "STDOUT"
                            }
                        </p>

                        <p>
                            {
                                (this.state.console?.output) ? 
                                this.state.console?.output
                                :
                                "Press 'Run' to run code."
                            }
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default TextEditor

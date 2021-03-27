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
class TextEditor extends React.Component<{lan: string, onChange: Function, placeholder: string}, {console: string, consoleVisible: boolean}> {
    constructor(props) {
        super(props);

        this.state = { console: '', consoleVisible: false };
    }
    
    render() {
        return (
            <div className="textEditor">
                <div className={styles.textEditorToolbar}>
                    <h5>main.js</h5> 
                </div>
                
                <AceEditor
                    mode={`${this.props.lan}`}
                    theme="solarized_dark"
                    // @ts-ignore
                    onChange={this.props.onChange}
                    name="editor"
                    editorProps={{
                        $blockScrolling: true
                    }}
                    fontSize={"16px"}
                    height=''
                    width='100%'
                    value={this.props.placeholder}
                    tabSize={2}
                />

                <div className={styles.textEditorFooter}>
                    <div className={styles.textEditorFooterSticky}>
                        <p>CONSOLE</p>

                        <Button title={"Run"} onClick={async () => {
                            const response = await axios.post(
                                "https://emkc.org/api/v1/piston/execute",
                                {
                                    "language": this.props.lan,
                                    "source": this.props.placeholder,
                                    "args": []
                                },
                                { headers: {'Content-Type': 'application/json'} }
                            )

                            this.setState({ console: response.data.output, consoleVisible: true });
                        }}/>
                    </div>

                    <div hidden={this.state.consoleVisible}>
                        <p>
                            {this.state.console}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default TextEditor

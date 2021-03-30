import AceEditor from 'react-ace';

import styles from '@styles/Home.module.css'
import brace from 'brace';
import "brace/theme/solarized_dark";
import "brace/theme/tomorrow_night";

import 'brace/theme/github';
import "brace/mode/javascript"

import React, { useEffect, useState } from 'react'
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

const TextEditor: React.FC<{lan: string, onChange: Function, placeholder: string, onReset?: Function}> = ({ lan, placeholder, onChange, onReset }) => {
    const [ console, setConsole ] = useState(null);
    const [ consoleVisible, setConsoleVisible ] = useState(true);
    const [ codeValue, setCodeValue ] = useState(placeholder);

    useEffect(() => {
        onChange(codeValue);
    }, [codeValue, placeholder])

    useEffect(() => {
        setCodeValue(placeholder);
    }, [placeholder])
    
    return (
        <div className="textEditor">
            <div className={styles.textEditorToolbar}>
                <h5>main.js</h5> 


                <Button title={"Reset"} onClick={async (e, callback) => {
                    onReset(placeholder, (__e) => {
                        setCodeValue(__e)
                    });

                    callback();
                }}/>

                <Button title={"Run"} onClick={async (e, callback) => {
                    const response = await axios.post(
                        "https://emkc.org/api/v1/piston/execute",
                        {
                            "language": lan,
                            "source": codeValue,
                            "args": []
                        },
                        { headers: {'Content-Type': 'application/json'} }
                    ).then((res) => {
                        callback();
                        return res;
                    })

                    setConsoleVisible(false);
                    setConsole(response.data);
                }}/>
            </div>
            
            <AceEditor
                mode={`${lan}`}
                theme="solarized_dark"
                // @ts-ignore
                onChange={setCodeValue}
                name="editor"
                editorProps={{
                    $blockScrolling: true
                }}
                fontSize={"16px"}
                height=''
                width='100%'
                value={codeValue}
                tabSize={2}
            />

            <div className={styles.textEditorFooter}>
                <div className={styles.textEditorFooterSticky}>
                    <p>CONSOLE</p>

                    <FontAwesomeIcon icon={(!consoleVisible) ? faChevronUp : faChevronDown} onClick={() => {
                        setConsoleVisible(!consoleVisible);
                    }}/>
                </div>

                <div hidden={consoleVisible} className={`${styles.consoleElement} ${(!consoleVisible) ? styles.consoleVisible : styles.consoleInvisible}`}>
                    <p className={`${styles.consoleHeader} ${(!console?.stderr) ? styles.consoleCompiled : styles.consoleErrored}`}>
                        {
                            (console?.stderr) ?
                            "STDERR"
                            :
                            "STDOUT"
                        }
                    </p>

                    <p>
                        {
                            (console?.output) ? 
                            console?.output
                            :
                            "Press 'Run' to run code."
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TextEditor

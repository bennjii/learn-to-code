import AceEditor from 'react-ace';

import brace from 'brace';
import "brace/theme/solarized_dark";
import "brace/theme/tomorrow_night";

import 'brace/theme/github';
import "brace/mode/javascript"

import React from 'react'
class TextEditor extends React.Component<{lan: string, onChange: Function, placeholder: string}> {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // const customMode = new CustomSqlMode();
        // this.refs.aceEditor.editor.getSession().setMode(customMode);
    }
    
    render() {
        return (
            <div className="textEditor">
                <div>
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
            </div>
        );
    }
}

export default TextEditor

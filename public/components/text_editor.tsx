import AceEditor from 'react-ace';

import brace from 'brace';
// import "brace/theme/nightowl";
import "brace/theme/solarized_dark";

import 'brace/theme/github';
import "brace/mode/javascript"

const TextEditor = (props) => (
    <div className="textEditor">
        <div>
            <h5>main.js</h5> 
        </div>
        
        <AceEditor
            mode={`${props.lan}`}
            theme="solarized_dark"
            onChange={props.onChange}
            name="editor"
            editorProps={{
                $blockScrolling: true
            }}
            fontSize={"16px"}
            height=''
            width='100%'
            value={props.placeholder}
        />

        {
        /* 
            <MonacoEditor
                width="800"
                height="600"
                language="javascript"
                theme="vs-dark"
                value={`const foo = 'bar';`}
                options={{
                    selectOnLineNumbers: true
                }}
                onChange={console.log}
            /> 
        */
        }
    </div>
)

export default TextEditor

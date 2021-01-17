import AceEditor from 'react-ace';

import * as ace from 'brace';
import "brace/theme/night_owl";
import "brace/theme/solarized_dark"
import "brace/mode/javascript"

const textEditor = (props) => (
    <div className="textEditor">
        {/* <h5>main.js</h5>  */}

        <AceEditor
            mode={`${props.lan}`}
            theme="night_owl"
            onChange={props.onChange}
            name="editor"
            editorProps={{
                $blockScrolling: true
            }}
            fontSize={"16px"}
            height=''
            width='100%'
        />

        {/* <MonacoEditor
            width="800"
            height="600"
            language="javascript"
            theme="vs-dark"
            value={`const foo = 'bar';`}
            options={{
                selectOnLineNumbers: true
            }}
            onChange={console.log}
        /> */}
    </div>
)

export default textEditor

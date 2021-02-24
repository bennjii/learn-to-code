import React, {Component} from 'react'
import { Editor, EditorState } from 'draft-js'

class ContentEditor extends Component<{}, {editorState: EditorState}> {
    constructor(props) {
        super(props)
        this.state = {
            editorState: EditorState.createEmpty()
        }
    }

    onChange(editorState) {
        this.setState({
            editorState: editorState
        })
    }

    render() {
        return (
            <div className="blog-editor">
                <Editor editorState={this.state.editorState} onChange={this.onChange.bind(this)}/>
            </div>
        )
    }
}

export { ContentEditor }

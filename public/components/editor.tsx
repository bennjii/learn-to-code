import React, {Component} from 'react'
import { Editor, EditorState, convertFromRaw } from 'draft-js'

class SimpleEditor extends Component<{content: string}, {editorState: EditorState}> {
  constructor(props) {
    super(props);

    const emptyContentState = convertFromRaw({
        entityMap: {},
        blocks: [
            {
                text: '',
                key: 'foo',
                type: 'unstyled',
                entityRanges: [],
            },
        ],
    });

    this.state = {
      editorState: EditorState.createWithContent(emptyContentState),
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(es) {
    this.setState({editorState: es})
  }

  render() {
    return (
      <div style={{border: '1px solid black', padding: 10}}>
        <Editor
          placeholder="Write something!"
          editorKey="foobaz"
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export { SimpleEditor }
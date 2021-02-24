import React, {Component} from 'react'
import { Editor, EditorState, convertFromRaw, ContentState } from 'draft-js'
import styles from '../../styles/Home.module.css'

type Lesson = {
  desc: string,
  instructions?: Array<Instruction>,
  name: string,
  template_code?: string
}

type Instruction = {
  desc: string,
  desired_output: string,
  server_code?: string
}

class SimpleEditor extends Component<{content: ContentState | string, changeParent: Function, currentParent: Lesson}, {editorState: EditorState}> {
  constructor(props) {
    super(props);

    let content;

    if(typeof this.props.content === "string") {
      content = convertFromRaw({
        entityMap: {},
        blocks: [
            {
                text: this.props.content,
                key: 'foo',
                type: 'unstyled',
                entityRanges: [],
            },
        ],
      });
    }else {
      content = this.props.content;
    }

    this.state = {
      editorState: EditorState.createWithContent(content),
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(es) {
    this.setState({editorState: es}, () => {
      this.props.currentParent.desc = es.getCurrentContent()
      this.props.changeParent(this.props.currentParent)

      this.forceUpdate();
    });
  }

  render() {
    return (
      <div>
        <Editor
          placeholder={`Write about ${this.props.currentParent.name}`}
          editorKey="foobaz"
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export { SimpleEditor }
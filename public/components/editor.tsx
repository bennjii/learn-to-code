import React, {Component} from 'react'
import Editor from 'draft-js-plugins-editor'
import { EditorState, convertFromRaw, ContentState } from 'draft-js'

import styles from '../../styles/Home.module.css'
import buttonStyles from '../../styles/Home.button.module.css';
import toolbarStyles from '../../styles/Home.toolbar.module.css';

import 'draft-js-inline-toolbar-plugin/lib/plugin.css';

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  UnorderedListButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from "draft-js-buttons";

import createToolbarPlugin, { Separator } from "draft-js-static-toolbar-plugin";

const inlineToolbarPlugin = createToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
    Separator,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton
  ],
  theme: { buttonStyles, toolbarStyles }
});

const plugins = [inlineToolbarPlugin];
const { Toolbar } = inlineToolbarPlugin;

const styleMap = {
  'CODE': {
    backgroundColor: '#051927',
    fontFamily: 'monospace',
    color: '#f4f4f4',
    padding: '1rem',
    borderRadius: '5px',
    width: '100%',
    display: 'block',
    boxSizing: 'border-box'
  },
};


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

class SimpleEditor extends Component<{content: ContentState | string, changeParent: Function, currentParent: Lesson, callback: Function}, {editorState: EditorState}> {
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
      content = convertFromRaw(this.props.content);
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
      this.props.callback();

      this.forceUpdate();
    });
  }

  render() {
    return (
      <div className={styles.editor}>
        <Toolbar />

        <Editor
          // @ts-ignore
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={[plugins, inlineToolbarPlugin]}
          customStyleMap={styleMap}
        />
      </div>
    );
  }
}

export { SimpleEditor }
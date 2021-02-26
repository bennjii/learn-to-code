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
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';

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
      this.props.callback();

      this.forceUpdate();
    });
  }

  render() {
    return (
      <div>
        <Toolbar />

        {
          // placeholder={`Write about ${this.props.currentParent.name}`}
          // editorKey="foobaz" 
        }
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
        />
      </div>
    );
  }
}

export { SimpleEditor }
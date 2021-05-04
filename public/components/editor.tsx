import React, { useState, useEffect } from 'react'
import Editor from 'draft-js-plugins-editor'
import { EditorState, convertFromRaw, ContentState, createFromBlockArray } from 'draft-js'

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
} from "@draft-js-plugins/buttons";

import createToolbarPlugin, { Separator } from "@draft-js-plugins/static-toolbar";

const inlineToolbarPlugin = createToolbarPlugin({
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
  }, 'blockquote': {
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

const SimpleEditor: React.FC<{content: ContentState | string, changeParent: Function, currentParent: Lesson, callback: Function}> = ({ content, changeParent, currentParent, callback }) => {
  const _content = (content.blocks) ? convertFromRaw(content) : content;
  const [ editorState, setEditorState ] = useState(EditorState.createWithContent(_content));

  const onChange = (es) => {
    setEditorState(es);

    currentParent.desc = es.getCurrentContent()
    changeParent(currentParent)
    callback();
  }

  useEffect(() => {
    let keyPair = content
    if(content.blocks) keyPair = convertFromRaw(keyPair);

    setEditorState(EditorState.createWithContent(keyPair));
  }, [content])

  return (
    <div className={styles.editor}>
      <Toolbar>
          {
            (externalProps) => (
              <React.Fragment>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <CodeButton {...externalProps} />
                
                <HeadlineOneButton {...externalProps} />
                <HeadlineTwoButton {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps} />
              </React.Fragment>
            )
          }
        </Toolbar>

      <Editor
        // @ts-ignore
        editorState={editorState}
        onChange={onChange}
        plugins={[plugins, inlineToolbarPlugin]}
        customStyleMap={styleMap}
        spellCheck
      />
    </div>
  );
}

export { SimpleEditor }
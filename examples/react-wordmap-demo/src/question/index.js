import React, { useRef, useEffect } from 'react'

import WordMap from 'wordmap';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { snippet, editSnippet } from './code';
import { WORD_URL } from '../constant';


export const QuestionConstellation = () => {
  const containerRef = useRef();
  const containerRefEdit = useRef();

  useEffect(() => {
    new WordMap({
      containerEl: containerRef.current,
      url: WORD_URL,
      mode: "question",
    })
    new WordMap({
      containerEl: containerRefEdit.current,
      url: WORD_URL,
      mode: "question",
      props: {
        operation: "edit"
      }
    })

    return () => {
      containerRef?.current?.removeChild(containerRef.current.children[ 0 ])
      containerRefEdit?.current?.removeChild(containerRefEdit.current.children[ 0 ])
    }
  }, [])

  return (
    <div className='container'>
      <section className="left">
        <div className="code-snippet">
          <SyntaxHighlighter language="javascript" style={dark}>
            {snippet}
          </SyntaxHighlighter>
        </div>
        <div className="wordmap-container" ref={containerRef}></div>
      </section>
      <section className="right">
        <div className="code-snippet">
          <SyntaxHighlighter language="javascript" style={dark}>
            {editSnippet}
          </SyntaxHighlighter>
        </div>
        <div className="wordmap-container" ref={containerRefEdit}></div>
      </section>
    </div>
  )
}

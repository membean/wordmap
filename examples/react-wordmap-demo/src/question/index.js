import React, { useRef, useEffect } from 'react'

import WordMap from 'wordmap';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { snippet } from './code';
import { WORD_URL } from '../constant';


export const QuestionConstellation = () => {
  const containerRef = useRef();

  useEffect(() => {
    new WordMap({
      containerEl: containerRef.current,
      url: WORD_URL,
      mode: "question"
    })

    return () => {
      containerRef?.current?.removeChild(containerRef.current.children[ 0 ])
    }
  }, [])

  return (
    <>
      <div className="code-snippet">
        <SyntaxHighlighter language="javascript" style={dark}>
          {snippet}
        </SyntaxHighlighter>
      </div>
      <div className="wordmap-container" ref={containerRef}></div>
    </>
  )
}

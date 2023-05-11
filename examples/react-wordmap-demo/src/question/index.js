import React, { useRef, useEffect } from 'react'

import WordMap from 'wordmap';
import { constellationData } from '../data'

import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { snippet } from './code';


export const QuestionConstellation = () => {
  const containerRef = useRef();

  useEffect(() => {
    new WordMap(
      containerRef.current,
      "q",
      null,
      'https://mbcdn.membean.com/data/cons/json-named/immaculate.json',
      constellationData,
      () => {},
      {}
    )

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

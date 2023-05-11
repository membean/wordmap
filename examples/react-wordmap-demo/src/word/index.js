import React, { useRef, useEffect } from 'react'

import WordMap from 'wordmap';
import { constellationData } from '../data'

import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { snippet } from './code';

export const WordConstellation = () => {
  const containerRef = useRef();

  useEffect(() => {
    new WordMap(
      containerRef.current,
      null,
      null,
      'https://mbcdn.membean.com/data/cons/json-named/plethora.json',
      null,
      null,
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

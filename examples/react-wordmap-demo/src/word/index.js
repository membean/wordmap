import React, { useRef, useEffect } from 'react'

import WordMap from 'wordmap';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { WORD_URL } from '../constant'
import { snippet } from './code';

export const WordConstellation = () => {
  const containerRef = useRef();

  useEffect(() => {
    new WordMap({
      containerEl: containerRef.current,
      url: WORD_URL
    })

    return () => {
      containerRef?.current?.removeChild(containerRef.current.children[ 0 ])
    }
  }, [])



  return (
    <section>
      <div className="code-snippet">
        <SyntaxHighlighter language="javascript" style={dark}>
          {snippet}
        </SyntaxHighlighter>
      </div>
      <div className="wordmap-container" ref={containerRef}></div>
    </section>
  )
}

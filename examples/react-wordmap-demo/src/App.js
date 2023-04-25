import React, { useEffect, useRef } from 'react'
import './App.css';

import WordMap from 'wordmap';
import { constellationData } from './data'

function App() {
  const containerRef = useRef();

  useEffect(() => {
    new WordMap(
      containerRef.current,
      "coalition",
      null,
      null,
      constellationData,
      () => {},
      {}
    )

    return () => {
      containerRef.current.removeChild(containerRef.current.children[ 0 ])
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Wordmap
        </p>
      </header>
      <section>
        <div className="wordmap-container" ref={containerRef}></div>
      </section>
    </div>
  );
}

export default App;

import React, { useState } from 'react'
import './App.css';

import { WordConstellation } from './word';
import { QuestionConstellation } from './question';

function App() {
  const [ isQuestion, setIsQuestion ] = useState(true);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Wordmap</h2>
        <div>
          <button onClick={() => setIsQuestion(false)}>Word Constellation</button>
          <button onClick={() => setIsQuestion(true)}>Question Constellation</button>
        </div>
      </header>
      <div>
        <div>
          <section>
            {!isQuestion ?
              <WordConstellation /> : <QuestionConstellation />
            }
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;

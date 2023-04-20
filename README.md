#

<p align="center"> 
  <img src="./wordmap.png" width="30%" title="Wordmap Demo" alt="Wordmap Demo">
<p>

# Wordmap

The Wordmap is a tool that enhances vocabulary learning through visual organization, and is a shared module that can be utilized on both Membean and Memseed.

# To Install

The most convenient method is to execute either
 
```
yarn add wordmap@git+https://github.com/membean/wordmap.git
```

OR

```
npm install wordmap@git+https://github.com/membean/wordmap.git
```

>  Note: you must have access to Wordmap repository in order to install it as node package / module.

# Prerequesites

Before using the Wordmap, make sure that you have globally installed create.js to enable the module's functionality. 

Additionally, add below script to your index.html.

```

<script src="https://code.createjs.com/1.0.0/createjs.min.js"></script>

```

# Usage 

React

Import createJs in public html

```
./public/index.html

<head>
  <script src="https://code.createjs.com/1.0.0/createjs.min.js"></script>
<head>

```

Using wordmap on a React component.

```
/// imports
import WordMap from 'wordmap';
.
.
.
function App() {
  const containerRef = useRef();

  useEffect(() => {
    new WordMap(
      containerRef.current,
      "coalition", // word to pass
      null,
      null,
      constellationData, // constellation or wordmap data
      () => {},
      {}
    )

    return () => {
      containerRef.current.removeChild(containerRef.current.children[ 0 ])
    }
  }, [])

  return (
    <>
      <section>
        <div ref={containerRef}></div>
      </section>
    </>
  );
}

```

## Props & Methods

Props and argument that you can pass to word maps.

- `containerEl` : `HTMLElement`- a reference to the wordmap-container div from the Constellation component
- `wf` : `string`  - the wordform or Word for the current constellation
- `mode` : `'q'`  - used to determine the constellaton mode, defaults to 'word' which is used for WordPage, you can pass 'q' for questions.
- `animate` : `true | false`  - Used to turn animation on/off. Default is on 
- `data` : `Object`  - The JSON for the active word constellation
- `fetchConstellationData` : `Callback to fetch the data`  - The method for fetching constellation data used in the Constellation component. Used as a CB in the classes
- `props`  - The Constellation component props
  - `fullscreen` : `true | false` - to make the constellation as fullscreen

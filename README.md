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

In order to use the Wordmap module, it's necessary to have `create.js` installed globally in your application.

You can install `create.js` by adding script provided below to your `index.html`.

```

<script src="https://cdn0.membean.com/public/vendor/javascripts/createjs-2015.11.26.min.js"></script>

```

# Usage 

React

Import createJs in public html

```
./public/index.html

<head>
  <script src="https://cdn0.membean.com/public/vendor/javascripts/createjs-2015.11.26.min.js"></script>
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

## Styles.

To render the constellation graph correctly make sure container element have equal width & height like square.
```
.container {
  display: block;
  width: 350px;
  height: 350px;
}
```

## Props & Methods

Props and argument that you can pass to word maps.

 - @param {Object} containerEl [Required] - a reference to the wordmap-container div from the Constellation component
 - @param {String} mode [Optional] - used to determine the constellaton mode
 -    Default value is 'word'
 - @param {Boolean} animate [Optional] - Used to turn animation on/off. Default is on
 -    Default value is true
 - @param {String} url - used to fetch the constellation data.
    [Required] - In case when constellation need to use in readonly mode label click will be disabled eg. question  page.
 -    [Optional] - In case when constellation need to be interactive eg word mode
 - @param {Object} data - The JSON for the active word constellation
 -    [Required] - In case of Interactive mode of constellation like forward backword mode.
 @param {Function} fetchCallback - The callback method to fetch data for constellation, callback trigger when click - on label.  which accepts 2 args like word & callback with data to renrender graph.
 -    [Required] - In case of Interactive mode of constellation like forward backword mode.
 - @param {Object} props [Optional] - The Constellation component props
    Default value is {} 
    eg. `fullscreen` : `true | false` - to make the constellation as fullscreen


## Examples

Please refer [examples](./examples)

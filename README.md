# Wordmap

A Wordmap is a visual organizer that promotes vocabulary development, it's shared module used on Membean and Memseed.

# Installation and usage

The easiest way to use Wordmap is to install
 
```
yarn add wordmap@git+https://github.com/membean/wordmap.git
```


OR

```
npm install wordmap@git+https://github.com/membean/wordmap.git
```

> note: make sure you have access to wordmap repository to install it.


# Prerequesites

Make sure you have create.js install globally to get this module working.

## Install createjs.

Add below script to index.html 

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


Usage of wordmap on react component.

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

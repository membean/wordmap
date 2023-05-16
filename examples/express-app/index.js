const express = require('express');

const app = express();

app.use(express.static('vanilla'))

app.use('/wordmap/index.js', express.static(__dirname + '/node_modules/wordmap/src/index.js'));

app.use('/wordmap', express.static(__dirname + '/node_modules/wordmap/src/'));

app.listen(8081, function () {
  console.log(`Simple web app running at port 8081!`)
})

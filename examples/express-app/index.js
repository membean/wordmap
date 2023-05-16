const express = require('express');
const fs = require('fs')
const app = express();

app.use(express.static('vanilla'))

app.use('/wordmap/index.js', express.static(__dirname + '/node_modules/wordmap/src/index.js'));

app.use('/wordmap', express.static(__dirname + '/node_modules/wordmap/bundle/'));

app.get('/api/data.json', (req, res) => {

  fs.readFile('./data.json', (err, json) => {
      let obj = JSON.parse(json);
      res.json(obj);
  });

});

app.listen(8081, function () {
  console.log(`Simple web app running at port 8081!`)
})

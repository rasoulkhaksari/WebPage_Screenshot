const express = require('express');
const app = express();
const path = require('path')
const port = 3000;

app.use(express.static(path.join(__dirname, 'kross')))
const html=`<!DOCTYPE html>
<html>
    <head><title>webpage</title></head>
    <body>
        <h1>home page</h1>
    </body>
</html>`;

app.get('/', (req, res) => {
  // res.send(html);
  res.sendFile(`${__dirname}/kross/index.html`);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
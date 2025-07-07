const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const port =3000;
const path = require('node:path');

const options = {
  key: fs.readFileSync('./cert/localhost.key'),
  cert: fs.readFileSync('./cert/localhost.crt'),
};
//const server = https.createServer(options,app);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req,res)=>{
  res.send('hello');
});

app.listen(port,()=>{
  console.log('App is listening on port 3000');
});


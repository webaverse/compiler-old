const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const fiber = require('@react-three/fiber');
const ReactDOM = require('react-dom');
const React = require('react');
const babelStandalone = require('babel-standalone');
// const ReactJSX = require('react-jsx');
// const { useRef, useState } = React;
console.log('started');

const httpPort = process.env.HTTP_PORT || 10000;

console.log("HTTP Port is", httpPort);

const app = express();
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});
const appStatic = express.static(__dirname);
app.use(appStatic);
app.post('/', (req, res, next) => {
  const bs = [];
  req.on('data', d => {
    bs.push(d);
  });
  req.on('end', () => {
    const b = Buffer.concat(bs);
    bs.length = 0;
    
    const s = b.toString('utf8');
    const spec = babelStandalone.transform(s, {
      presets: ['react'],
    });
    console.log('got spec', spec);
    res.end(spec.code);
  });
  req.on('error', err => {
    res.status = 500;
    res.end(err.stack);
  });
});  
// app.use(appStatic);

http.createServer(app)
  .listen(httpPort);
console.log('http://localhost:'+httpPort);

// module.exports = {fiber, ReactDOM, React, babelStandalone};
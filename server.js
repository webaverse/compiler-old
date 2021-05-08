const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const fetch = require('node-fetch');
const fiber = require('@react-three/fiber');
const ReactDOM = require('react-dom');
const React = require('react');
const babelStandalone = require('babel-standalone');
const JSZip = require('jszip');
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
app.post('/', async (req, res, next) => {
  let {
    u: scriptUrl,
    src,
  } = req.query;
  
  if (!scriptUrl && src) {
    scriptUrl = src;
  }
  
  if (scriptUrl) {
    const urlCache = {};
    const _mapUrl = async (u, scriptUrl) => {
      const cachedContent = urlCache[u];
      if (cachedContent !== undefined) {
        // return u;
        // nothing
      } else {
        const fullUrl = new URL(u, scriptUrl).href;
        const res = await fetch(fullUrl);
        if (res.ok) {
          let importScript = await res.text();
          importScript = await _mapScript(importScript, fullUrl);
          urlCache[u.replace(/^\.\//, '')] = importScript;
        } else {
          throw new Error('failed to load import url: ' + u);
        }
      }
    };
    const _mapScript = async (script, scriptUrl) => {
      // const r = /^(\s*import[^\n]+from\s*['"])(.+)(['"])/gm;
      const r = /(import(?:["'\s]*[\w*{}\n\r\t, ]+from\s*)?["'\s])([@\w_\-\.\/]+)(["'\s].*);$/gm;
      const replacements = await Promise.all(Array.from(script.matchAll(r)).map(async match => {
        let u = match[2];
        if (/^\.+\//.test(u)) {
          await _mapUrl(u, scriptUrl);
        }
        return u;
      }));
      let index = 0;
      script = script.replace(r, function() {
        return arguments[1] + replacements[index++] + arguments[3];
      });
      const spec = babelStandalone.transform(script, {
        presets: ['react'],
      });
      script = spec.code;
      return script;
    };
    const _fetchAndCompile = async (s, scriptUrl) => {
      s = await _mapScript(s, scriptUrl);
      urlCache[new URL(scriptUrl).pathname.replace(/^\//, '')] = s;
      
      const zip = new JSZip();
      for (const p in urlCache) {
        const d = urlCache[p];
        console.log('add file', p);
        zip.file(p, d);
      }
      const ab = await zip.generateAsync({
        type: 'arraybuffer',
      });
      return Buffer.from(ab);
    };
    
    if (!src) {
      const bs = [];
      req.on('data', d => {
        bs.push(d);
      });
      req.on('end', async () => {
        try {
          const b = Buffer.concat(bs);
          bs.length = 0;
          
          // console.log('render', b.length);
          
          let s = b.toString('utf8');
          const d = await _fetchAndCompile(s, scriptUrl);
          
          res.end(d);
        } catch (err) {
          res.statusCode = 500;
          res.end(err.stack);
        }
      });
      req.on('error', err => {
        res.statusCode = 500;
        res.end(err.stack);
      });
    } else {
      try {
        const proxyRes = await fetch(src);
        const s = await proxyRes.text();
        const d = await _fetchAndCompile(s, scriptUrl);
        
        res.end(d);
      } catch (err) {
        res.statusCode = 500;
        res.end(err.stack);
      }
    }
  } else {
    res.statusCode = 400;
    res.end();
  }
});  
// app.use(appStatic);

http.createServer(app)
  .listen(httpPort);
console.log('http://localhost:'+httpPort);

// module.exports = {fiber, ReactDOM, React, babelStandalone};
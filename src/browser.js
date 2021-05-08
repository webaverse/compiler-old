import reactThreeFiber from '@react-three/fiber';
import React from 'react';
import ReactDOM from 'react-dom';
import * as babelStandalone from '@babel/standalone';

const browser = {
  reactThreeFiber,
  React,
  ReactDOM,
  babelStandalone,
};
console.log('load browser', browser);
globalThis.browser = browser;
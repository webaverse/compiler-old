#!/bin/bash

parcel build ./src/browser.js
cat prefix.js index.js postfix.js >browser.js

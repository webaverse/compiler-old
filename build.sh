#!/bin/bash

parcel build --no-cache ./src/browser.js
cat prefix.js index.js postfix.js >browser.js

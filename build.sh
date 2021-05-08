#!/bin/bash

parcel build --no-cache ./src/browser.js
cat prefix.js dist/browser/browser.js postfix.js >browser.js

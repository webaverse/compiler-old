#!/bin/bash

parcel build --no-cache --dist-dir dist ./src/browser.js
# cat prefix.js dist/browser/browser.js postfix.js >dist/browser/browser2.js

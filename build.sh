#!/bin/bash

rm -Rf dist/ .parcel-cache/
parcel build --no-cache --dist-dir dist ./src/browser.js
# cat prefix.js dist/browser/browser.js postfix.js >dist/browser/browser2.js

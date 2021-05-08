#!/bin/bash

parcel build browser.js
cat prefix.js dist/browser/browser.js postfix.js >dist/browser/browser2.js

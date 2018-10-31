#!/bin/sh
npm run build
rm -rf ../../osa3teht/build
cp -r build ../../osa3teht

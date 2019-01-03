#!/usr/bin/env bash

(cd modules/angular && yarn ng build char-sheet -c de-gh-pages)

git add modules/angular/dist -f
git commit -m "build"
git push --delete origin gh-pages
git subtree push --prefix modules/angular/dist/apps/char-sheet origin gh-pages
git reset --hard HEAD^1

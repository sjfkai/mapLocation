#!/bin/bash

set -e
yarn build
cd build
git init
git config --global user.name "sjfkai"
git config --global user.email "sjfkai@163.com"
git add .
git commit -m "republish"
git remote add github $GIT_REPO
git fetch github
git push github master:gh-pages -f
git remote add coding $CODING_REPO
git fetch coding
git push coding master:coding-pages -f

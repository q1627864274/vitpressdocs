#!/usr/bin/env-sh
set -e

npm run docs:build

cd docs/.vitepress/dist

git init

git add -A

git commit -m "gitee actions 自动化部署"

git push -f https://github.com/q1627864274/q1627864274.github.io.git master

cd -

rm -rf docs/.vitepress/dist


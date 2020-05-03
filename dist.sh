#!/bin/sh

archiveName=$(cat package.json | jq '.name,.version' -r | xargs | sed "s/ /-/g" | sed "s/$/.tar.gz/")
commitSha=$(git rev-parse HEAD)

# Create archive from latest commit
echo " >  Create git archive from commit $commitSha..."
rm -rf dist/
mkdir dist
git archive --format=tar.gz "$commitSha" > "dist/$archiveName"

# Create asset archive
echo " >  Recompile assets..."
rm -rf frontend/static/css/
rm -rf frontend/static/js/
npm run compile:scss
npm run compile:js

echo " >  Create asset archive..."
tar -czvf dist/assets.tar.gz frontend/static/js/ frontend/static/css/

echo " >  Done."

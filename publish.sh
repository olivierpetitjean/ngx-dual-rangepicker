#!/usr/bin/env bash
set -e
echo "Building library for production..."
ng build ngx-dual-rangepicker --configuration=production
echo "Publishing to npm..."
cd build/ngx-dual-rangepicker
npm publish

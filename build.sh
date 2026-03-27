#!/usr/bin/env bash
set -e
echo "Building ngx-dual-rangepicker for production..."
ng build ngx-dual-rangepicker --configuration=production
echo "Build complete. Output: build/ngx-dual-rangepicker"

#!/usr/bin/env bash
set -e
echo "Running library tests..."
ng test ngx-dual-rangepicker --watch=false --code-coverage

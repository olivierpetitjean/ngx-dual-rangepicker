#!/usr/bin/env bash
set -e
echo "Starting demo app in dev mode..."
echo "  Imports are resolved directly from library source via tsconfig paths."
echo "  Open http://localhost:4200"
ng serve demo --open

#!/bin/bash
cd /home/z/my-project

# Kill any existing
pkill -f "next-server" 2>/dev/null || true
sleep 1

# Start Next.js - use node directly to avoid npx subprocess issues
exec node node_modules/.bin/next dev -p 3000
